const mongoose = require('mongoose');
const Company = require('./models/Company');

async function checkData() {
  try {
    await mongoose.connect('mongodb://localhost:27017/mbti_project');
    console.log('MongoDBに接続しました');

    // 全データの件数を確認
    const totalCount = await Company.countDocuments();
    console.log(`全データ件数: ${totalCount}`);

    // 最初の5件のデータを表示
    const sampleData = await Company.find().limit(5);
    console.log('\nサンプルデータ:');
    sampleData.forEach(company => {
      console.log(JSON.stringify(company, null, 2));
    });

    // MBTIタイプごとの件数を確認
    const mbtiCounts = await Company.aggregate([
      { $group: { _id: '$mbti', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    console.log('\nMBTIタイプごとの件数:');
    mbtiCounts.forEach(item => {
      console.log(`${item._id}: ${item.count}件`);
    });

    // 相性のいいMBTIの配列の長さを確認
    const matchesLengths = await Company.aggregate([
      { $project: { matchesLength: { $size: '$matches' } } },
      { $group: { _id: '$matchesLength', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    console.log('\n相性のいいMBTIの配列の長さごとの件数:');
    matchesLengths.forEach(item => {
      console.log(`${item._id}個: ${item.count}件`);
    });

  } catch (error) {
    console.error('エラーが発生しました:', error);
  } finally {
    await mongoose.disconnect();
    console.log('MongoDBとの接続を切断しました');
  }
}

checkData(); 