import type { Metadata } from "next";
import Link from "next/link";
import {
  Scissors,
  Clock,
  CheckCircle,
  HelpCircle,
  Dog,
  MapPin,
  Star,
  Calendar,
  ListChecks,
  BookOpen,
  Home,
  Search,
  ShieldCheck,
  MessageCircle,
  Banknote,
  Footprints,
  Bath,
  Sparkles,
  ClipboardList,
  Heart,
  Ear,
} from "lucide-react";
import Breadcrumb from "@/components/Breadcrumb";
import {
  generateBreadcrumbJsonLd,
  generateFAQJsonLd,
} from "@/lib/seo/jsonld";

const BASE_URL = "https://trimming.michi-biki.jp";

/* ------------------------------------------------------------------
   Metadata
   ------------------------------------------------------------------ */
export const metadata: Metadata = {
  title: "はじめてのトリミングガイド｜初心者でも安心",
  description:
    "犬のトリミングが初めての飼い主さん向けの完全ガイド。トリミングの基礎知識、開始時期、サロンの選び方、当日の準備、施術の流れ、自宅ケアまで詳しく解説。よくある質問にもお答えします。",
  openGraph: {
    title: "はじめてのトリミングガイド｜初心者でも安心 | うちの犬スタイル",
    description:
      "犬のトリミングが初めての飼い主さん向けの完全ガイド。トリミングの基礎知識からサロンの選び方、当日の準備まで詳しく解説します。",
    url: `${BASE_URL}/guide`,
    type: "article",
  },
  alternates: {
    canonical: `${BASE_URL}/guide`,
  },
};

/* ------------------------------------------------------------------
   Data
   ------------------------------------------------------------------ */
const tocItems = [
  { id: "what-is-trimming", label: "トリミングとは？", icon: Scissors },
  { id: "when-to-start", label: "トリミングはいつから？", icon: Calendar },
  { id: "frequency", label: "トリミングの頻度", icon: Clock },
  { id: "choose-salon", label: "サロンの選び方", icon: Search },
  { id: "preparation", label: "当日の持ち物と準備", icon: ListChecks },
  { id: "flow", label: "トリミングの流れ", icon: Footprints },
  { id: "home-care", label: "自宅ケアの基本", icon: Home },
  { id: "faq", label: "よくある質問", icon: HelpCircle },
];

const frequencyData = [
  { breed: "トイプードル", frequency: "月1回", note: "毛が伸び続けるため定期的なカットが必須" },
  { breed: "シーズー", frequency: "月1回", note: "毛が絡まりやすく定期ケアが重要" },
  { breed: "ヨークシャーテリア", frequency: "月1回", note: "シルキーコートの維持に定期カットが必要" },
  { breed: "マルチーズ", frequency: "月1回", note: "純白の被毛を清潔に保つためにも定期的に" },
  { breed: "ポメラニアン", frequency: "月1〜2回", note: "ダブルコートのためブラッシング重視" },
  { breed: "ミニチュアダックスフンド", frequency: "月1〜2回", note: "長毛種は月1回、短毛種は2ヶ月に1回程度" },
  { breed: "チワワ", frequency: "1〜2ヶ月に1回", note: "短毛種はシャンプー中心でOK" },
  { breed: "柴犬", frequency: "1〜2ヶ月に1回", note: "換毛期はこまめなシャンプーがおすすめ" },
  { breed: "ゴールデンレトリバー", frequency: "月1〜2回", note: "大型犬のため自宅ケアと併用が理想" },
  { breed: "フレンチブルドッグ", frequency: "1〜2ヶ月に1回", note: "皮膚が敏感なため低刺激シャンプーを推奨" },
];

const checklistItems = [
  { item: "狂犬病予防接種証明書", description: "年1回の接種証明。ほぼ全てのサロンで提示を求められます。" },
  { item: "混合ワクチン接種証明書", description: "5種以上の混合ワクチン証明書。接種から1年以内のものが必要です。" },
  { item: "普段使っているリード・首輪", description: "サロンへの移動時に必要です。慣れたものを使いましょう。" },
  { item: "おやつ（ご褒美用）", description: "トリミング後のご褒美に。サロンによっては持ち込みNGの場合もあります。" },
  { item: "カットスタイルの参考写真", description: "希望のスタイルがあれば、写真を見せるとイメージが伝わりやすくなります。" },
  { item: "アレルギー・持病の情報メモ", description: "皮膚トラブルや服用中の薬がある場合は必ずトリマーに伝えましょう。" },
];

