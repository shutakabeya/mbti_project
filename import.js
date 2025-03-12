const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

// ✅ MongoDB接続
mongoose.connect("mongodb+srv://varanesk:Qcqtyt5eYviAk7JQ@cluster0.c7plf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ MongoDBに接続成功"))
  .catch((err) => {
    console.error("❌ MongoDB接続エラー:", err);
    process.exit(1);
  });

// ✅ MongoDBスキーマの定義
const CompanySchema = new mongoose.Schema({
  name: String,
  mbti: String,
  matches: [String],
  website: String,
  industry: String,
  company_size: String,
  company_culture: String,
  work_style: String,
  required_skills: [String],
  evaluation_system: String,
});

const Company = mongoose.model("Company", CompanySchema);

const csvFilePath = path.resolve(__dirname, "これは必ず2回目のデータになるよ.csv");

// ✅ CSVファイルが存在するかチェック
if (!fs.existsSync(csvFilePath)) {
  console.error(`❌ エラー: CSVファイルが見つかりません (${csvFilePath})`);
  process.exit(1);
}

const records = [];

// ✅ CSVデータをバッファに保存
fs.createReadStream(csvFilePath)
  .pipe(csv({ headers: [
    "企業名", "MBTI", "相性のいいMBTI", "Webサイト", 
    "業界カテゴリ", "企業規模", "企業文化", "働き方", 
    "求められるスキル・特性", "評価制度"
  ] }))
  .on("data", (row) => {
    records.push({
      name: row["企業名"],
      mbti: row["MBTI"],
      matches: row["相性のいいMBTI"] ? row["相性のいいMBTI"].split(",").map(s => s.trim()) : [],
      website: row["Webサイト"] || "",
      industry: row["業界カテゴリ"] || "不明",
      company_size: row["企業規模"] || "不明",
      company_culture: row["企業文化"] || "不明",
      work_style: row["働き方"] || "不明",
      required_skills: row["求められるスキル・特性"] ? row["求められるスキル・特性"].split(",").map(s => s.trim()) : [],
      evaluation_system: row["評価制度"] || "不明",
    });
  })
  .on("end", async () => {
    try {
      await Company.deleteMany({}); // ✅ 既存のデータを削除
      await Company.insertMany(records); // ✅ 新しいデータを挿入
      console.log("✅ データのインポートが完了しました");
    } catch (err) {
      console.error("❌ データの挿入に失敗:", err);
    } finally {
      mongoose.connection.close(); // ✅ 接続を閉じる
    }
  })
  .on("error", (err) => {
    console.error("❌ CSVの読み込みエラー:", err);
  });
