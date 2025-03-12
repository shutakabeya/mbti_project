import { useEffect, useState } from "react";
import axios from "axios";

const Directory = () => {
  const [companies, setCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMBTI, setSelectedMBTI] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/companies")
      .then((res) => setCompanies(res.data))
      .catch((err) => console.error("エラー:", err));
  }, []);

  // ✅ すべての企業リストを保持
  const allCompanies = companies;

  // ✅ 企業名で検索
  const filteredCompanies = searchQuery
    ? allCompanies.filter(company =>
        company.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : null;

  // ✅ MBTIごとの企業リスト
  const groupedCompanies = companies.reduce((acc, company) => {
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
    <div className="container mt-5">

{/* ✅ 検索バー */}
      <div className="directory-search text-center mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="企業名を検索..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <h1 className="text-center mb-4 directory-title responsive-title">企業名鑑</h1>

      

      {/* ✅ MBTI選択プルダウン（検索中は非表示） */}
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

      {/* ✅ 検索結果を表示 */}
      {searchQuery ? (
        <>
          <ul className="list-group">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <li
                  key={company.name}
                  className="list-group-item d-flex justify-content-between align-items-center company-card"
                  onClick={() => window.open(company.website, "_blank")}
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
          {/* 🔄 検索後のボタン（企業名鑑のトップへ戻る） */}
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
        // ✅ 検索バーが空なら通常のMBTIごとのリストを表示
        Object.keys(groupedCompanies).map((mbti) => (
          <div key={mbti} id={mbti} className="mb-4">
            <h3 className="mb-3 text-primary">{mbti} の企業</h3>
            <ul className="list-group">
              {groupedCompanies[mbti].map((company) => (
                <li
                  key={company.name}
                  className="list-group-item d-flex justify-content-between align-items-center company-card"
                  onClick={() => window.open(company.website, "_blank")}
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