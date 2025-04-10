require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

// MongoDB接続URI
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mbti_project';

// 文字列を配列に変換する関数
function parseArrayString(str) {
  if (!str) return [];
  try {
    // 文字列から余分な文字を削除して配列に変換
    const cleaned = str.replace(/[\[\]']/g, '').trim();
    if (!cleaned) return [];
    return cleaned.split(',').map(item => item.trim()).filter(item => item);
  } catch (err) {
    console.error("配列パースエラー:", err);
    return [];
  }
}

// カラム名を正規化する関数
function normalizeColumnName(header) {
  // 全角スペースを半角スペースに変換し、前後の空白を削除
  return header.replace(/\u3000/g, ' ').trim();
}

const results = [];
let isFirstRow = true;

fs.createReadStream(path.join(__dirname, '..', 'マスターデータ.csv'), { encoding: 'utf8' })
  .pipe(csv({
    separator: ',',
    skipLines: 0,
    headers: false
  }))
  .on('data', (data) => {
    // ヘッダー行をスキップ
    if (isFirstRow) {
      isFirstRow = false;
      return;
    }

    // デバッグ用：最初のデータの列名と値を表示
    if (results.length === 0) {
      console.log("CSVの列名:", Object.keys(data));
      console.log("最初の行の生データ:", data);
      console.log("企業名の値:", data['0']);
    }

    // データの変換処理
    const company = {
      name: data['0']?.trim() || '',
      mbti: data['30']?.trim() || '',
      matches: data['31'] ? data['31'].split(',').map(m => m.trim()) : [],
      website: data['32']?.trim() || '',
      industry: data['33']?.trim() || '',
      company_size: data['34']?.trim() || '',
      company_profile: data['35']?.trim() || '',
      business_description: data['36']?.trim() || '',
      required_skills: data['27'] ? [data['27'].trim()] : [],
      work_style_score: parseInt(data['1']) || 0,
      work_style_tags: parseArrayString(data['2']),
      company_culture_score: parseInt(data['3']) || 0,
      company_culture_tags: parseArrayString(data['4']),
      growth_score: parseInt(data['5']) || 0,
      growth_tags: parseArrayString(data['6']),
      values_score: parseInt(data['7']) || 0,
      values_tags: parseArrayString(data['8']),
      relationships_score: parseInt(data['9']) || 0,
      relationships_tags: parseArrayString(data['10']),
      customer_contact_score: parseInt(data['11']) || 0,
      customer_contact_tags: parseArrayString(data['12']),
      work_type_score: parseInt(data['13']) || 0,
      work_type_tags: parseArrayString(data['14']),
      evaluation_score: parseInt(data['15']) || 0,
      evaluation_tags: parseArrayString(data['16']),
      diversity_score: parseInt(data['17']) || 0,
      diversity_tags: parseArrayString(data['18']),
      stability_score: parseInt(data['19']) || 0,
      stability_tags: parseArrayString(data['20']),
      selection_process: [
        data['21'],
        data['22'],
        data['23'],
        data['24'],
        data['25'],
        data['26']
      ].filter(step => step && step.trim() !== ''),
      deadline_schedule: data['28']?.trim() || '',
      interview_questions: data['29']?.trim() || '',
      hiring_difficulty: parseInt(data['37']) || 0,
      established_year: data['38']?.trim() || '未公開',
      last_year_sales: data['39']?.trim() || '未公開',
      headquarters_location: data['40']?.trim() || '未公開'
    };

    // デバッグ情報の出力
    if (results.length === 0) {
      console.log("デバッグ情報:");
      console.log("入社難易度の生データ:", data['37']);
      console.log("設立年の生データ:", data['38']);
      console.log("昨年度売上高の生データ:", data['39']);
      console.log("本社所在地の生データ:", data['40']);
      console.log("変換後のデータ:", {
        hiring_difficulty: company.hiring_difficulty,
        established_year: company.established_year,
        last_year_sales: company.last_year_sales,
        headquarters_location: company.headquarters_location
      });
    }

    // 企業名が空の場合はスキップ
    if (!company.name) {
      console.log("企業名が空のデータをスキップ:", data);
      return;
    }

    results.push(company);
  })
  .on('end', async () => {
    try {
      if (!MONGODB_URI) {
        throw new Error('MongoDBの接続URIが設定されていません');
      }

      console.log('MongoDBに接続中...', MONGODB_URI);
      await mongoose.connect(MONGODB_URI);
      console.log('MongoDBに接続しました');

      const Company = mongoose.model('Company', new mongoose.Schema({
        name: String,
        mbti: String,
        matches: [String],
        website: String,
        industry: String,
        company_size: String,
        company_profile: String,
        business_description: String,
        required_skills: [String],
        work_style_score: Number,
        work_style_tags: [String],
        company_culture_score: Number,
        company_culture_tags: [String],
        growth_score: Number,
        growth_tags: [String],
        values_score: Number,
        values_tags: [String],
        relationships_score: Number,
        relationships_tags: [String],
        customer_contact_score: Number,
        customer_contact_tags: [String],
        work_type_score: Number,
        work_type_tags: [String],
        evaluation_score: Number,
        evaluation_tags: [String],
        diversity_score: Number,
        diversity_tags: [String],
        stability_score: Number,
        stability_tags: [String],
        selection_process: [String],
        deadline_schedule: String,
        interview_questions: String,
        hiring_difficulty: Number,
        established_year: String,
        last_year_sales: String,
        headquarters_location: String
      }));

      await Company.deleteMany({});
      console.log('既存のデータを削除しました');

      await Company.insertMany(results);
      console.log(`${results.length}件のデータをインポートしました`);

      await mongoose.disconnect();
      console.log('MongoDBとの接続を切断しました');
    } catch (err) {
      console.error('エラーが発生しました:', err);
    }
  }); 