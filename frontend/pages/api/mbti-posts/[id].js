import { connectToDatabase } from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();
  const { id } = req.query;

  if (req.method === 'GET') {
    try {
      const post = await db.collection('mbti_posts').findOne({ _id: new ObjectId(id) });
      if (!post) {
        return res.status(404).json({ message: '記事が見つかりません' });
      }
      res.status(200).json(post);
    } catch (error) {
      res.status(500).json({ message: '記事の取得に失敗しました' });
    }
  } else if (req.method === 'DELETE') {
    try {
      const result = await db.collection('mbti_posts').deleteOne({ _id: new ObjectId(id) });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: '記事が見つかりません' });
      }
      res.status(200).json({ message: '記事を削除しました' });
    } catch (error) {
      res.status(500).json({ message: '記事の削除に失敗しました' });
    }
  } else {
    res.setHeader('Allow', ['GET', 'DELETE']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 