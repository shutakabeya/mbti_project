require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB接続
mongoose.connect(process.env.MONGO_URI, {
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
  company_size: String,
  required_skills: [String],
  work_style_score: Number,
  company_culture_score: Number,
  growth_score: Number,
  values_score: Number,
  relationships_score: Number,
  customer_contact_score: Number,
  work_type_score: Number,
  evaluation_score: Number,
  diversity_score: Number,
  stability_score: Number
});

const Company = mongoose.model('Company', CompanySchema);

// MBTIタイプの変換マップ
const mbtiConversionMap = {
  "1": "ISTJ", "2": "ISFJ", "3": "INFJ", "4": "INTJ",
  "5": "ISTP", "6": "ISFP", "7": "INFP", "8": "INTP",
  "9": "ESTP", "10": "ESFP", "11": "ENFP", "12": "ENTP",
  "13": "ESTJ", "14": "ESFJ", "15": "ENFJ", "16": "ENTJ"
};

async function fixData() {
  try {
    const companies = await Company.find();
    let updatedCount = 0;
    
    for (const company of companies) {
      // 文字列フィールドの修正
      const stringFields = ['name', 'website', 'company_size'];
      for (const field of stringFields) {
        if (company[field] && typeof company[field] === 'string') {
          // 文字化けを修正
          company[field] = Buffer.from(company[field], 'binary').toString('utf8');
        }
      }

      // 配列フィールドの修正
      const arrayFields = ['matches', 'required_skills'];
      for (const field of arrayFields) {
        if (company[field] && Array.isArray(company[field])) {
          company[field] = company[field].map(item => {
            if (typeof item === 'string') {
              // 文字化けを修正
              const cleanItem = Buffer.from(item, 'binary').toString('utf8');
              // 余分な文字を削除
              return cleanItem.replace(/[\[\]'"]/g, '').trim();
            }
            return item;
          });
        }
      }

      // スコアフィールドの修正
      const scoreFields = [
        'work_style_score', 'company_culture_score', 'growth_score',
        'values_score', 'relationships_score', 'customer_contact_score',
        'work_type_score', 'evaluation_score', 'diversity_score', 'stability_score'
      ];
      
      for (const field of scoreFields) {
        if (company[field] === null || company[field] === undefined) {
          company[field] = 0;
        }
      }
      
      await company.save();
      updatedCount++;
      console.log(`✅ ${company.name} を更新しました`);
    }
    
    console.log(`✅ 合計 ${updatedCount} 件の企業データを更新しました`);
  } catch (err) {
    console.error("❌ データ修正エラー:", err);
  } finally {
    mongoose.connection.close();
  }
}

fixData(); 