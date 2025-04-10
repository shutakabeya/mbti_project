import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const mbtiTypes = [
  "INFJ", "ENFP", "ISTJ", "ENTP",
  "INTP", "ESFJ", "ISFP", "ESTP",
  "INTJ", "ENTJ", "INFP", "ENFJ",
  "ISFJ", "ESTJ", "ISTP", "ESFP"
];

const mbtiNicknames = {
  INTJ: "建築家",
  INTP: "論理学者",
  ENTJ: "指揮官",
  ENTP: "討論者",
  INFJ: "提唱者",
  INFP: "仲介者",
  ENFJ: "主人公",
  ENFP: "広報運動家",
  ISTJ: "管理者",
  ISFJ: "擁護者",
  ESTJ: "幹部",
  ESFJ: "領事",
  ISTP: "巨匠",
  ISFP: "冒険家",
  ESTP: "起業家",
  ESFP: "エンターテイナー"
};

export default function Home() {
  const router = useRouter();
  const [mbti, setMbti] = useState("");

  const handleSearch = () => {
    if (!mbti) return;
    router.push(`/results/${mbti.toUpperCase()}`);
  };

  return (
    <div className="hero-section">
      <div className="container d-flex flex-column align-items-center justify-content-center" style={{ minHeight: 'calc(100vh - 70px)' }}>
        <div className="hero-card">
          <h1 className="mb-4 fw-bold text-dark text-center" style={{ fontSize: '2.5rem' }}>行きたい企業を見つけよう</h1>

          {/* MBTI選択（プルダウン） */}
          <div className="mb-4">
            <label className="form-label fw-bold mbti-selection-label">あなたのMBTIを選択：</label>
            <select
              className="form-select text-center custom-dropdown"
              value={mbti}
              onChange={(e) => setMbti(e.target.value)}
            >
              <option value="">選択してください</option>
              {mbtiTypes.map((mbti) => (
                <option key={mbti} value={mbti}>
                  {mbti} ({mbtiNicknames[mbti]})
                </option>
              ))}
            </select>
          </div>

          {/* ボタン */}
          <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center w-100">
            <button
              className="btn btn-primary px-5 py-2"
              onClick={handleSearch}
              disabled={!mbti}
            >
              診断する
            </button>
            <Link href="/directory" className="btn btn-primary px-5 py-2">
              企業名鑑を見る
            </Link>
            <Link href="/diagnosis" className="btn btn-outline-primary px-5 py-2">
              あなたのMBTIを診断
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