const flowSteps = [
  {
    step: 1,
    title: "受付",
    description:
      "サロンに到着したら、受付で予約名を伝えます。初回の場合はカルテ（問診票）の記入を求められることが多いです。愛犬の犬種、年齢、性格、アレルギーの有無、過去のトリミング経験などを記入します。ワクチン証明書の提示もこのタイミングで行います。",
  },
  {
    step: 2,
    title: "カウンセリング",
    description:
      "トリマーと一緒にカットスタイルや仕上がりイメージを相談します。「短めにしてほしい」「目の周りは見えるようにしたい」など、具体的に伝えると安心です。皮膚の状態や毛玉の有無なども確認し、必要に応じて追加ケアの提案を受けることもあります。",
  },
  {
    step: 3,
    title: "シャンプー・ブロー",
    description:
      "まず全身をぬるま湯で濡らし、犬種や肌質に合ったシャンプーで丁寧に洗います。肛門腺絞りや耳掃除もこのタイミングで行うサロンが多いです。シャンプー後はタオルドライとドライヤーでしっかり乾かします。ドライヤーの温度や風量にも配慮してくれます。",
  },
  {
    step: 4,
    title: "カット・スタイリング",
    description:
      "カウンセリングで決めたスタイルに沿って、ハサミやバリカンを使ってカットしていきます。顔まわり、体、足先、尻尾と全身をバランスよく整えます。トイプードルのテディベアカットやシュナウザーカットなど、犬種特有のスタイルもここで仕上げます。",
  },
  {
    step: 5,
    title: "仕上げ・チェック",
    description:
      "カット後は全体のバランスを確認し、細かい部分を調整します。爪切り、足裏バリカン、リボンやバンダナなどのアクセサリー装着もこの段階で行います。最終的な仕上がりをトリマーがチェックし、写真撮影サービスを提供しているサロンもあります。",
  },
  {
    step: 6,
    title: "お迎え・お会計",
    description:
      "仕上がりの確認をしてお会計をします。トリマーから施術中の愛犬の様子や、自宅でのケアアドバイスを聞けることもあります。気になった点があれば遠慮なく伝えましょう。次回の予約をこの場で取ると、希望の日時を確保しやすくなります。",
  },
];

const homeCareItems = [
  {
    title: "ブラッシング",
    icon: Sparkles,
    description:
      "毎日のブラッシングは被毛の健康を保つ基本中の基本です。毛玉や絡まりを防ぎ、皮膚への血行を促進する効果もあります。犬種に合ったブラシを選ぶことが大切で、スリッカーブラシ、ピンブラシ、コームなどを使い分けましょう。特にトイプードルやシーズーなどの長毛種は、毎日欠かさずブラッシングすることで毛玉の発生を防げます。ブラッシング時に皮膚の異常（赤み、フケ、できもの）がないかも同時にチェックしましょう。",
  },
  {
    title: "爪切り",
    icon: ClipboardList,
    description:
      "犬の爪は放置すると巻き爪になったり、歩行に支障が出たりします。目安として2〜3週間に1回のペースで爪切りを行いましょう。白い爪の場合は血管（クイック）がピンク色に透けて見えるので、その手前でカットします。黒い爪の場合は少しずつ切り進め、断面の中央に湿った部分が見えたらストップしましょう。万が一出血した場合に備えて、止血パウダー（クイックストップ）を常備しておくと安心です。不安な場合はトリミングサロンや動物病院に任せることをおすすめします。",
  },
  {
    title: "耳掃除",
    icon: Ear,
    description:
      "垂れ耳の犬種（コッカースパニエル、シーズーなど）は特に外耳炎になりやすいため、週1回程度の耳掃除が推奨されます。市販の犬用イヤークリーナーをコットンに含ませ、見える範囲の汚れを優しく拭き取ります。綿棒を耳の奥に入れるのは厳禁です。耳からの異臭、過度な耳垢、赤み、腫れなどの症状が見られる場合は、獣医師への相談をおすすめします。トリミング時に耳毛の処理も行ってもらえるので、あわせて相談しましょう。",
  },
  {
    title: "歯磨き",
    icon: Heart,
    description:
      "犬の歯周病は3歳以上の犬の約80%に見られると言われています。毎日の歯磨きが理想ですが、最低でも週2〜3回は行いましょう。犬用の歯ブラシと歯磨きペーストを使用します。いきなり歯ブラシを使うのが難しい場合は、指に巻いたガーゼで歯の表面を拭くところから始めてみてください。デンタルガムや歯磨きおもちゃも補助的なケアとして効果的です。定期的に獣医師による歯科チェックを受けることもおすすめします。",
  },
];

