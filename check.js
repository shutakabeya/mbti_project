const { MongoClient } = require('mongodb');

async function checkDatabase() {
    const uri = 'mongodb://localhost:27017';
    const client = new MongoClient(uri);

    try {
        await client.connect();
        console.log('MongoDBに接続しました');

        const database = client.db('mbti_project');
        const collection = database.collection('companies');

        // 全レコード数を取得
        const count = await collection.countDocuments();
        console.log(`データベース内のレコード数: ${count}`);

        // 最初の5件のレコードを表示
        const records = await collection.find().limit(5).toArray();
        console.log('\n最初の5件のレコード:');
        console.log(JSON.stringify(records, null, 2));

    } catch (err) {
        console.error('エラーが発生しました:', err);
    } finally {
        await client.close();
        console.log('\nMongoDB接続を閉じました');
    }
}

checkDatabase(); 