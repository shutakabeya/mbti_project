require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB 接続成功"))
  .catch((err) => console.error("❌ MongoDB 接続エラー:", err));

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


app.get("/match/:mbti", async (req, res) => {
  try {
    const userMbti = req.params.mbti.toUpperCase();
    const companies = await Company.find({ matches: { $in: [userMbti] } });
   
    if (companies.length === 0) {
      return res.status(404).json({ error: "該当する企業が見つかりませんでした" });
    }

    res.json(companies);
  } catch (err) {
    console.error("❌ データ取得エラー:", err);
    res.status(500).json({ error: "サーバーエラー" });
  }
});


// ✅ 企業一覧API: すべての企業を取得
app.get("/companies", async (req, res) => {
  try {
    const companies = await Company.find();
    res.json(companies);
  } catch (err) {
    console.error("❌ データ取得エラー:", err);
    res.status(500).json({ error: "データ取得エラー" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 サーバー起動: http://localhost:${PORT}`));