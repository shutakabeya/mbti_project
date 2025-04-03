const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// ルートのインポート
const authRoutes = require('./routes/auth');
const mbtiRoutes = require('./routes/mbti');
const companyRoutes = require('./routes/companies');
const mbtiPostRoutes = require('./routes/mbti-posts');

// 環境変数の読み込み
dotenv.config();

const app = express();

// ミドルウェア
app.use(cors());
app.use(express.json());

// データベース接続
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDBに接続しました'))
  .catch(err => console.error('MongoDB接続エラー:', err));

// ルートの設定
app.use('/api/auth', authRoutes);
app.use('/api/mbti', mbtiRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/mbti-posts', mbtiPostRoutes);

// エラーハンドリング
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'サーバーエラーが発生しました' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`サーバーがポート${PORT}で起動しました`);
}); 