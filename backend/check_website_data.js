const mongoose = require('mongoose');
const Company = require('./models/Company');

async function checkWebsiteData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mbti_project');
    console.log('MongoDBに接続しました');

    // Webサイトが設定されていない企業の数を確認
    const noWebsiteCount = await Company.countDocuments({ website: { $exists: false } });
    console.log(`Webサイトが設定されていない企業数: ${noWebsiteCount}`);

    // Webサイトが空文字列の企業の数を確認
    const emptyWebsiteCount = await Company.countDocuments({ website: '' });
    console.log(`Webサイトが空文字列の企業数: ${emptyWebsiteCount}`);

    // Webサイトが設定されている企業の数を確認
    const hasWebsiteCount = await Company.countDocuments({ 
      website: { $exists: true, $ne: '' } 
    });
    console.log(`Webサイトが設定されている企業数: ${hasWebsiteCount}`);

    // Webサイトが設定されている企業のサンプルを表示
    const sampleCompanies = await Company.find({ 
      website: { $exists: true, $ne: '' } 
    }).limit(5);
    
    console.log('\nWebサイトが設定されている企業のサンプル:');
    sampleCompanies.forEach(company => {
      console.log(`企業名: ${company.name}`);
      console.log(`Webサイト: ${company.website}`);
      console.log('---');
    });

  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDBとの接続を切断しました');
  }
}

checkWebsiteData(); 