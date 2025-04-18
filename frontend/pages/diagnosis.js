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
    title: "ENFP（広報担当タイプ）",
    description: "アイデア出しのとき急にスイッチ入ってめちゃくちゃ元気になる",
    indicators: [
      {
        key: "E（外向的）",
        desc: "人との交流をエネルギー源とし、積極的に行動する傾向があります。"
      },
      {
        key: "N（直観的）",
        desc: "抽象的な概念や可能性に敏感で、未来志向の思考を持ちます。"
      },
      {
        key: "F（感情的）",
        desc: "他者の感情に敏感で、人間関係や調和を大切にします。"
      },
      {
        key: "P（知覚的）",
        desc: "柔軟性があり、状況に応じて臨機応変に対応することを好みます。"
      }
    ],
    personality: [
      "好奇心が強く、「面白そう！」と思ったことにはすぐ飛びつく、エネルギッシュで柔軟な発想力を持つタイプです。人との会話やアイデアのキャッチボールを楽しみながら進めることで、自分の中のモチベーションも自然と高まっていきます。",
      "変化や新しさに強く、同じことの繰り返しには飽きやすいため、自由度があり、自分の考えを活かせる環境でこそ力を発揮します。「こうあるべき」ではなく、「これ面白くない？」という視点で物事を動かし、自分のアイデアが誰かに届いたり、影響を与えられる場面に強いやりがいを感じます。仲間と一緒にわいわい進めながら、創造力を広げていくタイプです。"
    ],
    fitCompanies: [
      "裁量があり、アイデアを形にできる自由な環境",
      "価値観や多様性を歓迎する組織文化",
      "人と人とのつながりが大事にされるチーム構成",
      "成長・挑戦を歓迎する、スピード感のある職場",
      "「正確さ」よりも「発想や行動」に価値を感じる評価制度"
    ],
    fitCompaniesDesc: [
      "言われたことをやるだけの職場より、「自分で考えて、自分で動ける」場所が圧倒的に合う。",
      "「変わってるね」を肯定してくれる企業こそが、ENFPの発想力を最大限に引き出せる。",
      "孤立したタスクより、「人とのやり取りの中で動く」仕事の方がやりがいを感じやすい。",
    ]
  },
  ISTJ: {
    title: "ISTJ（堅実な管理者）",
    description: "誰も気づいてないミスを、無言で直しておくタイプ",
    indicators: [
      {
        key: "I（内向的）",
        desc: "一人で集中して作業することを好み、慎重に考えてから行動する傾向があります。"
      },
      {
        key: "S（感覚的）",
        desc: "具体的な事実や詳細を重視し、現実的で実践的なアプローチを取ります。"
      },
      {
        key: "T（思考的）",
        desc: "論理的で客観的な判断を重視し、感情よりも事実に基づいて意思決定を行います。"
      },
      {
        key: "J（判断的）",
        desc: "計画性があり、組織的で、決められたルールや手順を守ることを好みます。"
      }
    ],
    personality: [
      "目標に向けて着実に動く力があり、「どうすれば最短で達成できるか」を常に考えています。自分にも他人にも厳しく、ルールや効率を重視し、いい加減な態度や責任の曖昧さには強い違和感を持ちます。",
      "感情より事実、仲良しより役割分担を優先し、公平性と結果を重んじるリーダーシップが特徴です。組織や仕組みを整えるのが得意で、実行面でも管理面でも力を発揮しやすいタイプです。無秩序な環境や曖昧な指示にはストレスを感じやすく、安定したルールや計画のもとでこそ安心して力を出せます。"
    ],
    fitCompanies: [
      "明文化されたルール・制度が整っている会社",
      "評価が客観的で、成果や実績が正しく見られる環境",
      "安定感があり、大きな組織変動が少ない企業",
      "個性より役割分担が重視される文化",
      "人間関係がドライすぎずウェットすぎず、落ち着いている"
    ],
    fitCompaniesDesc: [
      "「曖昧な指示で動く」よりも、「決まった通りに確実にやる」が得意。ルールの有無はパフォーマンスを左右する。",
      "上司の主観や社内のノリより、「実務の成果」で評価されることに納得感を持つ。",
      "突然の方向転換やイノベーションの連続より、同じ方針でコツコツ改善していける場所が合う。",
      "「自由にやっていいよ」より、「この範囲を任せたい」に安心感を持つ。自律より誠実が求められる方が燃える。",
      "ベタベタせず、礼儀と尊重がある関係がベスト。距離感が読めない環境は居心地が悪い。"
    ]
  },
  INFJ: {
    title: "INFJ（提唱者タイプ）",
    description: "「それって、結局どういう意味なんだろうね」って一人で考えてるタイプ",
    indicators: [
      {
        key: "I（内向的）",
        desc: "一人で深く考える時間を大切にし、内省的な傾向があります。"
      },
      {
        key: "N（直観的）",
        desc: "抽象的な概念や可能性に敏感で、未来志向の思考を持ちます。"
      },
      {
        key: "F（感情的）",
        desc: "他者の感情に敏感で、価値観や倫理観を重視します。"
      },
      {
        key: "J（判断的）",
        desc: "計画性があり、秩序だった生活や組織を好みます。"
      }
    ],
    personality: [
      "目先の成果よりも、「なぜこの仕事をするのか」という意味や理念を重視します。人の気持ちや空気に敏感で、摩擦を避けながらも本質的な対話を求める傾向があります。表面は穏やかでも、内面には確固たる価値観や信念を持っており、それに沿って静かに判断を下す芯の強さがあります。",
      "ノルマや一方的な指示ばかりの環境では力を発揮しづらく、「共感・納得・内なるビジョン」が行動の原動力です。誰かや社会にとって「本当に意味があること」に、静かに力を注ぎたいと考える深い思索型のタイプです。"
    ],
    fitCompanies: [
      "理念やビジョンが明確で、それが現場レベルでも共有されている会社",
      "対話と共感を重視する文化がある企業",
      "人間関係が浅く広くではなく、深く丁寧につながれる雰囲気",
      "社会的意義や長期的視点を持った事業をしている企業",
      "変化はあっても、目的や信念がブレない企業"
    ],
    fitCompaniesDesc: [
      "「どんな目的で働くか」が曖昧だとやる気が出づらい。理念が行動に落とし込まれている職場が理想。",
      "「とりあえずやれ」ではなく、納得感を得ながら前に進める職場でパフォーマンスが安定する。",
      "表面的な会話やパーティー的ノリよりも、じっくり対話して関係を築ける場が向いている。",
      "目の前の数字より、「この仕事が社会の役に立っている」という実感が重要なモチベーション源。",
      "変化に適応できる柔軟性はあるが、「何のために」が変わると強い不安や違和感を覚える。"
    ]
  },
  ENTP: {
    title: "ENTP（討論者タイプ）",
    description: "アイデアの引き出しが多すぎて、話がよく脱線する",
    indicators: [
      {
        key: "E（外向的）",
        desc: "人との交流をエネルギー源とし、積極的に行動する傾向があります。"
      },
      {
        key: "N（直観的）",
        desc: "抽象的な概念や可能性に敏感で、未来志向の思考を持ちます。"
      },
      {
        key: "T（思考的）",
        desc: "論理的で客観的な判断を重視し、感情よりも事実に基づいて意思決定を行います。"
      },
      {
        key: "P（知覚的）",
        desc: "柔軟性があり、状況に応じて臨機応変に対応することを好みます。"
      }
    ],
    personality: [
      "常に「もっと良くできる方法はないか？」を考え、現状に満足せず、新しい視点で物事を捉えようとするタイプです。アイデアの発想力と議論の切り口が豊富で、チームに新しい風を吹き込む存在として活躍します。ルーティン業務や形式的なやりとりにはすぐに飽きてしまい、創造的で挑戦的な環境の方が本領を発揮できます。",
      "納得できないまま進めることは苦手で、ロジックが通っていないとすぐに疑問を呈する傾向があります。仲間とアイデアをぶつけ合いながら、変化を楽しみ、「完成」よりも「革新」にやりがいを感じるタイプです。"
    ],
    fitCompanies: [
      "新規事業・企画・創造的な業務が中心の環境",
      "変化とスピードがある、挑戦的な企業風土",
      "型にはまらず、多様な視点を歓迎する組織文化",
      "議論・対話・頭脳戦を歓迎する上司や仲間",
      "自由と成果が共存し、自走できる裁量型の働き方"
    ],
    fitCompaniesDesc: [
      "「考えろ、つくれ、動け」と言われる職場が最高。守りより攻めが得意。",
      "成長ベンチャー、業界変革、混沌とした状況の中でこそアイデアが冴える。",
      "「前例がない」「常識と違う」ことを恐れず、むしろ面白がってくれる環境が向く。",
      "「議論＝対立」ではなく、「より良い解を出すためのプロセス」として議論が活発な職場が理想。",
      "「好きにやって、ちゃんと結果出せばOK」な文化は、ENTPにとっての天国。"
    ]
  },
  INTP: {
    title: "INTP（論理学者タイプ）",
    description: "指示されるときより、考えてるときのほうが目がキラキラしてる",
    indicators: [
      {
        key: "I（内向的）",
        desc: "一人で深く考える時間を大切にし、内省的な傾向があります。"
      },
      {
        key: "N（直観的）",
        desc: "抽象的な概念や可能性に敏感で、未来志向の思考を持ちます。"
      },
      {
        key: "T（思考的）",
        desc: "論理的で客観的な判断を重視し、感情よりも事実に基づいて意思決定を行います。"
      },
      {
        key: "P（知覚的）",
        desc: "柔軟性があり、状況に応じて臨機応変に対応することを好みます。"
      }
    ],
    personality: [
      "物事の「なぜ？」に強い興味を持ち、表面的な理解ではなく、構造や本質まで掘り下げて考えようとします。自由に思考できる時間や、自分のペースで進められる環境でこそ力を発揮します。感情的なやり取りや、形式的な人間関係にはあまり価値を見出さず、静かに、でも深く考える時間を何より大切にします。",
      "会話の中ではあまり目立たなくても、核心を突くような視点や、独自の切り口を持っているタイプです。質の高い議論や知的刺激に魅力を感じ、「型にはまった作業」や目的の見えない業務にはすぐに飽きてしまいます。"
    ],
    fitCompanies: [
      "自由度が高く、自分のやり方で考えられる環境",
      "構造設計・システム思考が求められる業務（R&D・IT・コンサルなど）",
      "評価が成果や創造性ベースであり、社交性に依存しない企業文化",
      "少人数や専門チームなど、静かに集中できる編成",
      "多様な視点や独自の発想を歓迎する柔軟なカルチャー"
    ],
    fitCompaniesDesc: [
      "「こうしろ」より「こうなってればOK」というゴールベースな職場の方が成果を出しやすい。",
      "「考える仕事」ができない環境では能力を持て余す。再現性や法則性を考える仕事がぴったり。",
      "「うまく立ち回った人が得する」職場では沈む。内容を見てくれる場所を好む。",
      "大人数での調整や会議が多すぎると疲れやすくなる。できればやり取りは最小限にしたい。",
      "型にハマるより、面白い仮説や観点を評価してくれる組織にやりがいを感じる。"
    ]
  },
  ESFJ: {
    title: "ESFJ（領事タイプ）",
    description: "自分のタスク終わったあと「何か手伝えることありますか？」って聞いてくる",
    indicators: [
      {
        key: "E（外向的）",
        desc: "人との交流をエネルギー源とし、積極的に行動する傾向があります。"
      },
      {
        key: "S（感覚的）",
        desc: "具体的な事実や詳細を重視し、現実的で実践的なアプローチを取ります。"
      },
      {
        key: "F（感情的）",
        desc: "他者の感情に敏感で、人間関係や調和を大切にします。"
      },
      {
        key: "J（判断的）",
        desc: "計画性があり、組織的で、決められたルールや手順を守ることを好みます。"
      }
    ],
    personality: [
      "人の感情や空気にとても敏感で、周囲が安心して働けるように自然と場を整えることができます。チーム全体の調和を何より大切にし、「みんなが気持ちよく働けること」に大きなやりがいを感じます。人との距離感が近く、困っている人にはすぐに手を差し伸べ、頼られることや感謝されることがエネルギーになります。",
      "社交的で面倒見もよく、礼儀やマナーもしっかりしている一方で、無関心な対応や冷たい態度には深く傷つきやすい一面もあります。ルールやマナーを丁寧に守り、周囲の期待に応えようとまっすぐ努力する誠実なタイプです。"
    ],
    fitCompanies: [
      "人と人とのつながりやチームプレイを重視する職場",
      "人の役に立てる実感がある仕事（接客・福祉・教育など）",
      "あたたかいコミュニケーションが日常にある組織文化",
      "明文化されたルールと、安定した人間関係が保たれる会社",
      "周囲との信頼関係を大切にしながら、誠実に評価される企業"
    ]
  },
  ISFP: {
    title: "ISFP（冒険家タイプ）",
    description: "周りの空気が悪くなると、一歩引いてやんわり避けてる",
    indicators: [
      {
        key: "I（内向的）",
        desc: "静かな環境で一人で集中して作業することを好み、慎重に考えてから行動する傾向があります。"
      },
      {
        key: "S（感覚的）",
        desc: "具体的な事実や詳細を重視し、現実的で実践的なアプローチを取ります。"
      },
      {
        key: "F（感情的）",
        desc: "他者の感情に敏感で、人間関係や調和を大切にします。"
      },
      {
        key: "P（知覚的）",
        desc: "柔軟性があり、状況に応じて臨機応変に対応することを好みます。"
      }
    ],
    personality: [
      "自分の価値観や感覚をとても大切にしており、強制されたり、押しつけられるような環境には強いストレスを感じます。穏やかで控えめな印象ですが、内面には強いこだわりと美意識を持っています。対立やノルマの強い職場よりも、人間関係が落ち着いていて、安心して自分のペースで進められる環境に向いています。",
      "少人数で静かにコツコツと進める仕事で力を発揮しやすく、感謝されることにやりがいを感じます。褒められるよりも、「ちゃんと見てくれている」と感じられる信頼の方が嬉しいタイプです。"
    ],
    fitCompanies: [
      "やさしい空気感と、過度に干渉しない職場",
      "少数精鋭 or 個人プレーに近い仕事環境",
      "感覚や感性を活かせる業務（デザイン・ケア・サービス等）",
      '細かいルールより、"自分の感覚"で判断できる自由度のある職場',
      "表彰より、感謝やねぎらいが日常的にある企業文化"
    ],
    fitCompaniesDesc: [
      "上下関係が厳しくなく、お互いを尊重し合えるフラットな組織の方が安心して働ける。",
      "チームでも可だが、大人数より「少数の信頼できる人」との関係で力を発揮しやすい。",
      "成果が「論理や数字」だけで測られる環境では、やりがいを感じにくくなる。",
      "「これをこうしておいて」と任されるような仕事の方が、生き生きできる。",
      "大げさな称賛より、「見ててくれたんだ」と感じられる温かい言葉の方が響く。"
    ]
  },
  ESTP: {
    title: "ESTP（起業家タイプ）",
    description: "トラブル起きたとき、一番に動いてて気づいたら収まってる",
    indicators: [
      {
        key: "E（外向的）",
        desc: "人との交流をエネルギー源とし、積極的に行動する傾向があります。"
      },
      {
        key: "S（感覚的）",
        desc: "具体的な事実や詳細を重視し、現実的で実践的なアプローチを取ります。"
      },
      {
        key: "T（思考的）",
        desc: "論理的で客観的な判断を重視し、感情よりも事実に基づいて意思決定を行います。"
      },
      {
        key: "P（知覚的）",
        desc: "柔軟性があり、状況に応じて臨機応変に対応することを好みます。"
      }
    ],
    personality: [
      "目の前の状況に即座に反応し、体を動かしながら学ぶことに長けた実践型タイプです。考えるより先に動いてみることで理解を深め、行動しながら軌道修正していく柔軟性があります。「動けない時間」や、細かいルールに縛られる環境にはストレスを感じやすく、スピード感のある現場や実地の中で力を発揮します。",
      "社交的で人当たりも良く、駆け引きや交渉にも強い一方で、内心では合理的に判断し、成果や数字で評価される方がモチベーションにつながります。競争やスリルがあるとスイッチが入り、マンネリ化やルーティン作業にはすぐに飽きてしまう傾向があります。"
    ],
    fitCompanies: [
      "スピード感と行動重視の企業文化",
      "裁量が大きく、自由度の高いポジション",
      "成果主義やインセンティブ型の評価制度",
      "対人スキルや現場での機転が活かせる仕事",
      "変化が激しく、次々と課題が出てくるダイナミックな環境"
    ],
    fitCompaniesDesc: [
      "じっくり考えるより、動きながら判断するスタイルがマッチ。ベンチャーや営業現場などが好相性。",
      "「型通りにやる」より「自分のやり方で勝ちに行く」ほうが圧倒的にモチベーションが上がる。",
      "努力より「結果を出したか」で見てくれるほうがやる気に火がつく。逆にプロセス重視は少し退屈。",
      "その場での判断力や人間観察の鋭さを活かせるような、フロント業務や交渉系がフィットする。",
      "トラブルや想定外すら「面白い」と思えるタイプ。平和すぎる職場では逆に退屈してしまう。"
    ]
  },
  INTJ: {
    title: "INTJ（建築家タイプ）",
    description: "何も言わずに黙々とやってるけど、実は全体の流れを一番把握してる",
    indicators: [
      {
        key: "I（内向的）",
        desc: "一人で深く考える時間を大切にし、内省的な傾向があります。"
      },
      {
        key: "N（直観的）",
        desc: "抽象的な概念や可能性に敏感で、未来志向の思考を持ちます。"
      },
      {
        key: "T（思考的）",
        desc: "論理的で客観的な判断を重視し、感情よりも事実に基づいて意思決定を行います。"
      },
      {
        key: "J（判断的）",
        desc: "計画性があり、組織的で、決められたルールや手順を守ることを好みます。"
      }
    ],
    personality: [
      "感覚や感情よりも、論理と目的意識を重視して動くタイプです。全体構造やゴールを把握してから行動したいという意識が強く、曖昧なまま進めることには抵抗を感じます。指示されるより、自分のやり方で効率的に進めたいという思いがあり、マイクロマネジメントにはストレスを感じやすいです。",
      "無駄な雑談や表面的な付き合いよりも、意味のある議論や知的な対話に価値を見出します。情報の質や仕組みの完成度に強いこだわりを持ち、高い水準を保ちたいという意識から、自らのスタイルを貫きます。"
    ],
    fitCompanies: [
      "論理・戦略・構造が求められる仕事環境",
      "自由度が高く、自律的に判断・進行できるポジション",
      "目的と手段が明確に設計されているプロジェクト型の仕事",
      "成長機会が実力・論理ベースで評価される企業文化",
      "雑談・付き合い重視のカルチャーが弱く、情報の本質に集中できる職場"
    ],
    fitCompaniesDesc: [
      "曖昧で情緒的な職場では疲れやすい。仮説検証・構造設計・戦略思考が尊重される業務内容が向く。",
      "指示通りに動くより、「最短距離で成果を出す」ための裁量が与えられる職場が好ましい。",
      "ゴールの曖昧さや無意味な方向転換には冷める。設計意図と整合性がある環境が必要。",
      "年功序列や「みんな仲良く」より、能力・成果がロジカルに評価される組織が合う。",
      "無意味な会議や「空気を読む文化」には極端にエネルギーを削がれる。"
    ]
  },
  ENTJ: {
    title: "ENTJ（指揮官タイプ）",
    description: "気づけば全体の進行を仕切ってるタイプ",
    indicators: [
      {
        key: "E（外向的）",
        desc: "人との交流をエネルギー源とし、積極的に行動する傾向があります。"
      },
      {
        key: "N（直観的）",
        desc: "抽象的な概念や可能性に敏感で、未来志向の思考を持ちます。"
      },
      {
        key: "T（思考的）",
        desc: "論理的で客観的な判断を重視し、感情よりも事実に基づいて意思決定を行います。"
      },
      {
        key: "J（判断的）",
        desc: "計画性があり、組織的で、決められたルールや手順を守ることを好みます。"
      }
    ],
    personality: [
      "戦略的思考と高い目標意識を持ち、全体を見渡しながら効率よく物事を動かすタイプです。リーダーシップを取ることに抵抗がなく、早い段階から物事を前に進める推進力を発揮します。",
      "結果重視で、感情よりも合理性を優先し、意思決定もスピーディかつ自信を持って行います。そのぶん、他人にも同じスピードや判断力を求めすぎてしまうこともあります。計画性と実行力のバランスが取れており、目標に向けてチームを巻き込みながら進める力に長けた、頼もしい存在です。"
    ],
    fitCompanies: [
      "明確な目標と評価基準がある",
      "裁量とスピードが求められる環境",
      "成長と成果に貪欲な文化",
      "戦略性や構造化を求められる業務",
      "周囲を巻き込めるチーム構成"
    ]
  },
  INFP: {
    title: "INFP（仲介者タイプ）",
    description: "自分が納得してない仕事だと、急に動きが鈍くなるタイプ",
    indicators: [
      {
        key: "I（内向的）",
        desc: "静かな環境で一人で集中して作業することを好み、慎重に考えてから行動する傾向があります。"
      },
      {
        key: "N（直観的）",
        desc: "抽象的な概念や可能性に敏感で、未来志向の思考を持ちます。"
      },
      {
        key: "F（感情的）",
        desc: "他者の感情に敏感で、価値観や倫理観を重視します。"
      },
      {
        key: "P（知覚的）",
        desc: "柔軟性があり、状況に応じて臨機応変に対応することを好みます。"
      }
    ],
    personality: [
      "納得できない指示や、自分の価値観に反することには心が折れやすい一方で、理想や想いを持ってじっくり物事に向き合う姿勢があります。想像力が豊かで、課題に対して自分なりの理想像を描きながら行動します。表には出しませんが、内側には強い信念や「こうありたい」という価値観を持っています。",
      "静かに、でも確実に誰かのためになっていると実感できる仕事にやりがいを感じ、衝突や競争よりも、安心感のある協調的な関係性を大切にします。共感や思いやりが通じる環境の中で、じわじわと力を発揮するタイプです。"
    ],
    fitCompanies: [
      "社会的意義や理念を大切にする企業",
      "人を思いやる文化がある、やさしい職場環境",
      "個人の考えや価値観を尊重する組織",
      "変化を恐れず、自分の内面と向き合えるような自由度がある会社",
      "評価が競争ベースではなく、姿勢や取り組みを見てくれる企業"
    ],
    fitCompaniesDesc: [
      "「何のために働くのか」が曖昧だとパフォーマンスが落ちやすい。理念やビジョンに共感できることが最重要。",
      "ピリピリした空気や、対立・競争を煽る文化は不向き。共感や配慮があるチームで力を発揮する。",
      "「普通こうだから」と一律で押しつけられる環境では疲弊しがち。自分のやり方を認めてもらえると活き活きする。",
      "じっくり考える時間や、自分のペースを守れる柔軟性があると長く働ける。",
      "ランキングやノルマより、「ちゃんと見てくれてる」という実感の方が100倍励みになる。"
    ]
  },
  ENFJ: {
    title: "ENFJ（主人公タイプ）",
    description: "「みんなの意見も聞いてみよう」って口癖",
    indicators: [
      {
        key: "E（外向的）",
        desc: "人との交流をエネルギー源とし、積極的に行動する傾向があります。"
      },
      {
        key: "N（直観的）",
        desc: "抽象的な概念や可能性に敏感で、未来志向の思考を持ちます。"
      },
      {
        key: "F（感情的）",
        desc: "他者の感情に敏感で、人間関係や調和を大切にします。"
      },
      {
        key: "J（判断的）",
        desc: "計画性があり、組織的で、決められたルールや手順を守ることを好みます。"
      }
    ],
    personality: [
      "共感力が高く、周囲の気持ちや空気をすばやく察知し、自然とサポートに回ったり、全体の雰囲気を整えたりするタイプです。チームの力を引き出すことに喜びを感じ、「一緒に成長する」スタンスで関わろうとします。",
      "ビジョンや目的を意識して動く傾向があり、単なる作業や意義を感じにくい業務にはエネルギーが続きにくい一面もあります。信頼関係をとても大切にし、雑な扱いや無関心には強く落ち込むこともありますが、一度関係が築かれれば、チームにとって非常に頼れる存在となります。リーダー的なポジションでも活躍しますが、その本質は「まとめ役」ではなく、「巻き込み役」としての力にあります。"
    ],
    fitCompanies: [
      "ビジョンやミッションが組織全体に浸透している会社",
      "人材育成やチームマネジメントに力を入れている環境",
      "共感・対話・思いやりが重視される文化",
      "「人の力」を信じている経営スタイル・組織づくり",
      "目的のある挑戦や、誰かのためになる仕事"
    ],
    fitCompaniesDesc: [
      "「この会社は何を目指しているのか？」に共感できないと、ENFJのエネルギーは続かない。",
      "誰かを成長させたり、チームをまとめたりする役割でこそ真価を発揮する。",
      "気持ちのないコミュニケーションや冷たい関係性では、情熱が空回りしてしまう。",
      "個人の心を動かすことに関心があるENFJは、人を大切にする会社と非常に親和性が高い。",
      "「自分がやらなくても回る」仕事より、「自分が動けば誰かが変わる」状況でやる気が湧く。"
    ]
  },
  ISFJ: {
    title: "ISFJ（擁護者タイプ）",
    description: "誰かの資料づくりを、気づいたら手伝ってくれてるやつ",
    indicators: [
      {
        key: "I（内向的）",
        desc: "静かな環境で一人で集中して作業することを好み、慎重に考えてから行動する傾向があります。"
      },
      {
        key: "S（感覚的）",
        desc: "具体的な事実や詳細を重視し、現実的で実践的なアプローチを取ります。"
      },
      {
        key: "F（感情的）",
        desc: "他者の感情に敏感で、人間関係や調和を大切にします。"
      },
      {
        key: "J（判断的）",
        desc: "計画性があり、組織的で、決められたルールや手順を守ることを好みます。"
      }
    ],
    personality: [
      "人の感情や空気にとても敏感で、「誰かが困っていないか」「場が乱れていないか」を自然と察知します。チーム全体の調和を大切にし、みんなが気持ちよく働けるように裏方として動くのが得意です。「誰かのためになる仕事」に強いやりがいを感じ、自分の貢献が目に見えることでモチベーションが高まります。",
      "社交的で頼られることに喜びを感じる一方で、感謝されない状況や無視されると一気にやる気を失いやすい面もあります。ルールや約束事をきちんと守り、周囲の期待に応えようと全力で頑張る、誠実で温かなタイプです。"
    ],
    fitCompanies: [
      "チームワークを重視し、支え合いの文化がある会社",
      "業務がある程度決まっており、周囲の役割も明確な職場",
      "感謝や気づかいが言葉で伝えられる企業風土",
      "安定感のある企業で、急激な変化が少ない環境",
      "感情や空気を大事にする人が多く、礼儀や思いやりがある職場"
    ],
    fitCompaniesDesc: [
      "競争よりも協力。「みんなで達成する」ことに誇りを感じ、孤立感があるとパフォーマンスが落ちる。",
      "自分のポジションを把握して動ける環境だと、自然と補助的な動きや配慮がしやすくなる。",
      "「気づかれない努力」を続けやすくなるのは、「ありがとう」が日常にある職場。",
      "変化よりも「慣れた仕事を丁寧にこなす」スタイルの方が心に余裕を持って働ける。",
      "ロジックで押し切るよりも、共感や配慮で動く人が多い会社がフィットする。"
    ]
  },
  ISTP: {
    title: "ISTP（巨匠タイプ）",
    description: "説明聞くより「やってみた方が早くない？」って思ってるやつ",
    indicators: [
      {
        key: "I（内向的）",
        desc: "一人で集中して作業することを好み、慎重に考えてから行動する傾向があります。"
      },
      {
        key: "S（感覚的）",
        desc: "具体的な事実や詳細を重視し、現実的で実践的なアプローチを取ります。"
      },
      {
        key: "T（思考的）",
        desc: "論理的で客観的な判断を重視し、感情よりも事実に基づいて意思決定を行います。"
      },
      {
        key: "P（知覚的）",
        desc: "柔軟性があり、状況に応じて臨機応変に対応することを好みます。"
      }
    ],
    personality: [
      "抽象的な議論より、「まずやってみる」が基本スタンスです。体感や経験を通して覚えることを得意とし、与えられた裁量の中で最適解を静かに探しながら動きます。周囲に無理に合わせようとはせず、必要な会話はするけれど、ベタベタした人間関係は好みません。",
      "トラブルや想定外の出来事にも冷静に対応でき、淡々とリカバリーする能力に長けています。ロジカルで現実的な一方で、動きの遅い人や非効率な会議、曖昧な指示には強いストレスを感じやすいタイプです。"
    ],
    fitCompanies: [
      "裁量がある程度あり、やり方を任せてもらえる職場",
      "実践重視・現場主義の文化を持つ企業",
      "スピード感があり、試行錯誤を許容する企業風土",
      "上下関係が緩やかで、技術やスキルが尊重される組織",
      "個人プレーが許される仕事や、少数チームで動ける環境"
    ],
    fitCompaniesDesc: [
      "細かく指示されるより、「目的さえ共有されれば任せてもらえる」環境が好ましい。",
      "とにかくやってみて修正するスタイルが合う。デスクワーク中心で抽象度が高すぎる業務は退屈に感じやすい。",
      "綿密すぎる計画より、「動きながら調整」の方がモチベーションが続く。",
      "年齢や立場ではなく、技量や実行力で認められることに納得感を持つ。",
      "大人数での協調や調整ごとは苦手。必要最小限の連携で最大限の結果を出すスタイルが合う。"
    ],
  },
  ESFP: {
    title: "ESFP（エンターテイナータイプ）",
    description: "新しいことにノリよく反応して、とりあえずやってみるタイプ",
    indicators: [
      {
        key: "E（外向的）",
        desc: "人との交流をエネルギー源とし、積極的に行動する傾向があります。"
      },
      {
        key: "S（感覚的）",
        desc: "具体的な事実や詳細を重視し、現実的で実践的なアプローチを取ります。"
      },
      {
        key: "F（感情的）",
        desc: "他者の感情に敏感で、人間関係や調和を大切にします。"
      },
      {
        key: "P（知覚的）",
        desc: "柔軟性があり、状況に応じて臨機応変に対応することを好みます。"
      }
    ],
    personality: [
      "「今この瞬間」を大切にし、その場の空気を明るくしたり、チームの雰囲気を和ませる力を自然に持っているタイプです。目で見て、体験して、実感しながら進められる仕事を好み、抽象的すぎる業務や、感覚的にピンとこない作業はやる気が出にくい傾向があります。",
      "柔軟にその場に合わせて動くことが得意で、人との距離感が近く、サービス精神や気配りにも優れています。人間関係が良好で、感謝や褒め合いが自然にある環境では、自ら楽しみながら貢献し、周囲にもポジティブな影響を与えます。成果も大事ですが、それ以上に「楽しいかどうか」が仕事の継続力に直結します。"
    ],
    fitCompanies: [
      "人との関わりが中心で、リアクションが得られる仕事",
      "明るくフラットな組織文化、仲の良い職場",
      "体感型・実践型の仕事ができる環境",
      "変化やチャレンジを楽しめる仕事環境",
      "感謝や褒め合いが自然に交わされる文化"
    ],
    fitCompaniesDesc: [
      "接客・営業・イベントなど「目の前の人の反応がダイレクトに返ってくる」業務でエネルギーが湧く。",
      "ピリピリした雰囲気や堅苦しい上下関係では萎縮しがち。ノリと会話のある職場が居心地が良い。",
      "数字や資料より、体験・会話・動きの中で進めていける方が力を発揮しやすい。",
      "毎日同じことの繰り返しでは飽きやすい。刺激があったり、いろんな役割を担える職場がベスト。",
      "「頑張りを見てくれている」という実感が行動の原動力になる。空気の温かさが最重要。"
    ]
  },
  ESTJ: {
    title: "ESTJ（幹部タイプ）",
    description: "リーダー任されると「とりあえず全体共有からやろうか」って言いがち",
    indicators: [
      {
        key: "E（外向的）",
        desc: "人との交流をエネルギー源とし、積極的に行動する傾向があります。"
      },
      {
        key: "S（感覚的）",
        desc: "具体的な事実や詳細を重視し、現実的で実践的なアプローチを取ります。"
      },
      {
        key: "T（思考的）",
        desc: "論理的で客観的な判断を重視し、感情よりも事実に基づいて意思決定を行います。"
      },
      {
        key: "J（判断的）",
        desc: "計画性があり、組織的で、決められたルールや手順を守ることを好みます。"
      }
    ],
    personality: [
      "目標に向けて着実に動く力があり、「どうすれば最短で達成できるか」を常に考えるタイプです。自分にも他人にも厳しく、ルールや効率を重視し、責任感のない態度や曖昧な進行には強い違和感を持ちます。公平性と成果を何より大切にし、チームの中でも自然とリーダーシップを発揮する場面が多くなります。",
      "仕組みづくりやスケジュール管理が得意で、段取り良く物事を進めることに安心感とやりがいを感じます。ただし無秩序な環境や、指示がふわっとしている状況にはストレスを感じやすく、明確な役割分担とルールがある職場でこそ力を発揮します。"
    ],
    fitCompanies: [
      "ルールや手順が整い、管理体制が明確な企業",
      "成果や役割が明確に評価される職場",
      "上昇志向・目標達成を重視する組織文化",
      "管理職への道や組織内キャリアが明確な会社",
      "プロセスの安定と、数字や成果に基づいた意思決定が行われる環境"
    ],
    fitCompaniesDesc: [
      "整っていない組織を見ると自ら立て直そうとする気質がある。秩序がある方が力を発揮しやすい。",
      "「どこまでやれば合格なのか」が見えている職場だと燃える。「察して」はNG。",
      "向上心が高く、成果を目指して努力する人たちと働くと、抜群の推進力を発揮する。",
      "現場での努力がきちんと昇進・権限につながる仕組みがあると、やりがいを強く感じる。",
      "「感覚」よりも「事実ベースでの運用」がされている企業が安心して動ける。"
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
      <h2 className="text-2xl font-bold mb-3">{data.title}</h2>
      <p className="text-lg text-muted mb-4">{data.description}</p>

      {/* 基本性格のカード */}
      <div className="section-title mb-3">
        <h3 className="text-xl font-semibold text-primary">
          <i className="bi bi-gear me-2"></i>
          基本性格
        </h3>
      </div>
      <div className="row g-3 mb-4">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              {/* MBTIタイプの各アルファベットの説明カード */}
              <div className="row g-3 mb-4">
                {data.indicators.map((i, idx) => (
                  <div key={idx} className="col-md-6 col-lg-3">
                    <div className="card shadow-sm h-100 border-0">
                      <div className="card-body p-4">
                        <h5 className="card-title text-primary mb-3">
                          <i className="bi bi-arrow-right-circle me-2"></i>
                          {i.key}
                        </h5>
                        <p className="card-text text-muted mb-0">{i.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* 基本性格解説カード */}
              <div className="card bg-light border-0">
                <div className="card-body p-4">
                  <div className="row">
                    <div className="col-12">
                      {data.personality.map((p, idx) => (
                        <p key={idx} className="card-text mb-2" style={{ whiteSpace: 'pre-line' }}>
                          💬 {p}
                        </p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 適した企業の特徴のカード */}
      <div className="section-title mb-3">
        <h3 className="text-xl font-semibold text-primary">
          <i className="bi bi-building me-2"></i>
          適した企業の特徴
        </h3>
      </div>
      <div className="row g-3">
        <div className="col-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <div className="row g-3">
                {data.fitCompanies.map((f, idx) => (
                  <div key={idx} className="col-md-6">
                    <div className="card bg-light border-0">
                      <div className="card-body p-3">
                        <p className="card-text mb-2 fw-medium">{f}</p>
                        {data.fitCompaniesDesc && data.fitCompaniesDesc[idx] && (
                          <p className="card-text mb-0" style={{ 
                            fontSize: '0.8em', 
                            color: '#555',
                            lineHeight: '1.4',
                            marginLeft: '0.5rem'
                          }}>
                            <span style={{ color: '#888' }}>→</span> {data.fitCompaniesDesc[idx]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
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
        <div className="mt-3">
          <MBTIResultDetail type={result} />
        </div>
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