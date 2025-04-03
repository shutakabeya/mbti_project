const express = require('express');
const router = express.Router();
const MBTIPost = require('../models/MBTIPost');
const { isAdmin } = require('../middleware/auth');

// 記事一覧の取得
router.get('/', async (req, res) => {
  try {
    const posts = await MBTIPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: '記事の取得に失敗しました' });
  }
});

// 記事詳細の取得
router.get('/:id', async (req, res) => {
  try {
    const post = await MBTIPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '記事が見つかりません' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: '記事の取得に失敗しました' });
  }
});

// 新規記事の投稿（管理者のみ）
router.post('/', isAdmin, async (req, res) => {
  try {
    const { title, content, category, tags } = req.body;
    const newPost = new MBTIPost({
      title,
      content,
      category,
      tags,
      author: req.user._id
    });
    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: '記事の投稿に失敗しました' });
  }
});

// 記事の更新（管理者のみ）
router.put('/:id', isAdmin, async (req, res) => {
  try {
    const post = await MBTIPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: '記事が見つかりません' });
    }
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: '記事の更新に失敗しました' });
  }
});

// 記事の削除（管理者のみ）
router.delete('/:id', isAdmin, async (req, res) => {
  try {
    const post = await MBTIPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: '記事が見つかりません' });
    }
    res.json({ message: '記事を削除しました' });
  } catch (error) {
    res.status(500).json({ message: '記事の削除に失敗しました' });
  }
});

module.exports = router; 