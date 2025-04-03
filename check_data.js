const mongoose = require('mongoose');

// MongoDBに接続
mongoose.connect('mongodb://127.0.0.1:27017/mbtidb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  family: 4
});

// スキーマの定義
const companySchema = new mongoose.Schema({
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

const Company = mongoose.model('Company', companySchema);

// データを取得して表示
async function checkData() {
  try {
    const company = await Company.findOne();
    console.log('取得したデータ:');
    console.log(JSON.stringify(company, null, 2));
    
    const count = await Company.countDocuments();
    console.log(`\n総レコード数: ${count}`);
  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    mongoose.connection.close();
  }
}

checkData(); 