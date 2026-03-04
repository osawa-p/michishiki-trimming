import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-noto-sans-jp",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://trimming.michi-biki.jp'),
  title: {
    default: "うちの犬スタイル | 犬のトリミングサロン検索",
    template: "%s | うちの犬スタイル",
  },
  description: "犬のトリミングサロンを地域・犬種・サービスで検索できるプラットフォーム。レビューや料金を比較して、愛犬に最適なサロンを見つけよう。",
  openGraph: {
    siteName: 'うちの犬スタイル',
    locale: 'ja_JP',
    type: 'website',
  },
  twitter: {
    card: 'summary',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className={`${notoSansJP.variable} font-sans antialiased bg-gray-50 text-gray-800`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "うちの犬スタイル",
              "url": "https://trimming.michi-biki.jp",
              "description": "犬のトリミングサロンを地域・犬種で検索",
              "potentialAction": {
                "@type": "SearchAction",
                "target": {
                  "@type": "EntryPoint",
                  "urlTemplate": "https://trimming.michi-biki.jp/salons?q={search_term_string}"
                },
                "query-input": "required name=search_term_string"
              }
            }),
          }}
        />
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
