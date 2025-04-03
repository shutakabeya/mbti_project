import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

// 企業の特徴を取得する関数
const getCompanyFeatures = (company) => {
  const scores = [
    { name: 'work_style', score: company.work_style_score, tags: company.work_style_tags },
    { name: 'company_culture', score: company.company_culture_score, tags: company.company_culture_tags },
    { name: 'growth', score: company.growth_score, tags: company.growth_tags },
    { name: 'values', score: company.values_score, tags: company.values_tags },
    { name: 'relationships', score: company.relationships_score, tags: company.relationships_tags },
    { name: 'customer_contact', score: company.customer_contact_score, tags: company.customer_contact_tags },
    { name: 'work_type', score: company.work_type_score, tags: company.work_type_tags },
    { name: 'evaluation', score: company.evaluation_score, tags: company.evaluation_tags },
    { name: 'diversity', score: company.diversity_score, tags: company.diversity_tags },
    { name: 'stability', score: company.stability_score, tags: company.stability_tags }
  ];

  // スコアの高い順にソート
  const sortedScores = scores
    .filter(item => item.score > 0 && item.tags && item.tags.length > 0)
    .sort((a, b) => b.score - a.score);

  if (sortedScores.length < 2) return null;

  // 上位2カテゴリのタグを取得
  const topTags = [
    sortedScores[0].tags[0],
    sortedScores[1].tags[0]
  ];

  return `この企業は「${topTags[0]}」と「${topTags[1]}」に特徴があり、あなたと相性がいい可能性があります。`;
};

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
      <p className="text-center mb-4">気になることがあったらAIチャットで聞いてみよう！</p>
      <div className="row g-2">
        {companies.length > 0 ? (
          companies.map((company, index) => {
            const features = getCompanyFeatures(company);
            return (
              <div key={index} className="col-md-6 col-lg-4 mb-4">
                <div className="card shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title">
                      {company.name} 
                      {company.industry && ` (${company.industry})`}
                    </h5>
                    {features && (
                      <p className="card-text company-features">
                        {features}
                      </p>
                    )}
                    <Link href={`/company/${company._id}`} className="btn btn-primary btn-sm mt-2">
                      企業の詳細を見る
                    </Link>
                  </div>
                </div>
              </div>
            );
          })
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
