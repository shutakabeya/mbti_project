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

const mbtiProfiles = {
  ENFP: {
    title: "ENFPの特徴（広報運動家タイプ）",
    indicators: [
      { 
        key: "E（外向）", 
        desc: "人との交流をエネルギー源にする。コミュニケーションが得意。" 
      },
      { 
        key: "N（直観）", 
        desc: "新しいアイデアや可能性に敏感。未来志向でビジョン重視。" 
      },
      { 
        key: "F（感情）", 
        desc: "他人の気持ちに共感し、関係性を大切にする。" 
      },
      { 
        key: "P（知覚）", 
        desc: "柔軟で、状況に応じて臨機応変に動けるタイプ。計画よりも流れを重視。" 
      }
    ],
    personality: [
      "情熱的で創造的。アイデアと人をつなげる天才",
      "型にはまるのが苦手で、自由と多様性を求める",
      "人の感情に敏感で、チームに活気をもたらすムードメーカー",
      "単調なルーチンより、新しいプロジェクトや変化に燃えるタイプ"
    ],
    fitCompanies: [
      "風通しの良い、オープンな社風（＝Eとの一致）",
      "変化を歓迎し、アイデア提案が奨励される文化（＝Nとの一致）",
      "人との関係性やチームワークを重視（＝Fとの一致）",
      "裁量があり、柔軟な働き方ができる（＝Pとの一致）"
    ]
  },
  ISTJ: {
    title: "ISTJの特徴（管理者タイプ）",
    indicators: [
      { 
        key: "I（内向）", 
        desc: "静かな環境を好み、集中して物事を進めるのが得意。" 
      },
      { 
        key: "S（感覚）", 
        desc: "データや実績を重視し、事実ベースの判断を好む。" 
      },
      { 
        key: "T（思考）", 
        desc: "論理的・客観的に考える。感情より合理性を優先。" 
      },
      { 
        key: "J（判断）", 
        desc: "計画的で責任感が強く、ルールや期限を守る傾向。" 
      }
    ],
    personality: [
      "誠実で勤勉、組織を支える縁の下の力持ちタイプ",
      "一貫性と信頼性を大切にし、ルールを着実に守る",
      "感情的な揺らぎよりも、「正しい手順」や「事実」を重視",
      "安定した環境で、着実に成果を積み重ねる力に優れる"
    ],
    fitCompanies: [
      "静かで落ち着いた職場環境（＝Iとの一致）",
      "事実と実績に基づいた判断がされる文化（＝Sとの一致）",
      "論理と成果で評価されるシステム（＝Tとの一致）",
      "手順や計画を重視し、秩序立った運営がされている組織（＝Jとの一致）"
    ]
  },
  INFJ: {
    title: "INFJの特徴（提唱者タイプ）",
    indicators: [
      { 
        key: "I（内向）", 
        desc: "一人の時間を大切にし、内省的。静かな環境で力を発揮。" 
      },
      { 
        key: "N（直観）", 
        desc: "未来志向で、ビジョンや意味を重視。抽象的な概念や理想に敏感。" 
      },
      { 
        key: "F（感情）", 
        desc: "他者への共感力が高く、価値観・倫理観に基づいて判断する。" 
      },
      { 
        key: "J（判断）", 
        desc: "計画性があり、秩序だった生活や組織を好む。締切・ルールを守る。" 
      }
    ],
    personality: [
      "理想主義でビジョンを持つリーダータイプ",
      "社会貢献・使命感の強い仕事にモチベーションを感じる",
      "静かだが芯が強く、他者に深い影響を与える存在",
      "一貫性と誠実さを重視し、内面で深く物事を考える"
    ],
    fitCompanies: [
      "静かな環境で深く考える時間が尊重される組織（＝Iとの一致）",
      "ビジョンやミッションを明確に掲げている企業（＝Nとの一致）",
      "人間関係が温かく、思いやりのある文化（＝Fとの一致）",
      "計画的にプロジェクトを進める体制がある（＝Jとの一致）"
    ]
  },
  ENTP: {
    title: "ENTPの特徴（討論者タイプ）",
    indicators: [
      { 
        key: "E（外向）", 
        desc: "対人交流を楽しみ、人と関わることでエネルギーを得る。" 
      },
      { 
        key: "N（直観）", 
        desc: "新しい発想や可能性を重視。未来志向で抽象的な思考が得意。" 
      },
      { 
        key: "T（思考）", 
        desc: "論理的・合理的に考え、事実ベースで判断する。" 
      },
      { 
        key: "P（知覚）", 
        desc: "柔軟で即興的な対応が得意。状況に応じて臨機応変に動く。" 
      }
    ],
    personality: [
      "ひらめきと行動力に優れた、アイデアの実践家",
      "論理と柔軟さを両立し、議論やディスカッションが好き",
      "新しいことに常にアンテナを張り、既存の仕組みに挑戦する精神を持つ",
      "一つのことを深く突き詰めるよりも、多様な挑戦を楽しむタイプ"
    ],
    fitCompanies: [
      "外部とのコラボレーションが盛んで、オープンな文化（＝Eとの一致）",
      "イノベーションを重視し、挑戦が奨励される組織（＝Nとの一致）",
      "論理や成果で評価されるシステム（＝Tとの一致）",
      "柔軟性が高く、変化に富んだ働き方が可能（＝Pとの一致）"
    ]
  },
  INTP: {
    title: "INTPの特徴（論理学者タイプ）",
    indicators: [
      { 
        key: "I（内向）", 
        desc: "一人で深く考える時間を大切にする。思考型で内省的。" 
      },
      { 
        key: "N（直観）", 
        desc: "直感的に本質を見抜き、抽象的・理論的な考察が得意。" 
      },
      { 
        key: "T（思考）", 
        desc: "客観的・合理的な判断を好み、感情より論理を重視。" 
      },
      { 
        key: "P（知覚）", 
        desc: "自由で柔軟な働き方を好み、探究型。縛られすぎるのは苦手。" 
      }
    ],
    personality: [
      "深い思索と創造的なアイデアを生む「知の探究者」",
      "好奇心旺盛で、既存の枠にとらわれず新しい理論やシステムを考える",
      "静かな環境で一人で集中することに最も力を発揮する",
      "日常的なルールや形式よりも、自由な思考・研究環境を重視"
    ],
    fitCompanies: [
      "集中できる静かな環境で、内省的な働き方が可能（＝Iとの一致）",
      "抽象的なアイデアや分析を重視する文化（＝Nとの一致）",
      "論理とデータで評価される環境（＝Tとの一致）",
      "自由な発想や柔軟なスケジューリングが許容される職場（＝Pとの一致）"
    ]
  },
  ESFJ: {
    title: "ESFJの特徴（領事館タイプ）",
    indicators: [
      { 
        key: "E（外向）", 
        desc: "周囲とのつながりを大切にし、対人関係からエネルギーを得る。" 
      },
      { 
        key: "S（感覚）", 
        desc: "実際の経験や具体的な事実に基づいて判断する。" 
      },
      { 
        key: "F（感情）", 
        desc: "他者への共感力が高く、人間関係・調和を重視する。" 
      },
      { 
        key: "J（判断）", 
        desc: "計画的で責任感が強く、秩序だった行動を好む。" 
      }
    ],
    personality: [
      "世話好きで、他者を支えることに喜びを感じるホスピタリティの化身",
      "社会性が高く、場の空気を読みながら調和を保つのが得意",
      "明文化されたルールや手順を守り、安定した組織運営にも貢献できる",
      "「誰かの役に立っている」と実感できることにモチベーションを感じる"
    ],
    fitCompanies: [
      "オープンで温かい人間関係が築かれている職場（＝E・Fとの一致）",
      "現場の実務や具体的な成果を大切にする文化（＝Sとの一致）",
      "ルールや手順が整っていて、きちんと機能している組織（＝Jとの一致）",
      "対人サービスやサポート業務に価値が置かれている企業"
    ]
  },
  ISFP: {
    title: "ISFPの特徴（冒険家タイプ）",
    indicators: [
      { 
        key: "I（内向）", 
        desc: "自分の世界や価値観を大切にし、静かな環境で力を発揮。" 
      },
      { 
        key: "S（感覚）", 
        desc: "今この瞬間の感覚や現実的な経験に重きを置く。" 
      },
      { 
        key: "F（感情）", 
        desc: "他者への思いやりがあり、自分の価値観にも忠実。" 
      },
      { 
        key: "P（知覚）", 
        desc: "柔軟で自由なスタイルを好み、変化に適応する。" 
      }
    ],
    personality: [
      "静かで控えめだが、感受性豊かで美意識に優れたタイプ",
      "押しつけられるのを嫌い、自分のペースで創造性を発揮したい",
      "周囲に配慮しつつも、自分の価値観に忠実でいたいという信念を持つ",
      "ルールよりも、「その場にふさわしい」行動や感覚を重視する"
    ],
    fitCompanies: [
      "静かで落ち着いた環境で、個人のペースを尊重する文化（＝Iとの一致）",
      "目に見える・触れられるような具体的な成果を大切にする組織（＝Sとの一致）",
      "人との思いやりを重んじ、押しつけない社風（＝Fとの一致）",
      "柔軟な働き方ができる。自由度のある仕事の進め方（＝Pとの一致）"
    ]
  },
  ESTP: {
    title: "ESTPの特徴（起業家タイプ）",
    indicators: [
      { 
        key: "E（外向）", 
        desc: "エネルギッシュで人との交流を好む。即行動派。" 
      },
      { 
        key: "S（感覚）", 
        desc: "実用的で現実重視。経験や目に見える情報から判断。" 
      },
      { 
        key: "T（思考）", 
        desc: "合理的で論理的。結果や効率を重んじる。" 
      },
      { 
        key: "P（知覚）", 
        desc: "瞬発力があり、柔軟に状況に適応できる。計画より行動を重視。" 
      }
    ],
    personality: [
      "行動力と即決力に長けた「現場主義のプロフェッショナル」",
      "新しいこと・スリル・スピードを楽しむ傾向があり、じっとしているのは苦手",
      "理屈よりも「やってみて考える」スタイル。勝負勘が鋭い",
      "説得力のある話し方で、人を巻き込んで動かすリーダーシップも持つ"
    ],
    fitCompanies: [
      "スピード感があり、意思決定が早い文化（＝E・Pとの一致）",
      "現実的な数値や成果に基づいて動く組織（＝S・Tとの一致）",
      "変化を歓迎し、挑戦に寛容な社風",
      "自律的に動ける裁量があり、結果が出せると報われる制度"
    ]
  },
  INTJ: {
    title: "INTJの特徴（建築家タイプ）",
    indicators: [
      { 
        key: "I（内向）", 
        desc: "深く集中して一人で物事を進めることが得意。" 
      },
      { 
        key: "N（直観）", 
        desc: "抽象的・理論的な構想に強く、未来志向でビジョン重視。" 
      },
      { 
        key: "T（思考）", 
        desc: "論理的・客観的に思考し、効率性と合理性を追求する。" 
      },
      { 
        key: "J（判断）", 
        desc: "計画的に物事を進め、秩序や長期的な達成を重んじる。" 
      }
    ],
    personality: [
      "戦略思考に優れた「知的な未来設計者」",
      "本質を見極め、独自の論理と構想力で問題を根本から解決する",
      "感情や慣習にとらわれず、最も合理的で効果的な方法を選ぶ",
      "長期的な目標設定と計画力に優れ、静かに着実に結果を出す"
    ],
    fitCompanies: [
      "静かで深く考える時間が尊重される環境（＝Iとの一致）",
      "ビジョンや戦略を重視し、イノベーション志向の組織（＝Nとの一致）",
      "感情ではなく論理と実績で評価される環境（＝Tとの一致）",
      "計画性と組織的思考が求められるプロジェクト型の仕事（＝Jとの一致）"
    ]
  },
  ENTJ: {
    title: "ENTJの特徴（指揮官タイプ）",
    indicators: [
      { 
        key: "E（外向）", 
        desc: "主導的に人と関わり、エネルギッシュに周囲を引っ張る。" 
      },
      { 
        key: "N（直観）", 
        desc: "長期的な視野とビジョンを持ち、未来志向で考える。" 
      },
      { 
        key: "T（思考）", 
        desc: "論理的・客観的に物事を分析し、成果を重視する。" 
      },
      { 
        key: "J（判断）", 
        desc: "明確なゴールに向かって計画的に実行する力が強い。" 
      }
    ],
    personality: [
      "カリスマ性と戦略的思考を併せ持つ「天然のリーダー」",
      "ビジョンを描き、組織を動かして目標達成へ導く指揮官タイプ",
      "感情よりも論理を重視し、合理性と効率性を追求",
      "複雑な課題に対しても、冷静に長期戦略を立てて対応する"
    ],
    fitCompanies: [
      "リーダーシップを発揮できる裁量のある職場（＝Eとの一致）",
      "将来を見据えた成長志向・イノベーション文化（＝Nとの一致）",
      "成果と論理に基づいたフェアな評価制度（＝Tとの一致）",
      "計画的・組織的にプロジェクトが進行する体制（＝Jとの一致）"
    ]
  },
  INFP: {
    title: "INFPの特徴（仲介者タイプ）",
    indicators: [
      { 
        key: "I（内向）", 
        desc: "静かで落ち着いた環境で、自分の内面と向き合いながら働くことを好む。" 
      },
      { 
        key: "N（直観）", 
        desc: "目先の事実よりも、ビジョンや可能性、理想に価値を置く。" 
      },
      { 
        key: "F（感情）", 
        desc: "他者への共感力が非常に高く、倫理観・価値観を重視する。" 
      },
      { 
        key: "P（知覚）", 
        desc: "形式にとらわれず、柔軟に物事へ対応する。自分らしさを尊重。" 
      }
    ],
    personality: [
      "理想を胸に秘め、静かに情熱を燃やす「価値観追求型」",
      "他人に優しく、自己表現や創造性を重視する",
      "内面の世界がとても豊かで、感受性・直感力に優れる",
      "プレッシャーや競争より、「意味のある仕事」や「人の役に立つこと」を大切にする"
    ],
    fitCompanies: [
      "静かで配慮のあるコミュニケーション環境（＝Iとの一致）",
      "ビジョンや理念を大切にしている企業（＝Nとの一致）",
      "人の気持ちや福祉的価値を重視する組織（＝Fとの一致）",
      "柔軟な働き方が可能で、個性が認められる環境（＝Pとの一致）"
    ]
  },
  ENFJ: {
    title: "ENFJの特徴（主人公タイプ）",
    indicators: [
      { 
        key: "E（外向）", 
        desc: "社会的で人との関わりを好み、チームを引っ張ることが得意。" 
      },
      { 
        key: "N（直観）", 
        desc: "理念や未来志向を重視し、抽象的なビジョンに魅力を感じる。" 
      },
      { 
        key: "F（感情）", 
        desc: "他者の感情に敏感で、思いやりや協調を大切にする。" 
      },
      { 
        key: "J（判断）", 
        desc: "計画性があり、秩序だった進行や組織運営を好む。" 
      }
    ],
    personality: [
      "人を育て、導くカリスマ的リーダー",
      "周囲の感情や空気を敏感に察知し、チームの士気を高める",
      "組織や社会のために役立つことに高いモチベーションを持つ",
      "他人の成長に喜びを感じ、「人を動かす力」がある"
    ],
    fitCompanies: [
      "人と深く関わることが奨励される職場（＝Eとの一致）",
      "ビジョンや理念に基づいて経営がなされている企業（＝Nとの一致）",
      "思いやりやチームワークを重視する文化（＝Fとの一致）",
      "目標達成に向けて、計画的に物事を進める仕組みがある（＝Jとの一致）"
    ]
  },
  ISFJ: {
    title: "ISFJの特徴（擁護者タイプ）",
    indicators: [
      { 
        key: "I（内向）", 
        desc: "控えめで一人で集中する仕事が得意。静かな環境を好む。" 
      },
      { 
        key: "S（感覚）", 
        desc: "過去の経験や現実的な事実に基づいて着実に行動する。" 
      },
      { 
        key: "F（感情）", 
        desc: "他人への配慮や思いやりがあり、人間関係を重視する。" 
      },
      { 
        key: "J（判断）", 
        desc: "計画的・几帳面で、秩序だった進め方を好む。責任感が強い。" 
      }
    ],
    personality: [
      "誠実で献身的。周囲を支える「縁の下の力持ち」",
      "他人の感情に寄り添いながらも、自分の信念を静かに貫くタイプ",
      "安定した環境で、決められた手順を丁寧にこなすことに安心感を覚える",
      "目立つことよりも、着実な貢献・思いやりを通じて評価されることを好む"
    ],
    fitCompanies: [
      "静かで落ち着いた環境で、安定性を重視する組織（＝Iとの一致）",
      "実務や現場レベルでの積み重ねを大切にする文化（＝Sとの一致）",
      "人間関係を大切にし、温かい社風の企業（＝Fとの一致）",
      "計画性や責任感が評価される職場（＝Jとの一致）"
    ]
  },
  ISTP: {
    title: "ISTPの特徴（巨匠タイプ）",
    indicators: [
      { 
        key: "I（内向）", 
        desc: "一人で集中して作業することが得意。静かな環境を好む。" 
      },
      { 
        key: "S（感覚）", 
        desc: "現実的・実用的な思考を持ち、手を動かすことを重視。" 
      },
      { 
        key: "T（思考）", 
        desc: "論理的・客観的に判断。合理性と機能性を追求する。" 
      },
      { 
        key: "P（知覚）", 
        desc: "臨機応変で柔軟。自由度の高い環境で力を発揮。" 
      }
    ],
    personality: [
      "「考える職人」タイプで、頭と手の両方を駆使して物事を解決する問題解決型",
      "決められたやり方より、自分のやり方で工夫しながら効率よく進めるのが得意",
      "静かでマイペースながら、必要とあれば大胆な行動力も発揮",
      "観察力が鋭く、道具・機械・システムを扱うのが得意なタイプ"
    ],
    fitCompanies: [
      "干渉されずに一人で集中できる職場（＝Iとの一致）",
      "現場主義・実用主義の文化（＝Sとの一致）",
      "論理的・機能的に考えることが評価される組織（＝Tとの一致）",
      "柔軟で裁量が大きく、細かいルールに縛られない働き方（＝Pとの一致）"
    ]
  },
  ESFP: {
    title: "ESFPの特徴（エンターテイナータイプ）",
    indicators: [
      { 
        key: "E（外向）", 
        desc: "人と関わることが好きで、エネルギッシュに周囲を盛り上げる。" 
      },
      { 
        key: "S（感覚）", 
        desc: "今この瞬間の現実や体験を重視し、五感を活かした判断が得意。" 
      },
      { 
        key: "F（感情）", 
        desc: "共感力が高く、人間関係や雰囲気の良さを大切にする。" 
      },
      { 
        key: "P（知覚）", 
        desc: "ルールに縛られず柔軟で、変化に対応しながら自由に働くのが得意。" 
      }
    ],
    personality: [
      "明るく社交的で、チームの雰囲気をパッと明るくするムードメーカー",
      "実体験を大切にし、「今を楽しむ」ことに価値を見出す",
      "細かい計画よりも、現場での臨機応変な対応に強い",
      "共感力が高く、人との関係構築が自然で上手い"
    ],
    fitCompanies: [
      "オープンで活気のあるコミュニケーション環境（＝Eとの一致）",
      "実践・体験型の仕事が評価される環境（＝Sとの一致）",
      "人間関係が良好で、感情や雰囲気を重んじる職場（＝Fとの一致）",
      "変化や多様性に寛容で、自由度のある働き方（＝Pとの一致）"
    ]
  },
  ESTJ: {
    title: "ESTJの特徴（幹部タイプ）",
    indicators: [
      { 
        key: "E（外向）", 
        desc: "人との関わりを積極的に取り、チームを主導することが得意。" 
      },
      { 
        key: "S（感覚）", 
        desc: "現実的で、過去の実績や事実に基づいた判断を重視する。" 
      },
      { 
        key: "T（思考）", 
        desc: "論理的・客観的に物事を処理し、効率と成果を追求する。" 
      },
      { 
        key: "J（判断）", 
        desc: "明確な計画やルールに従って、秩序立てて物事を進める。" 
      }
    ],
    personality: [
      "リーダーシップと実行力に長けた「現場の統率者」タイプ",
      "組織運営に強く、ルールや体制を整えながら成果を出すことが得意",
      "感情よりも論理・事実・経験をもとに冷静な判断を下す",
      "安定性・効率性・実績重視の環境で信頼を集める"
    ],
    fitCompanies: [
      "チームや部門単位で明確な役割と責任が設定されている（＝Eとの一致）",
      "データや実績に基づいて運営される、実務重視の文化（＝Sとの一致）",
      "成果主義・評価制度が明確な組織（＝Tとの一致）",
      "手順・規則・スケジュールが整備されている組織（＝Jとの一致）"
    ]
  }
};

function MBTIResultDetail({ type }) {
  const data = mbtiProfiles[type];

  if (!data) {
    return (
      <div className="mbti-detail">
        <h2>エラー</h2>
        <p>指定されたMBTIタイプのデータが見つかりません。</p>
      </div>
    );
  }

  return (
    <div className="mbti-detail">
      <h2>{data.title}</h2>

      <div className="indicator-grid">
        {data.indicators.map((i, idx) => (
          <div key={idx} className="indicator-card">
            <strong>{i.key}</strong>
            <p>{i.desc}</p>
          </div>
        ))}
      </div>

      <div className="personality">
        <h3>🔧 基本性格</h3>
        {data.personality.map((p, idx) => <p key={idx}>{p}</p>)}
      </div>

      <div className="fit-companies">
        <h3>✅ 適した企業の特徴</h3>
        <ul>
          {data.fitCompanies.map((f, idx) => <li key={idx}>{f}</li>)}
        </ul>
      </div>
    </div>
  );
}

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
      <div className="container mt-5 pt-4">
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
        <MBTIResultDetail type={result} />
      </div>
    );
  }

  const q = questions[step];

  return (
    <div className="container mt-5 pt-4">
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