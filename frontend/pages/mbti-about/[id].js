import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Link from 'next/link';

const PostDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tableOfContents, setTableOfContents] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/mbti-posts/${id}`);
        setPost(response.data);
        
        // 目次の生成
        const content = response.data.content;
        const headings = content.match(/^#+\s+.+$/gm) || [];
        const toc = headings.map((heading, index) => {
          const level = heading.match(/^#+/)[0].length;
          const title = heading.replace(/^#+\s+/, '');
          const anchorId = `section-${index}`;
          return { level, title, anchorId };
        });
        setTableOfContents(toc);
        
        setIsLoading(false);
      } catch (error) {
        setError('記事の取得に失敗しました');
        setIsLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mt-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">読み込み中...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning" role="alert">
          記事が見つかりません
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="card">
            <div className="card-body">
              <h1 className="card-title mb-4">{post.title}</h1>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <span className="badge bg-primary">{post.category}</span>
                <small className="text-muted">
                  {new Date(post.createdAt).toLocaleDateString('ja-JP')}
                </small>
              </div>

              {/* 目次 */}
              {tableOfContents.length > 0 && (
                <div className="table-of-contents mb-4 p-3 bg-light rounded">
                  <h5 className="mb-3">目次</h5>
                  <ul className="list-unstyled">
                    {tableOfContents.map((item, index) => (
                      <li 
                        key={index}
                        style={{ 
                          marginLeft: `${(item.level - 1) * 1}rem`,
                          paddingLeft: '0.5rem',
                          borderLeft: item.level > 1 ? '2px solid #dee2e6' : 'none'
                        }}
                      >
                        <a 
                          href={`#${item.anchorId}`}
                          className="text-decoration-none"
                          style={{ color: '#0d6efd' }}
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 記事内容 */}
              <div className="post-content mb-4">
                {post.content.split('\n').map((paragraph, index) => {
                  if (paragraph.match(/^#+\s+.+$/)) {
                    const level = paragraph.match(/^#+/)[0].length;
                    const title = paragraph.replace(/^#+\s+/, '');
                    return (
                      <h2 
                        key={index} 
                        id={`section-${index}`}
                        style={{ 
                          fontSize: `${2 - (level - 1) * 0.2}rem`,
                          marginTop: '2rem',
                          marginBottom: '1rem'
                        }}
                      >
                        {title}
                      </h2>
                    );
                  }
                  return <p key={index}>{paragraph}</p>;
                })}
              </div>

              {post.tags && post.tags.length > 0 && (
                <div className="mb-4">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="badge bg-secondary me-2">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              <div className="d-flex justify-content-between">
                <Link href="/mbti-about" className="btn btn-outline-primary">
                  一覧に戻る
                </Link>
                <div className="text-muted">
                  <small>閲覧数: {post.views}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail; 