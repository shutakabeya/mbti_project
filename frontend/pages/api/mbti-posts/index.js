import { connectToDatabase } from '../../../lib/mongodb';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  if (req.method === 'GET') {
    try {
      const posts = await db.collection('mbti_posts').find({}).sort({ createdAt: -1 }).toArray();
      res.status(200).json(posts);
    } catch (error) {
      res.status(500).json({ message: '記事の取得に失敗しました' });
    }
  } else if (req.method === 'POST') {
    try {
      // 開発中は認証チェックを無効化
      // const userId = req.headers['x-user-id'];
      // if (!userId) {
      //   return res.status(401).json({ message: '認証が必要です' });
      // }

      // const user = await db.collection('users').findOne({ _id: userId });
      // if (!user || !user.isAdmin) {
      //   return res.status(403).json({ message: '管理者権限が必要です' });
      // }

      const { title, content, category, tags } = req.body;
      const result = await db.collection('mbti_posts').insertOne({
        title,
        content,
        category,
        tags,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      res.status(201).json(result);
    } catch (error) {
      res.status(500).json({ message: '記事の投稿に失敗しました' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 