const faqData = [
  {
    question: "トリミング中に愛犬が暴れたり噛んだりしないか心配です",
    answer:
      "プロのトリマーは犬の扱いに慣れており、犬の性格やその日の体調に合わせて施術します。怖がりな子には優しく声をかけながら少しずつ進め、興奮しやすい子にはクールダウンの時間を設けるなど、一頭一頭に合わせた対応をしてくれます。初回は慣れないため緊張する子も多いですが、回数を重ねるうちにリラックスできるようになることがほとんどです。事前にサロンに愛犬の性格を伝えておくとより安心です。",
  },
  {
    question: "皮膚アレルギーがある犬でもトリミングできますか？",
    answer:
      "アレルギーのある犬でもトリミングは可能です。予約時に必ずアレルギーの症状や使用中の薬について伝えてください。多くのサロンでは低刺激性のシャンプーや薬用シャンプーを用意しており、愛犬の肌に合わせた製品を選んでくれます。かかりつけの獣医師から処方されたシャンプーを持ち込むこともできるサロンもあります。症状がひどい時期は獣医師と相談の上、トリミングの時期を調整することも検討しましょう。",
  },
  {
    question: "トリミングの料金相場はどれくらいですか？",
    answer:
      "料金は犬種・サイズ・メニューによって異なります。一般的な目安として、小型犬（チワワ・ダックスフンドなど）のシャンプーコースが3,000〜5,000円、カットコースが5,000〜8,000円程度です。中型犬はシャンプー5,000〜7,000円、カット7,000〜12,000円、大型犬はシャンプー7,000〜10,000円、カット10,000〜18,000円が目安です。毛玉がひどい場合やオプション（歯磨き・パック・マイクロバブルなど）を追加すると別途料金がかかります。",
  },
  {
    question: "予約なしでも当日トリミングしてもらえますか？",
    answer:
      "ほとんどのトリミングサロンは完全予約制です。当日飛び込みで対応してもらえるケースは少ないため、事前に予約することをおすすめします。特に土日祝日や大型連休前は混み合うため、早めの予約が安心です。サロンによっては電話予約のほか、LINE予約やWeb予約に対応しているところもあります。うちの犬スタイルでサロンを検索して、お近くのサロンに問い合わせてみましょう。",
  },
  {
    question: "トリミングにはどのくらい時間がかかりますか？",
    answer:
      "犬種やメニューによって所要時間は異なります。小型犬のシャンプーコースで約1〜1.5時間、カットコースで約2〜3時間が目安です。中型犬・大型犬はさらに時間がかかり、大型犬のフルコースでは3〜4時間かかることもあります。毛玉の状態や犬の性格（じっとしていられるか）によっても変動します。初回はカウンセリングの時間も含めて、余裕を持ったスケジュールで来店しましょう。",
  },
  {
    question: "シニア犬（老犬）でもトリミングできますか？",
    answer:
      "基本的にシニア犬でもトリミングは可能です。ただし、高齢になると体力の低下や持病を抱えていることが多いため、いくつかの配慮が必要です。長時間の立ち姿勢が辛い子には休憩を挟みながら施術したり、カット範囲を最小限にしたりする工夫をしてくれるサロンもあります。持病がある場合は、事前にかかりつけの獣医師に相談し、トリミングの許可を得てからサロンに伝えましょう。シニア犬対応を得意とするサロンを選ぶのもポイントです。",
  },
  {
    question: "猫のトリミングにも対応しているサロンはありますか？",
    answer:
      "犬専門のサロンが多いですが、猫のトリミングに対応しているサロンも増えています。猫は犬に比べてストレスを感じやすいため、猫の扱いに慣れたトリマーがいるサロンを選ぶことが重要です。長毛種（ペルシャ、メインクーン、ラグドールなど）は定期的なトリミングが必要になることがあります。猫対応のサロンを探す場合は、うちの犬スタイルの検索で「猫OK」のサロンを絞り込んでみてください。",
  },
  {
    question: "持病がある犬のトリミングで注意すべきことは？",
    answer:
      "心臓病、てんかん、椎間板ヘルニア、皮膚疾患など、持病がある犬のトリミングでは事前の情報共有が非常に重要です。まず、かかりつけの獣医師にトリミングを受けてよいか確認しましょう。サロンの予約時には持病の内容、服用中の薬、注意すべき体勢や動作について詳しく伝えてください。動物病院併設のサロンを選ぶと、万が一の際にも安心です。体調が優れない日は無理せず、予約を変更する勇気も大切です。",
  },
  {
    question: "子犬の初めてのトリミングで気をつけることは？",
    answer:
      "子犬の初トリミングは、今後のトリミングに対する印象を大きく左右します。まず、ワクチンプログラムが完了していることが大前提です（通常、生後3〜4ヶ月頃）。初回はフルコースではなく、シャンプーや部分的なカットなど短時間で終わるメニューから始めるのがおすすめです。サロンの音や匂い、他の犬の存在など、子犬にとっては初めての体験ばかりなので、リラックスした雰囲気で「楽しかった」と思ってもらえるようなサロン選びが大切です。",
  },
  {
    question: "トリミング後に愛犬の様子がおかしいのですが大丈夫ですか？",
    answer:
      "トリミング後に一時的に元気がなくなったり、いつもと違う行動を取ったりすることがあります。慣れない環境での長時間の施術で疲れている場合がほとんどで、翌日には元気に戻ることが多いです。ただし、皮膚の赤み、かゆがる、嘔吐、食欲不振が続くなどの症状がある場合は、シャンプー剤によるアレルギー反応やバリカン負けの可能性もあります。その場合は早めに動物病院を受診し、使用した製品について獣医師に伝えてください。サロンにも連絡を入れておくと、次回以降の対応に活かしてもらえます。",
  },
];

