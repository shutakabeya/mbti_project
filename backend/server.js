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
  .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/mbti_project', {
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
  interview_questions: String,
  hiring_difficulty: Number,
  established_year: String,
  last_year_sales: String,
  headquarters_location: String
});

const Company = mongoose.model("Company", CompanySchema);

// ✅ MBTIタイプで企業を検索
app.get("/api/match/:mbti", async (req, res) => {
  try {
    const { mbti } = req.params;
    const companies = await Company.find({ matches: mbti });
    
    if (companies.length === 0) {
      return res.status(404).json({
        message: `${mbti}タイプと相性の良い企業が見つかりませんでした`
      });
    }
    
    res.json({
      companies,
      message: `${mbti}タイプと相性の良い企業を取得しました`
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

// 会社一覧を取得するデバッグエンドポイント
app.get("/api/debug/companies", async (req, res) => {
  try {
    const companies = await Company.find({}, 'name _id website matches').limit(5);
    console.log("デバッグ: 会社一覧を取得しました");
    res.json(companies);
  } catch (err) {
    console.error("デバッグエラー:", err);
    res.status(500).json({ error: "デバッグエラー" });
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

// ✅ 企業詳細を取得するAPIエンドポイント
app.get("/api/company/:id", async (req, res) => {
  try {
    console.log("🔍 企業詳細取得リクエスト:", {
      id: req.params.id,
      timestamp: new Date().toISOString()
    });

    const company = await Company.findById(req.params.id);
    
    console.log("📊 取得した企業データ:", {
      id: company?._id,
      name: company?.name,
      website: company?.website,
      matches: company?.matches,
      timestamp: new Date().toISOString()
    });
    
    if (!company) {
      console.log("❌ 企業が見つかりませんでした:", req.params.id);
      return res.status(404).json({
        message: "企業が見つかりませんでした"
      });
    }
    
    res.json(company);
  } catch (err) {
    console.error("❌ 企業詳細取得エラー:", {
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      message: "企業詳細の取得中にエラーが発生しました"
    });
  }
});

// 特定の企業のデータを確認するエンドポイント
app.get("/api/debug/company/:id", async (req, res) => {
  try {
    console.log("🔍 デバッグ: 企業データ確認リクエスト:", {
      id: req.params.id,
      timestamp: new Date().toISOString()
    });

    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        message: "企業が見つかりませんでした"
      });
    }

    // データベースの直接確認用のログ
    console.log("📊 デバッグ: データベースから取得した企業データ:", {
      _id: company._id,
      name: company.name,
      website: company.website,
      matches: company.matches,
      createdAt: company.createdAt,
      updatedAt: company.updatedAt,
      timestamp: new Date().toISOString()
    });
    
    res.json({
      message: "企業データを確認しました",
      data: {
        _id: company._id,
        name: company.name,
        website: company.website,
        matches: company.matches,
        createdAt: company.createdAt,
        updatedAt: company.updatedAt
      }
    });
  } catch (err) {
    console.error("❌ デバッグ: 企業データ確認エラー:", {
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      message: "企業データの確認中にエラーが発生しました"
    });
  }
});

// Webサイトを更新するエンドポイント
app.get("/api/debug/update-website/:id", async (req, res) => {
  try {
    console.log("🔄 Webサイト更新リクエスト:", {
      id: req.params.id,
      timestamp: new Date().toISOString()
    });

    const company = await Company.findById(req.params.id);
    if (!company) {
      return res.status(404).json({
        message: "企業が見つかりませんでした"
      });
    }

    // 更新前のデータをログ
    console.log("📊 更新前の企業データ:", {
      _id: company._id,
      name: company.name,
      website: company.website,
      timestamp: new Date().toISOString()
    });

    // 新しいWebサイトURLを設定
    const oldWebsite = company.website;
    company.website = "https://career.kddi.com/"; // 正しい採用サイトURLに修正

    await company.save();

    // 更新後のデータをログ
    console.log("✅ 更新後の企業データ:", {
      _id: company._id,
      name: company.name,
      website: company.website,
      oldWebsite: oldWebsite,
      timestamp: new Date().toISOString()
    });

    res.json({
      message: "Webサイトを更新しました",
      data: {
        _id: company._id,
        name: company.name,
        website: company.website,
        oldWebsite: oldWebsite
      }
    });
  } catch (err) {
    console.error("❌ Webサイト更新エラー:", {
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      message: "Webサイトの更新中にエラーが発生しました"
    });
  }
});

// データベースの内容を詳細に確認するエンドポイント
app.get("/api/debug/company-details/:id", async (req, res) => {
  try {
    console.log("🔍 企業データ詳細確認リクエスト:", {
      id: req.params.id,
      timestamp: new Date().toISOString()
    });

    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        message: "企業が見つかりませんでした"
      });
    }

    // データベースの生データをログ
    console.log("📊 データベースの生データ:", {
      _id: company._id,
      name: company.name,
      website: company.website,
      rawData: company.toObject(), // 生のデータを取得
      timestamp: new Date().toISOString()
    });
    
    res.json({
      message: "企業データの詳細を確認しました",
      data: company.toObject() // 生のデータを返す
    });
  } catch (err) {
    console.error("❌ 企業データ詳細確認エラー:", {
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      message: "企業データの詳細確認中にエラーが発生しました"
    });
  }
});

// データベースの生データを確認するエンドポイント
app.get("/api/debug/raw-data/:id", async (req, res) => {
  try {
    console.log("🔍 生データ確認リクエスト:", {
      id: req.params.id,
      timestamp: new Date().toISOString()
    });

    const company = await Company.findById(req.params.id);
    
    if (!company) {
      return res.status(404).json({
        message: "企業が見つかりませんでした"
      });
    }

    // データベースの生データをログ
    console.log("📊 データベースの生データ:", {
      _id: company._id,
      name: company.name,
      website: company.website,
      rawData: company.toObject(), // 生のデータを取得
      timestamp: new Date().toISOString()
    });
    
    res.json({
      message: "生データを確認しました",
      data: company.toObject() // 生のデータを返す
    });
  } catch (err) {
    console.error("❌ 生データ確認エラー:", {
      error: err.message,
      stack: err.stack,
      timestamp: new Date().toISOString()
    });
    res.status(500).json({
      message: "生データの確認中にエラーが発生しました"
    });
  }
});

// ✅ Vercel用のPORT設定
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 サーバー起動: http://localhost:${PORT}`));

module.exports = app; // VercelのAPIルートで使うため
