import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const CompanyDetail = () => {
  const router = useRouter();
  const { id } = router.query;
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    
    console.log("🔍 企業詳細取得リクエスト開始:", {
      id,
      apiUrl,
      timestamp: new Date().toISOString()
    });
    
    axios
      .get(`${apiUrl}/api/company/${id}`)
      .then((res) => {
        console.log("📊 企業詳細取得レスポンス:", {
          id: res.data._id,
          name: res.data.name,
          website: res.data.website,
          matches: res.data.matches,
          timestamp: new Date().toISOString()
        });
        setCompany(res.data);
      })
      .catch((err) => {
        console.error("❌ 企業詳細取得エラー:", {
          error: err.message,
          response: err.response?.data,
          timestamp: new Date().toISOString()
        });
        setError("企業詳細の取得中にエラーが発生しました");
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center mt-5">🔄 読み込み中...</p>;
  if (error) return <p className="text-center mt-5 text-danger">{error}</p>;
  if (!company) return <p className="text-center mt-5">企業が見つかりませんでした</p>;

  return (
    <div className="container mt-5 pt-5">
      {/* 戻るボタン */}
      <div className="mb-4">
        <button 
          className="btn btn-outline-primary"
          onClick={() => router.back()}
        >
          ← 戻る
        </button>
      </div>

      {/* ヒーローカード */}
      <div className="card shadow-sm rounded-3 mb-4">
        <div className="card-body p-4">
          <h1 className="company-name mb-2">{company.name}</h1>
          <div className="d-flex flex-wrap align-items-center gap-2 company-badges">
            <span className="badge bg-primary">{company.industry}</span>
            <span className="badge bg-info text-dark">{company.mbti}</span>
          </div>
        </div>
      </div>

      {/* プロフィール */}
      <div className="card shadow-sm rounded-3 mb-4">
        <div className="card-body p-4">
          <h2 className="h4 mb-3">プロフィール</h2>
          <p className="mb-4">{company.company_profile}</p>
          <div className="row">
            <div className="col-md-6 mb-3">
              <p className="mb-2"><strong>企業規模：</strong>{company.company_size}</p>
              <p className="mb-2"><strong>設立年：</strong>{company.established_year || '未公開'}</p>
              <p className="mb-2"><strong>昨年度売上高：</strong>{company.last_year_sales || '未公開'}</p>
              <p className="mb-2"><strong>本社所在地：</strong>{company.headquarters_location || '未公開'}</p>
            </div>
            <div className="col-md-6 mb-3">
              <p className="mb-2"><strong>入社難易度：</strong></p>
              <div className="difficulty-rating">
                {[...Array(5)].map((_, index) => (
                  <i
                    key={index}
                    className={`bi bi-star${index < company.hiring_difficulty ? '-fill' : ''} text-warning`}
                    style={{ fontSize: '1.5rem' }}
                  />
                ))}
                <span className="ms-2">{company.hiring_difficulty} / 5</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 事業内容 */}
      <div className="card shadow-sm rounded-3 mb-4">
        <div className="card-body p-4">
          <h2 className="h4 mb-3">事業内容</h2>
          <p className="mb-0">{company.business_description}</p>
        </div>
      </div>

      {/* 選考フロー */}
      <div className="card shadow-sm rounded-3 mb-4">
        <div className="card-body p-4">
          <h2 className="h4 mb-3">選考フロー</h2>
          <ol className="mb-0">
            {company.selection_process.map((step, index) => (
              <li key={index}>{step}</li>
            ))}
          </ol>
        </div>
      </div>

      {/* スケジュール */}
      <div className="card shadow-sm rounded-3 mb-4">
        <div className="card-body p-4">
          <h2 className="h4 mb-3">スケジュール</h2>
          <p className="mb-0">{company.deadline_schedule}</p>
        </div>
      </div>

      {/* よくある質問 */}
      <div className="card shadow-sm rounded-3 mb-4">
        <div className="card-body p-4">
          <h2 className="h4 mb-3">よくある質問</h2>
          <p className="mb-0">{company.interview_questions}</p>
        </div>
      </div>

      {/* Webサイト */}
      {company.website && (
        <div className="card shadow-sm rounded-3 mb-4">
          <div className="card-body p-4">
            <h2 className="h4 mb-3">Webサイト</h2>
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn btn-primary"
            >
              企業サイトを見る
            </a>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyDetail; 