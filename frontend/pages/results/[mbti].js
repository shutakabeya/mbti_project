import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

const Results = () => {
  const router = useRouter();
  const { mbti } = router.query;
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!mbti) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    console.log(`API URL: ${apiUrl}/api/match/${mbti}`); // デバッグ用
    
    axios
      .get(`${apiUrl}/api/match/${mbti}`)
      .then((res) => {
        console.log("API Response:", res.data); // デバッグ用
        // companiesプロパティからデータを取得
        setCompanies(res.data.companies || []);
      })
      .catch((err) => {
        console.error("❌ APIエラー:", err.response?.data || err.message);
        setCompanies([]); // エラー時は空の配列を設定
      })
      .finally(() => setLoading(false));
  }, [mbti]);

  if (loading) return <p className="text-center mt-5">🔄 読み込み中...</p>;

  return (
    <div className="container mt-5">
      <h1 className="results-title responsive-title">診断結果</h1>
      <div className="row g-2">
        {companies.length > 0 ? (
          companies.map((company, index) => (
            <div key={index} className="col-md-6 col-lg-4 mb-4">
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">
                    {company.name} 
                    {company.industry && ` (${company.industry})`}
                  </h5>
                  <Link href={`/company/${company._id}`} className="btn btn-primary btn-sm mt-2">
                    企業の詳細を見る
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center">該当する企業が見つかりませんでした。</p>
        )}
      </div>
      
      {/* AIコンシェルジュアイコン（右下固定） */}
      <a href="https://chatgpt.com/g/g-67d036b20ed88191b88eb6cf1b4f1eff-zhi-wen-tiyatuto" target="_blank" rel="noopener noreferrer" className="ai-icon">
        <img src="/AI.png" alt="AIコンシェルジュ" className="ai-icon-img" />
      </a>
    </div>
  );
};

export default Results;
