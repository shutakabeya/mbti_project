import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';

const MBTIAbout = () => {
  const [posts, setPosts] = useState([]);
  const [isAdmin, setIsAdmin] = useState(true); // 開発中はtrueに設定
  const [newPost, setNewPost] = useState({
    title: '',
    content: '',
    category: 'MBTI基礎',
    tags: []
  });

  useEffect(() => {
    // ブログ記事の取得
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/api/mbti-posts');
        setPosts(response.data);
      } catch (error) {
        console.error('記事の取得に失敗しました:', error);
      }
    };

    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/mbti-posts', newPost);
      // 投稿後に記事一覧を更新
      const response = await axios.get('/api/mbti-posts');
      setPosts(response.data);
      // フォームをリセット
      setNewPost({
        title: '',
        content: '',
        category: 'MBTI基礎',
        tags: []
      });
    } catch (error) {
      console.error('記事の投稿に失敗しました:', error);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('この記事を削除してもよろしいですか？')) {
      try {
        await axios.delete(`/api/mbti-posts/${postId}`);
        // 削除後に記事一覧を更新
        const response = await axios.get('/api/mbti-posts');
        setPosts(response.data);
      } catch (error) {
        console.error('記事の削除に失敗しました:', error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">記事一覧</h1>
      
      {/* 記事一覧 */}
      <div className="row">
        {posts.map((post) => (
          <div key={post._id} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{post.title}</h5>
                <p className="card-text">
                  {post.content.length > 100
                    ? `${post.content.substring(0, 100)}...`
                    : post.content}
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <Link href={`/mbti-about/${post._id}`} className="btn btn-primary">
                    続きを読む
                  </Link>
                  {isAdmin && (
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(post._id)}
                    >
                      削除
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 記事投稿フォーム（開発中のみ表示） */}
      {isAdmin && (
        <div className="mt-5">
          <h2>記事を投稿する</h2>
          <form onSubmit={handleSubmit} className="mb-5">
            <div className="mb-3">
              <label htmlFor="title" className="form-label">タイトル</label>
              <input
                type="text"
                className="form-control"
                id="title"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="content" className="form-label">内容</label>
              <textarea
                className="form-control"
                id="content"
                rows="5"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="category" className="form-label">カテゴリー</label>
              <input
                type="text"
                className="form-control"
                id="category"
                value={newPost.category}
                onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="tags" className="form-label">タグ（カンマ区切り）</label>
              <input
                type="text"
                className="form-control"
                id="tags"
                value={newPost.tags}
                onChange={(e) => setNewPost({ ...newPost, tags: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary">投稿する</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default MBTIAbout; 