import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";

const questions = [
  {
    text: "人の輪の中にいるとき、心は…",
    type: "EI",
    options: {
      A: { text: "心地よく刺激されて満たされる", value: "E" },
      B: { text: "少しずつ疲れていくのを感じる", value: "I" }
    }
  },
  {
    text: "知らない街を歩くとき、あなたは…",
    type: "SN",
    options: {
      A: { text: "看板や人の動きを観察して流れを読む", value: "S" },
      B: { text: "空気感や雰囲気から街の物語を想像する", value: "N" }
    }
  },
  {
    text: "友達が落ち込んでいるとき、あなたは…",
    type: "TF",
    options: {
      A: { text: "「どうしたら良くなるか」を一緒に考える", value: "T" },
      B: { text: "そばにいて、感情に寄り添おうとする", value: "F" }
    }
  },
  {
    text: "雨が降った日の午後、あなたは…",
    type: "JP",
    options: {
      A: { text: "決めていたタスクを淡々とこなす", value: "J" },
      B: { text: "別の過ごし方を考えながら動く", value: "P" }
    }
  },
  {
    text: "初対面の人と話すとき、あなたは…",
    type: "EI",
    options: {
      A: { text: "自然と話しかけて会話を広げる", value: "E" },
      B: { text: "場の空気を見ながらタイミングを待つ", value: "I" }
    }
  },
  {
    text: "情報を処理するとき、あなたは…",
    type: "SN",
    options: {
      A: { text: "事実や数字などの具体的な情報を重視する", value: "S" },
      B: { text: "全体の流れや意味合いから理解しようとする", value: "N" }
    }
  },
  {
    text: "誰かにアドバイスを求められたら…",
    type: "TF",
    options: {
      A: { text: "ロジカルに課題整理を手伝う", value: "T" },
      B: { text: "気持ちを優先して背中を押す", value: "F" }
    }
  },
  {
    text: "予定のある日、突然時間が空いたら…",
    type: "JP",
    options: {
      A: { text: "空いた時間も有効活用できるよう再調整する", value: "J" },
      B: { text: "気分でふらっとどこかに行きたくなる", value: "P" }
    }
  },
  {
    text: "話すことでエネルギーが湧いてくる？",
    type: "EI",
    options: {
      A: { text: "はい、話すほど元気になる", value: "E" },
      B: { text: "いいえ、むしろエネルギーを消費する", value: "I" }
    }
  },
  {
    text: "本や映画で印象に残るのは？",
    type: "SN",
    options: {
      A: { text: "ストーリーや描写の具体的な部分", value: "S" },
      B: { text: "感情の余韻や象徴的なシーン", value: "N" }
    }
  },
  {
    text: "感情的な話と論理的な話、どちらが得意？",
    type: "TF",
    options: {
      A: { text: "論理的に話す方が得意", value: "T" },
      B: { text: "感情に共感しながら話す方が得意", value: "F" }
    }
  },
  {
    text: "スケジュール帳は…",
    type: "JP",
    options: {
      A: { text: "しっかり管理している", value: "J" },
      B: { text: "あまり見返さないことが多い", value: "P" }
    }
  },
  {
    text: "沈黙は…",
    type: "EI",
    options: {
      A: { text: "ちょっと気まずく感じる", value: "E" },
      B: { text: "心地よく感じることもある", value: "I" }
    }
  },
  {
    text: "物事を理解する時は…",
    type: "SN",
    options: {
      A: { text: "順序立てて整理していく", value: "S" },
      B: { text: "直感的に意味をつかもうとする", value: "N" }
    }
  },
  {
    text: "議論では…",
    type: "TF",
    options: {
      A: { text: "論点を明確にして整理する", value: "T" },
      B: { text: "相手の気持ちを大切にする", value: "F" }
    }
  },
  {
    text: "予定変更があった時は…",
    type: "JP",
    options: {
      A: { text: "少しストレスを感じる", value: "J" },
      B: { text: "むしろ自由になった感じがして嬉しい", value: "P" }
    }
  },
  {
    text: "何かを始める時は…",
    type: "EI",
    options: {
      A: { text: "誰かと一緒に始める方がいい", value: "E" },
      B: { text: "一人で黙々と取り組みたい", value: "I" }
    }
  },
  {
    text: "見えない意味に惹かれることが多い",
    type: "SN",
    options: {
      A: { text: "はい、象徴的なものに感動する", value: "N" },
      B: { text: "いいえ、実際にあるものに価値を感じる", value: "S" }
    }
  },
  {
    text: "感情の動きに敏感なほうだ",
    type: "TF",
    options: {
      A: { text: "はい、他人の気持ちにもよく気づく", value: "F" },
      B: { text: "いいえ、感情よりも事実が気になる", value: "T" }
    }
  },
  {
    text: "未定の予定があると…",
    type: "JP",
    options: {
      A: { text: "気になって早めに決めたくなる", value: "J" },
      B: { text: "なんとなく流れで決まるのが好き", value: "P" }
    }
  }
];

