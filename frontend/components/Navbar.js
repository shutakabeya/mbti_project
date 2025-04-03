import { useEffect } from "react";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
  useEffect(() => {
    if (typeof window !== "undefined") {
      require("bootstrap/dist/js/bootstrap.bundle.min.js"); // ✅ JSを適用
    }
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
      <div className="container">
        <Link href="/" className="navbar-brand fw-bold">
          MBTI企業マッチング
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link href="/" className="nav-link">
                ホーム
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/directory" className="nav-link">
                企業名鑑
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/mbti-about" className="nav-link">
                記事一覧
              </Link>
            </li>
            <li className="nav-item">
              <Link href="/contact" className="nav-link">
                お問い合わせ
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
