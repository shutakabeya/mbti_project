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

async function clearDatabase() {
  try {
    await Company.deleteMany({});
    console.log("✅ データベースをクリアしました");
  } catch (err) {
    console.error("❌ データベースクリアエラー:", err);
  } finally {
    mongoose.connection.close();
  }
}

clearDatabase(); 