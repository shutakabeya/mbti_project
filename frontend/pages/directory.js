import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Directory = () => {
  const [companies, setCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMBTI, setSelectedMBTI] = useState("");
  const router = useRouter();

  useEffect(() => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";
    console.log(`API URL: ${apiUrl}/api/companies`); // デバッグ用
    
    axios
      .get(`${apiUrl}/api/companies`)
      .then((res) => {
        console.log("API Response:", res.data); // デバッグ用
        setCompanies(res.data);
      })
      .catch((err) => {
        console.error("❌ APIエラー:", err.response?.data || err.message);
        setCompanies([]);
      });
  }, []);

  // すべての企業リストを保持
  const allCompanies = companies;

  // フリーワード検索
  const filteredCompanies = searchQuery
    ? allCompanies.filter(company => {
        const searchTerm = searchQuery.toLowerCase();
        
        // 基本情報の検索
        const basicInfoMatch = 
          (company?.name?.toLowerCase().includes(searchTerm)) ||
          (company?.industry?.toLowerCase().includes(searchTerm)) ||
          (company?.size?.toLowerCase().includes(searchTerm)) ||
          (company?.profile?.toLowerCase().includes(searchTerm)) ||
          (company?.business?.toLowerCase().includes(searchTerm));

        // タグの検索
        const tagsMatch = company?.tags?.some(tag => 
          tag.toLowerCase().includes(searchTerm)
        );

        // カテゴリ別タグの検索
        const categoryTagsMatch = 
          (company?.workStyleTags?.some(tag => tag.toLowerCase().includes(searchTerm))) ||
          (company?.cultureTags?.some(tag => tag.toLowerCase().includes(searchTerm))) ||
          (company?.growthTags?.some(tag => tag.toLowerCase().includes(searchTerm))) ||
          (company?.valuesTags?.some(tag => tag.toLowerCase().includes(searchTerm))) ||
          (company?.relationshipTags?.some(tag => tag.toLowerCase().includes(searchTerm))) ||
          (company?.customerTags?.some(tag => tag.toLowerCase().includes(searchTerm))) ||
          (company?.workStyleTags?.some(tag => tag.toLowerCase().includes(searchTerm))) ||
          (company?.evaluationTags?.some(tag => tag.toLowerCase().includes(searchTerm))) ||
          (company?.diversityTags?.some(tag => tag.toLowerCase().includes(searchTerm))) ||
          (company?.stabilityTags?.some(tag => tag.toLowerCase().includes(searchTerm)));

        return basicInfoMatch || tagsMatch || categoryTagsMatch;
      })
    : allCompanies;

  // MBTIごとの企業リスト
  const groupedCompanies = filteredCompanies.reduce((acc, company) => {
    const mbti = company.mbti?.trim();
    if (mbti && mbti !== "MBTI") {
      if (!acc[mbti]) acc[mbti] = [];
      acc[mbti].push(company);
    }
    return acc;
  }, {});

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleScrollToMBTI = () => {
    if (selectedMBTI) {
      const target = document.getElementById(selectedMBTI);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  return (
    <div className="container mt-2">
      {/* 検索バー */}
      <div className="directory-search">
        <input
          type="text"
          className="form-control"
          placeholder="企業名・業界・特徴で検索（例：人材 成長 裁量）"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <h1 className="text-center mb-3 directory-title responsive-title">企業名鑑</h1>

      {/* MBTI選択プルダウン（検索中は非表示） */}
      {!searchQuery && (
        <div className="text-center mb-4">
          <label className="form-label me-2">MBTIを選択：</label>
          <select
            className="form-select d-inline-block w-auto"
            value={selectedMBTI}
            onChange={(e) => setSelectedMBTI(e.target.value)}
          >
            <option value="">選択してください</option>
            {Object.keys(groupedCompanies).map((mbti) => (
              <option key={mbti} value={mbti}>
                {mbti}
              </option>
            ))}
          </select>
          <button className="btn btn-info ms-2" onClick={handleScrollToMBTI}>
            企業を見る
          </button>
        </div>
      )}

      {/* 検索結果を表示 */}
      {searchQuery ? (
        <>
          <ul className="list-group">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company, index) => (
                <li
                  key={`${company.name || 'unknown'}-${index}`}
                  className="list-group-item d-flex justify-content-between align-items-center company-card"
                  onClick={() => router.push(`/company/${company._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between w-100">
                    <span className="text-primary">{company.name}</span>
                    <span className="text-muted">{company.mbti}</span>
                  </div>
                </li>
              ))
            ) : (
              <p className="text-center text-muted">該当する企業が見つかりません。</p>
            )}
          </ul>
          {/* 検索後のボタン（企業名鑑のトップへ戻る） */}
          <div className="text-center mt-4">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSearchQuery("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              企業名鑑のトップへ戻る
            </button>
          </div>
        </>
      ) : (
        // 検索バーが空なら通常のMBTIごとのリストを表示
        Object.keys(groupedCompanies).map((mbti) => (
          <div key={mbti} id={mbti} className="mb-4">
            <h3 className="mb-3 text-primary">{mbti} の企業</h3>
            <ul className="list-group">
              {groupedCompanies[mbti].map((company, index) => (
                <li
                  key={`${company.name || 'unknown'}-${index}`}
                  className="list-group-item d-flex justify-content-between align-items-center company-card"
                  onClick={() => router.push(`/company/${company._id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="d-flex justify-content-between w-100">
                    <span className="text-primary">{company.name}</span>
                    <span className="text-muted">{company.industry}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))
      )}

      {/* AIコンシェルジュアイコン（右下固定） */}
      <a href="https://chatgpt.com/g/g-67d036b20ed88191b88eb6cf1b4f1eff-zhi-wen-tiyatuto" target="_blank" rel="noopener noreferrer" className="ai-icon">
        <img src="/AI.png" alt="AIコンシェルジュ" className="ai-icon-img" />
      </a>
    </div>
  );
};

export default Directory;