/* ------------------------------------------------------------------
   Page Component
   ------------------------------------------------------------------ */
export default function GuidePage() {
  /* ---- JSON-LD ---- */
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "TOP", url: BASE_URL },
    { name: "はじめてのトリミングガイド", url: `${BASE_URL}/guide` },
  ]);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "はじめてのトリミングガイド｜初心者でも安心",
    description:
      "犬のトリミングが初めての飼い主さん向けの完全ガイド。トリミングの基礎知識、開始時期、サロンの選び方、当日の準備、施術の流れ、自宅ケアまで詳しく解説。",
    url: `${BASE_URL}/guide`,
    author: {
      "@type": "Organization",
      name: "うちの犬スタイル",
      url: BASE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "うちの犬スタイル",
      url: BASE_URL,
    },
    datePublished: "2026-03-04",
    dateModified: "2026-03-04",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${BASE_URL}/guide`,
    },
  };

  const faqJsonLd = generateFAQJsonLd(faqData);

  return (
    <>
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      {/* Hero */}
      <section className="bg-gradient-to-br from-green-600 to-emerald-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 text-center">
          <Scissors className="h-14 w-14 mx-auto mb-4 text-white/90" />
          <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4">
            はじめてのトリミングガイド
          </h1>
          <p className="text-green-100 text-lg max-w-2xl mx-auto leading-relaxed">
            犬のトリミングが初めての飼い主さんでも安心。
            <br className="hidden sm:inline" />
            基礎知識からサロンの選び方、当日の準備まで
            <br className="hidden sm:inline" />
            すべてをわかりやすく解説します。
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Breadcrumb
            items={[
              { label: "TOP", href: "/" },
              { label: "はじめてのトリミングガイド", href: "/guide" },
            ]}
          />
        </div>

        <div className="lg:grid lg:grid-cols-[1fr_260px] lg:gap-10">
          {/* Main Content */}
          <div>
            {/* Table of Contents */}
            <nav className="bg-white rounded-2xl shadow-sm p-6 mb-10">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-green-600" />
                目次
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {tocItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-green-50 transition-colors text-sm text-gray-700 hover:text-green-700"
                    >
                      <Icon className="h-4 w-4 text-green-500 shrink-0" />
                      {item.label}
                    </a>
                  );
                })}
              </div>
            </nav>

            {/* Section 1: What is Trimming */}
            <section id="what-is-trimming" className="mb-12 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                  <Scissors className="h-5 w-5 text-green-700" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  トリミングとは？
                </h2>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-4 text-gray-700 text-sm leading-relaxed">
                <p>
                  トリミングとは、犬の被毛をカットして形を整える美容施術のことです。英語の「trim（整える）」が語源で、見た目を美しくするだけでなく、犬の健康管理や快適な生活にも欠かせないケアです。
                </p>
                <p>
                  よく混同される「グルーミング」は、トリミングよりも広い概念です。グルーミングにはシャンプー、ブラッシング、爪切り、耳掃除、歯磨き、肛門腺絞りなど、犬のお手入れ全般が含まれます。つまり、トリミング（カット）はグルーミングの一部と言えます。
                </p>
                <div className="bg-green-50 rounded-xl p-5">
                  <p className="font-semibold text-green-800 mb-2">トリミングとグルーミングの違い</p>
                  <ul className="space-y-1.5 text-green-900">
                    <li className="flex items-start gap-2">
                      <Scissors className="h-4 w-4 shrink-0 mt-0.5 text-green-600" />
                      <span><strong>トリミング</strong>：被毛のカット・スタイリング（形を整える施術）</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Bath className="h-4 w-4 shrink-0 mt-0.5 text-green-600" />
                      <span><strong>グルーミング</strong>：シャンプー・爪切り・耳掃除など、お手入れ全般</span>
                    </li>
                  </ul>
                </div>
                <p>
                  定期的なトリミングには、見た目の美しさだけでなく多くのメリットがあります。皮膚トラブルの早期発見、毛玉による皮膚の蒸れ防止、衛生面の維持、夏場の暑さ対策など、愛犬の健康と快適さに直結します。特にプードルやシーズーなど、毛が伸び続ける犬種はトリミングが必須です。
                </p>
              </div>
            </section>

            {/* Section 2: When to Start */}
            <section id="when-to-start" className="mb-12 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                  <Calendar className="h-5 w-5 text-green-700" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  トリミングはいつから？
                </h2>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-4 text-gray-700 text-sm leading-relaxed">
                <p>
                  子犬のトリミングデビューは、<strong className="text-green-700">生後3〜4ヶ月頃</strong>が一般的な目安です。ただし、最も重要なのはワクチン接種が完了しているかどうかです。トリミングサロンでは他の犬と同じ空間に入ることになるため、感染症予防のためにワクチン接種が必須条件となっています。
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                  <p className="font-semibold text-amber-800 mb-2 flex items-center gap-2">
                    <ShieldCheck className="h-5 w-5" />
                    トリミングデビューの条件
                  </p>
                  <ul className="space-y-2 text-amber-900 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                      <span>混合ワクチンの接種プログラムが完了していること（通常2〜3回接種）</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                      <span>最後のワクチン接種から1〜2週間以上経過していること</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                      <span>狂犬病予防接種を済ませていること（生後91日以上の犬は法律で義務）</span>
                    </li>
                  </ul>
                </div>
                <p>
                  初めてのトリミングは、子犬にとって大きなイベントです。サロンの音や匂い、知らない人に触られる経験は刺激がいっぱいです。最初はフルコースではなく、短時間で終わるシャンプーや部分カットから始めて、サロンの環境に少しずつ慣れさせるのがおすすめです。
                </p>
                <p>
                  また、自宅で体を触られることに慣れさせる「ボディタッチ練習」も効果的です。足先、耳、口まわり、お腹など、トリミングで触れられる部位を日常的に優しく触ってあげましょう。ドライヤーの音にも慣れさせておくと、サロンでの緊張を減らせます。
                </p>
              </div>
            </section>

            {/* Section 3: Frequency */}
            <section id="frequency" className="mb-12 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                  <Clock className="h-5 w-5 text-green-700" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  トリミングの頻度
                </h2>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-4 text-gray-700 text-sm leading-relaxed">
                <p>
                  トリミングの頻度は犬種や被毛のタイプによって異なります。カットが必要な犬種（シングルコート・毛が伸び続けるタイプ）は月1回程度のトリミングが推奨されます。一方、カット不要の犬種（ダブルコートの短毛種など）はシャンプーを中心に1〜2ヶ月に1回程度が目安です。
                </p>
                <div className="overflow-x-auto -mx-2">
                  <table className="w-full text-sm min-w-[500px]">
                    <thead>
                      <tr className="border-b-2 border-green-200 text-left">
                        <th className="py-3 px-3 font-semibold text-gray-800 bg-green-50 rounded-tl-lg">犬種</th>
                        <th className="py-3 px-3 font-semibold text-gray-800 bg-green-50 text-center">推奨頻度</th>
                        <th className="py-3 px-3 font-semibold text-gray-800 bg-green-50 rounded-tr-lg">ポイント</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {frequencyData.map((row) => (
                        <tr key={row.breed} className="hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-3 font-medium text-gray-800 whitespace-nowrap">
                            {row.breed}
                          </td>
                          <td className="py-3 px-3 text-center text-green-700 font-semibold whitespace-nowrap">
                            {row.frequency}
                          </td>
                          <td className="py-3 px-3 text-gray-600">
                            {row.note}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-xs text-gray-500">
                  ※ 上記は一般的な目安です。犬の毛質・生活環境・健康状態によって適切な頻度は異なります。かかりつけのトリマーに相談するのがベストです。
                </p>
              </div>
            </section>

            {/* Section 4: Choose Salon */}
            <section id="choose-salon" className="mb-12 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                  <Search className="h-5 w-5 text-green-700" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  トリミングサロンの選び方
                </h2>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-6 text-gray-700 text-sm leading-relaxed">
                <p>
                  大切な愛犬を任せるサロン選びは慎重に行いたいもの。以下の5つのチェックポイントを参考に、安心して通えるサロンを見つけましょう。
                </p>

                {[
                  {
                    num: 1,
                    title: "店内の清潔感",
                    icon: Sparkles,
                    text: "サロンの第一印象は重要です。店内が清潔に保たれているか、トリミングテーブルや器具が綺麗か、犬の毛が散らかったまま放置されていないかを確認しましょう。臭いにも注目してください。しっかり換気・清掃されているサロンは衛生管理に力を入れている証拠です。可能であれば予約前に見学させてもらうのがおすすめです。",
                  },
                  {
                    num: 2,
                    title: "トリマーの資格・経験",
                    icon: Star,
                    text: "トリマーが公認資格（JKC公認トリマー、SAE認定トリマーなど）を持っているか確認しましょう。資格の有無だけでなく、経験年数やこれまでの実績も大切なポイントです。スタッフ紹介がホームページに掲載されているサロンは信頼度が高い傾向にあります。特定の犬種に強いトリマーがいるかどうかもチェックポイントです。",
                  },
                  {
                    num: 3,
                    title: "丁寧なカウンセリング",
                    icon: MessageCircle,
                    text: "初回のカウンセリングが丁寧かどうかは、サロンの質を見極める重要なポイントです。愛犬の性格や健康状態を細かくヒアリングしてくれるか、仕上がりイメージをしっかり共有できるか、不明点に分かりやすく答えてくれるかを見ましょう。一方的に進めるのではなく、飼い主と一緒に考えてくれるサロンは安心です。",
                  },
                  {
                    num: 4,
                    title: "料金の透明性",
                    icon: Banknote,
                    text: "メニューと料金が明確に表示されているかを確認しましょう。「カット○○円〜」のように曖昧な表記だけでなく、犬種・サイズ別の料金表があると安心です。オプション料金（歯磨き、マイクロバブル、毛玉取りなど）や追加料金の発生条件も事前に把握しておくと、会計時のトラブルを避けられます。",
                  },
                  {
                    num: 5,
                    title: "口コミ・評判",
                    icon: Star,
                    text: "実際に利用した飼い主さんの口コミは、サロン選びの参考になります。仕上がりの満足度だけでなく、スタッフの対応や犬への接し方に関するコメントに注目しましょう。うちの犬スタイルでは、実際のユーザーレビューを確認してサロンを比較できます。ただし、口コミはあくまで参考程度にとどめ、最終的には自分の目で確かめることが大切です。",
                  },
                ].map((point) => {
                  const Icon = point.icon;
                  return (
                    <div key={point.num} className="flex gap-4">
                      <div className="shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white font-bold text-sm">
                        {point.num}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 mb-1 flex items-center gap-2">
                          <Icon className="h-4 w-4 text-green-600" />
                          {point.title}
                        </h3>
                        <p className="text-gray-600">{point.text}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Section 5: Preparation / Checklist */}
            <section id="preparation" className="mb-12 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                  <ListChecks className="h-5 w-5 text-green-700" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  当日の持ち物と準備
                </h2>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-4 text-gray-700 text-sm leading-relaxed">
                <p>
                  トリミング当日に慌てないよう、必要な持ち物を事前にチェックしておきましょう。特にワクチン証明書は忘れると施術を断られる場合があるので注意が必要です。
                </p>
                <div className="space-y-3">
                  {checklistItems.map((item) => (
                    <div
                      key={item.item}
                      className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl"
                    >
                      <div className="shrink-0 mt-0.5">
                        <div className="w-5 h-5 rounded border-2 border-green-500 bg-green-500 flex items-center justify-center">
                          <CheckCircle className="h-3.5 w-3.5 text-white" />
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">{item.item}</p>
                        <p className="text-gray-500 text-xs mt-0.5">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mt-4">
                  <p className="font-semibold text-blue-800 mb-1">当日の注意ポイント</p>
                  <ul className="space-y-1.5 text-blue-900 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
                      <span>来店前に軽く散歩させてトイレを済ませておきましょう</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
                      <span>食事はトリミングの2〜3時間前までに済ませましょう（車酔い防止にも）</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle className="h-4 w-4 shrink-0 mt-0.5 text-blue-500" />
                      <span>時間に余裕を持って到着しましょう（特に初回はカウンセリング時間が必要）</span>
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 6: Flow / Timeline */}
            <section id="flow" className="mb-12 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                  <Footprints className="h-5 w-5 text-green-700" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  トリミングの流れ
                </h2>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 text-gray-700 text-sm leading-relaxed">
                <p className="mb-6">
                  一般的なトリミングサロンでの施術の流れをステップバイステップでご紹介します。サロンによって順番や内容は多少異なりますが、大まかな流れは同じです。
                </p>
                <div className="relative">
                  {/* Vertical timeline line */}
                  <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-green-200" />
                  <div className="space-y-8">
                    {flowSteps.map((step, index) => (
                      <div key={step.step} className="relative flex gap-5">
                        {/* Step number circle */}
                        <div className="relative z-10 shrink-0 flex items-center justify-center w-10 h-10 rounded-full bg-green-600 text-white font-bold text-sm shadow-md">
                          {step.step}
                        </div>
                        <div className={index < flowSteps.length - 1 ? "pb-2" : ""}>
                          <h3 className="font-bold text-gray-900 text-base mb-1">
                            {step.title}
                          </h3>
                          <p className="text-gray-600">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7: Home Care */}
            <section id="home-care" className="mb-12 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                  <Home className="h-5 w-5 text-green-700" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  自宅ケアの基本
                </h2>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-4 text-gray-700 text-sm leading-relaxed">
                <p>
                  トリミングサロンでのプロのケアに加えて、日常的な自宅ケアも愛犬の健康と美しさを保つうえでとても大切です。サロンでのトリミングの間隔を延ばすことにもつながり、愛犬の負担やコストの軽減にもなります。
                </p>
                <div className="grid grid-cols-1 gap-5">
                  {homeCareItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.title} className="border border-gray-100 rounded-xl p-5">
                        <h3 className="font-bold text-gray-900 mb-2 flex items-center gap-2">
                          <Icon className="h-5 w-5 text-green-600" />
                          {item.title}
                        </h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Section 8: FAQ */}
            <section id="faq" className="mb-12 scroll-mt-24">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100">
                  <HelpCircle className="h-5 w-5 text-green-700" />
                </div>
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                  よくある質問（FAQ）
                </h2>
              </div>
              <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 space-y-3">
                {faqData.map((item, index) => (
                  <details
                    key={index}
                    className="group border border-gray-100 rounded-xl overflow-hidden"
                  >
                    <summary className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors list-none [&::-webkit-details-marker]:hidden">
                      <HelpCircle className="h-5 w-5 text-green-600 shrink-0" />
                      <span className="font-semibold text-gray-800 text-sm flex-1">
                        {item.question}
                      </span>
                      <span className="text-green-600 text-xl leading-none shrink-0 transition-transform group-open:rotate-45">
                        +
                      </span>
                    </summary>
                    <div className="px-5 pb-4 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-100">
                      {item.answer}
                    </div>
                  </details>
                ))}
              </div>
            </section>

            {/* CTA bottom (mobile) */}
            <div className="lg:hidden mb-10">
              <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-center text-white">
                <Dog className="h-10 w-10 mx-auto mb-3 text-white/90" />
                <p className="font-bold text-lg mb-2">
                  愛犬にぴったりのサロンを探そう
                </p>
                <p className="text-green-100 text-sm mb-4">
                  お住まいの地域からトリミングサロンを検索できます。
                </p>
                <Link
                  href="/salons"
                  className="inline-flex items-center gap-2 px-8 py-3 bg-white text-green-700 font-semibold rounded-full hover:bg-green-50 transition-colors text-sm"
                >
                  <MapPin className="h-4 w-4" />
                  サロンを探す
                </Link>
              </div>
            </div>
          </div>

          {/* Sidebar (desktop) */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-6">
              {/* CTA Card */}
              <div className="bg-gradient-to-br from-green-600 to-emerald-700 rounded-2xl p-6 text-center text-white">
                <Dog className="h-10 w-10 mx-auto mb-3 text-white/90" />
                <p className="font-bold text-base mb-2">
                  サロンを探す
                </p>
                <p className="text-green-100 text-xs mb-4 leading-relaxed">
                  お住まいの地域からトリミングサロンを検索できます。
                </p>
                <Link
                  href="/salons"
                  className="inline-flex items-center gap-2 px-6 py-2.5 bg-white text-green-700 font-semibold rounded-full hover:bg-green-50 transition-colors text-sm"
                >
                  <MapPin className="h-4 w-4" />
                  サロンを探す
                </Link>
              </div>

              {/* Mini TOC */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="font-bold text-gray-900 text-sm mb-3">この記事の目次</p>
                <nav className="space-y-1.5">
                  {tocItems.map((item) => (
                    <a
                      key={item.id}
                      href={`#${item.id}`}
                      className="block text-xs text-gray-500 hover:text-green-700 transition-colors py-1"
                    >
                      {item.label}
                    </a>
                  ))}
                </nav>
              </div>

              {/* Area Search */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <p className="font-bold text-gray-900 text-sm mb-3">人気エリア</p>
                <div className="flex flex-wrap gap-1.5">
                  {[
                    { name: "東京都", slug: "tokyo" },
                    { name: "大阪府", slug: "osaka" },
                    { name: "神奈川県", slug: "kanagawa" },
                    { name: "愛知県", slug: "aichi" },
                    { name: "埼玉県", slug: "saitama" },
                    { name: "福岡県", slug: "fukuoka" },
                  ].map((area) => (
                    <Link
                      key={area.slug}
                      href={`/area/${area.slug}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-50 text-gray-600 rounded-full text-xs hover:bg-green-50 hover:text-green-700 transition-colors"
                    >
                      <MapPin className="h-3 w-3" />
                      {area.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
