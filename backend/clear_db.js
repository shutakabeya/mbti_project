require('dotenv').config();
const mongoose = require('mongoose');

async function clearDatabase() {
  try {
    const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/mbti_project';
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
      interview_questions: String
    }));

    await Company.deleteMany({});
    console.log('データベースをクリアしました');

    await mongoose.disconnect();
    console.log('MongoDBとの接続を切断しました');
  } catch (error) {
    console.error('エラーが発生しました:', error);
  }
}

clearDatabase(); 