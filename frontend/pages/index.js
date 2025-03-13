import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const mbtiTypes = [
  "INFJ", "ENFP", "ISTJ", "ENTP",
  "INTP", "ESFJ", "ISFP", "ESTP",
  "INTJ", "ENTJ", "INFP", "ENFJ",
  "ISFJ", "ESTJ", "ISTP", "ESFP"
];

export default function Home() {
  const [mbti, setMbti] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (!mbti) return;
    router.push(`/results/${mbti.toUpperCase()}`);
  };

  return (
    <div className="hero-section">
      <div className="container d-flex flex-column align-items-center justify-content-center vh-100">
        <div className="hero-card">
          <h1 className="mb-4 fw-bold text-dark">行きたい企業を見つけよう</h1>

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
                  {mbti}
                </option>
              ))}
            </select>
          </div>

          {/* 診断ボタン */}
          <button
            className="btn btn-lg btn-primary px-5 py-2"
            onClick={handleSearch}
            disabled={!mbti}
          >
            診断する
          </button>
        </div>
      </div>
    </div>
  );
}
