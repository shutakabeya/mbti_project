import Link from "next/link";

const Contact = () => {
  return (
    <div className="container mt-5">
      <h1 className="contact-title text-center mb-4">お問い合わせ</h1>
      <p className="text-center">
        ご覧いただきありがとうございます。お気づきの点がございましたら、お手数ですが下記メールアドレスまでご連絡ください。
      </p>
      <div className="text-center">
        <a href="mailto:daifive.sales@dai-five.com" className="btn btn-primary">
          メールを送る
        </a>
      </div>
      <div className="text-center mt-4">
        <Link href="/" className="btn btn-secondary">トップページへ戻る</Link>
      </div>
    </div>
  );
};

export default Contact;
