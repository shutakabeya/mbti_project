require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 文字コードの設定
app.use((req, res, next) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  next();
});

// ✅ 環境変数からMongoDBのURLを取得
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log("✅ MongoDB 接続成功"))
  .catch((err) => console.error("❌ MongoDB 接続エラー:", err));

const CompanySchema = new mongoose.Schema({
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
  interview_questions: String
});

const Company = mongoose.model("Company", CompanySchema);

// ✅ MBTIタイプで企業を検索
app.get("/api/match/:mbti", async (req, res) => {
  try {
    const { mbti } = req.params;
    const companies = await Company.find({ mbti });
    
    if (companies.length === 0) {
      return res.status(404).json({
        message: `${mbti}タイプにマッチする企業が見つかりませんでした`
      });
    }
    
    res.json({
      companies,
      message: `${mbti}タイプにマッチする企業を取得しました`
    });
  } catch (err) {
    console.error("❌ 企業検索エラー:", err);
    res.status(500).json({
      message: "企業の検索中にエラーが発生しました"
    });
  }
});

// ✅ 企業一覧API `/api/companies` に変更
app.get("/api/companies", async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    console.error("❌ データ取得エラー:", err);
    res.status(500).json({ error: "データ取得エラー" });
  }
});

// デバッグ用エンドポイント
app.get("/api/debug/companies", async (req, res) => {
  try {
    const companies = await Company.find();
    console.log("データベース内の企業数:", companies.length);
    console.log("MBTIタイプの分布:", companies.reduce((acc, company) => {
      acc[company.mbti] = (acc[company.mbti] || 0) + 1;
      return acc;
    }, {}));
    
    res.json(companies);
  } catch (err) {
    console.error("❌ デバッグデータ取得エラー:", err);
    res.status(500).json({ error: "デバッグデータ取得エラー" });
  }
});

// データベースの状態を確認するエンドポイント
app.get("/api/debug/db-status", async (req, res) => {
  try {
    const count = await Company.countDocuments();
    const mbtiTypes = await Company.distinct("mbti");
    
    res.json({
      totalCompanies: count,
      mbtiTypes: mbtiTypes,
      message: "データベースの状態を確認しました"
    });
  } catch (err) {
    console.error("❌ データベース状態確認エラー:", err);
    res.status(500).json({ error: "データベース状態確認エラー" });
  }
});

// MBTIタイプの変換マップ
const mbtiConversionMap = {
  "1": "ISTJ", "2": "ISFJ", "3": "INFJ", "4": "INTJ",
  "5": "ISTP", "6": "ISFP", "7": "INFP", "8": "INTP",
  "9": "ESTP", "10": "ESFP", "11": "ENFP", "12": "ENTP",
  "13": "ESTJ", "14": "ESFJ", "15": "ENFJ", "16": "ENTJ"
};

// データベースのデータを修正するエンドポイント
app.get("/api/debug/fix-mbti", async (req, res) => {
  try {
    const companies = await Company.find();
    let updatedCount = 0;
    
    for (const company of companies) {
      if (mbtiConversionMap[company.mbti]) {
        company.mbti = mbtiConversionMap[company.mbti];
        if (company.matches && Array.isArray(company.matches)) {
          company.matches = company.matches.map(match => {
            if (mbtiConversionMap[match]) {
              return mbtiConversionMap[match];
            }
            return match;
          });
        }
        await company.save();
        updatedCount++;
      }
    }
    
    res.json({
      message: `${updatedCount}件の企業データを更新しました`,
      totalCompanies: companies.length
    });
  } catch (err) {
    console.error("❌ データ修正エラー:", err);
    res.status(500).json({ error: "データ修正エラー" });
  }
});

// シンプルなデバッグエンドポイント
app.get("/api/debug/simple", async (req, res) => {
  try {
    const companies = await Company.find().limit(5);
    res.json({
      sampleData: companies,
      message: "サンプルデータを取得しました"
    });
  } catch (err) {
    console.error("❌ デバッグエラー:", err);
    res.status(500).json({ error: "デバッグエラー" });
  }
});

// データを修正するエンドポイント
app.get("/api/debug/fix-data", async (req, res) => {
  try {
    const companies = await Company.find();
    let updatedCount = 0;
    
    for (const company of companies) {
      // matchesフィールドの修正
      if (company.matches && Array.isArray(company.matches)) {
        company.matches = company.matches.map(match => {
          // 文字列から余分な文字を削除
          return match.replace(/[\[\]'"]/g, '').trim();
        });
      }
      
      // スコアフィールドの修正
      const scoreFields = [
        'work_style_score', 'company_culture_score', 'growth_score',
        'values_score', 'relationships_score', 'customer_contact_score',
        'work_type_score', 'evaluation_score', 'diversity_score', 'stability_score'
      ];
      
      for (const field of scoreFields) {
        if (company[field] === null) {
          company[field] = 0;
        }
      }
      
      await company.save();
      updatedCount++;
    }
    
    res.json({
      message: `${updatedCount}件の企業データを更新しました`,
      totalCompanies: companies.length
    });
  } catch (err) {
    console.error("❌ データ修正エラー:", err);
    res.status(500).json({ error: "データ修正エラー" });
  }
});

// ✅ Vercel用のPORT設定
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 サーバー起動: http://localhost:${PORT}`));

module.exports = app; // VercelのAPIルートで使うため
