const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");
const iconv = require("iconv-lite");

// ✅ MongoDB接続
mongoose.connect("mongodb://127.0.0.1:27017/mbtidb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4
})
  .then(() => console.log("✅ MongoDBに接続成功"))
  .catch((err) => {
    console.error("❌ MongoDB接続エラー:", err);
    process.exit(1);
  });

// ✅ MongoDBスキーマの定義
const CompanySchema = new mongoose.Schema({
  企業名: { type: String, required: true },
  MBTI: String,
  相性のいいMBTI: [String],
  Webサイト: String,
  業界カテゴリ: [String],
  企業規模: String,
  組織文化タグ: [String],
  働き方タグ: [String],
  特徴タグ: [String],
  評価タグ: [String],
  働き方スコア: Number,
  組織文化スコア: Number,
  成長スコア: Number,
  価値観スコア: Number,
  人間関係スコア: Number,
  顧客接点スコア: Number,
  業務スタイルスコア: Number,
  評価スコア: Number,
  多様性スコア: Number,
  安定性スコア: Number,
});

const Company = mongoose.model("Company", CompanySchema);

const csvFilePath = path.resolve(__dirname, "マスターデータ.csv");

// ✅ CSVファイルが存在するかチェック
if (!fs.existsSync(csvFilePath)) {
  console.error(`❌ エラー: CSVファイルが見つかりません (${csvFilePath})`);
  process.exit(1);
}

const records = [];
let processedCount = 0;
let skippedCount = 0;

// タグ文字列を配列に変換する関数
function parseTags(tagString) {
  if (!tagString) return [];
  try {
    // 文字列から余分な記号を削除し、配列に変換
    return tagString
      .replace(/[\[\]']/g, '')  // 角括弧とシングルクォートを削除
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag);
  } catch (error) {
    console.warn(`⚠️ タグのパースに失敗しました: ${tagString}`);
    return [];
  }
}

// 数値に変換する関数
function parseNumber(value) {
  if (!value || value === '') return null;
  const num = Number(value);
  return isNaN(num) ? null : num;
}

// ✅ CSVデータを読み込み
fs.createReadStream(csvFilePath)
  .pipe(iconv.decodeStream('utf8'))
  .pipe(csv())
  .on("data", (row) => {
    try {
      const companyName = (row["企業名"] || "").trim();
      
      if (!companyName) {
        console.warn(`❌ 警告: 企業名が空のレコードをスキップしました (行: ${processedCount + skippedCount + 1})`);
        skippedCount++;
        return;
      }

      const record = {
        企業名: companyName,
        MBTI: (row["MBTI"] || "").trim(),
        相性のいいMBTI: parseTags(row["相性のいいMBTI"]),
        Webサイト: (row["Webサイト"] || "").trim(),
        業界カテゴリ: parseTags(row["業界カテゴリ"]),
        企業規模: (row["企業規模"] || "").trim(),
        組織文化タグ: parseTags(row["組織文化（タグ）"]),
        働き方タグ: parseTags(row["働き方と裁量（タグ）"]),
        特徴タグ: parseTags(row["特徴・傾向（面接で重視されること等）"]),
        評価タグ: parseTags(row["評価と報酬（タグ）"]),
        働き方スコア: parseNumber(row["働き方と裁量"]),
        組織文化スコア: parseNumber(row["組織文化"]),
        成長スコア: parseNumber(row["成長と挑戦"]),
        価値観スコア: parseNumber(row["価値観共鳴"]),
        人間関係スコア: parseNumber(row["人間関係"]),
        顧客接点スコア: parseNumber(row["顧客との接点"]),
        業務スタイルスコア: parseNumber(row["業務スタイル"]),
        評価スコア: parseNumber(row["評価と報酬"]),
        多様性スコア: parseNumber(row["多様性と自分らしさ"]),
        安定性スコア: parseNumber(row["安定と変化"])
      };

      console.log(`✅ 処理中: ${record.企業名}`);
      records.push(record);
      processedCount++;
    } catch (error) {
      console.error(`❌ エラー: レコードの処理中にエラーが発生しました (行: ${processedCount + skippedCount + 1})`, error);
      skippedCount++;
    }
  })
  .on("end", async () => {
    try {
      console.log(`\n✅ 処理完了: ${processedCount}件のレコードを処理しました`);
      console.log(`⚠️ スキップ: ${skippedCount}件のレコードをスキップしました`);
      
      if (records.length === 0) {
        console.error("❌ エラー: 処理可能なレコードがありません");
        process.exit(1);
      }

      await Company.deleteMany({});
      console.log("✅ 既存のデータを削除しました");
      
      await Company.insertMany(records);
      console.log(`✅ データのインポートが完了しました (${records.length}件)`);
      
      const importedCount = await Company.countDocuments();
      console.log(`✅ データベースに保存されたレコード数: ${importedCount}件`);
      
    } catch (err) {
      console.error("❌ エラー: データベース操作中にエラーが発生しました", err);
      process.exit(1);
    } finally {
      await mongoose.connection.close();
      console.log("✅ MongoDB接続を閉じました");
    }
  })
  .on("error", (err) => {
    console.error("❌ エラー: CSVファイルの読み込み中にエラーが発生しました", err);
    process.exit(1);
  });