export default function MBTIRetest() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [locked, setLocked] = useState(false);

  // デバッグ用：コンポーネントマウント時にquestionsの長さを確認
  React.useEffect(() => {
    console.log('Questions array length:', questions.length);
  }, []);

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setResult(null);
    setLocked(false);
  };

  const handleAnswer = (choice) => {
    if (locked) return;
    setLocked(true);

    // 現在のステップの回答を追加
    const currentAnswer = { step, choice };
    const newAnswers = [...answers, currentAnswer];
    
    // 回答を保存
    setAnswers(newAnswers);

    // デバッグ用ログ
    console.log('Current step:', step);
    console.log('Answers length:', newAnswers.length);
    console.log('Questions length:', questions.length);
    console.log('Questions array:', questions);

    // すべての質問に回答したか確認
    if (newAnswers.length === questions.length) {
      try {
        const score = {
          E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0
        };

        // 回答を正しい順序で処理
        newAnswers.sort((a, b) => a.step - b.step).forEach((answer, index) => {
          const selected = questions[index].options[answer.choice].value;
          score[selected]++;
        });

        const mbti =
          (score.E >= score.I ? "E" : "I") +
          (score.S >= score.N ? "S" : "N") +
          (score.T >= score.F ? "T" : "F") +
          (score.J >= score.P ? "J" : "P");

        setResult(mbti);
      } catch (error) {
        console.error('Error calculating MBTI:', error);
        // エラーが発生した場合はリセット
        reset();
      }
    } else {
      // 次の質問へ
      setTimeout(() => {
        setStep(prevStep => prevStep + 1);
        setLocked(false);
      }, 200);
    }
  };

  if (result) {
    return (
      <div className="container mt-5">
        <div className="card shadow-sm">
          <div className="card-body text-center">
            <h2 className="mb-4">あなたのMBTIタイプは {result} です</h2>
            <p className="mb-4">このタイプに合う企業を見つけてみましょう。</p>
            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
              <button 
                className="btn btn-primary px-4 py-2"
                onClick={() => router.push(`/results/${result}`)}
              >
                企業を探す
              </button>
              <button 
                className="btn btn-outline-primary px-4 py-2"
                onClick={reset}
              >
                もう一度診断する
              </button>
              <Link 
                href="/" 
                className="btn btn-outline-secondary px-4 py-2"
              >
                トップページに戻る
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const q = questions[step];

  return (
    <div className="container mt-5">
      <div className="card shadow-sm">
        <div className="card-body">
          <div className="progress mb-4">
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ width: `${((step + 1) / questions.length) * 100}%` }}
              aria-valuenow={step + 1} 
              aria-valuemin="1" 
              aria-valuemax={questions.length}
            ></div>
          </div>
          
          <h2 className="text-center mb-4">{q.text}</h2>
          
          <div className="d-flex flex-column gap-3">
            <button 
              onClick={() => handleAnswer("A")} 
              className="btn btn-outline-primary btn-lg py-3"
              disabled={locked}
            >
              {q.options.A.text}
            </button>
            <button 
              onClick={() => handleAnswer("B")} 
              className="btn btn-outline-primary btn-lg py-3"
              disabled={locked}
            >
              {q.options.B.text}
            </button>
          </div>

          <div className="text-center mt-4">
            <Link 
              href="/" 
              className="btn btn-outline-secondary"
            >
              トップページに戻る
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 