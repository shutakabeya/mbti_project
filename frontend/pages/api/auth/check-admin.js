import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { db } = await connectToDatabase();
    
    // セッションからユーザーIDを取得（実際の実装では認証トークンなどから取得）
    const userId = req.headers['x-user-id'];
    
    if (!userId) {
      return res.status(401).json({ isAdmin: false });
    }

    // ユーザーが管理者かどうかを確認
    const user = await db.collection('users').findOne({ _id: userId });
    
    if (!user || !user.isAdmin) {
      return res.status(403).json({ isAdmin: false });
    }

    res.status(200).json({ isAdmin: true });
  } catch (error) {
    console.error('管理者確認エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
} 