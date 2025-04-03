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
    
    axios
      .get(`${apiUrl}/api/company/${id}`)
      .then((res) => {
        setCompany(res.data);
      })
      .catch((err) => {
        console.error("❌ 企業詳細取得エラー:", err);
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
          <p className="mb-2"><strong>企業規模：</strong>{company.company_size}</p>
          <p className="mb-0">{company.company_profile}</p>
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