import Link from "next/link";
import { Dog } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-white font-bold text-lg flex items-center gap-2 mb-3">
              <Dog className="h-5 w-5" /> うちの犬スタイル
            </p>
            <p className="text-sm leading-relaxed">
              犬のトリミングサロンを<br />
              探せるDBプラットフォームです。
            </p>
            <p className="text-xs mt-4">by <Link href="/" className="hover:text-white transition-colors">株式会社ミチビキ</Link></p>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">メニュー</p>
            <ul className="space-y-2 text-sm">
              <li><Link href="/salons" className="hover:text-white transition-colors">サロンを探す</Link></li>
              <li><Link href="/breeds" className="hover:text-white transition-colors">犬種別ガイド</Link></li>
              <li><Link href="/guide" className="hover:text-white transition-colors">はじめてのトリミング</Link></li>
              <li><Link href="/price-simulator" className="hover:text-white transition-colors">料金シミュレーター</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">サロンを登録する</Link></li>
            </ul>
          </div>
          <div>
            <p className="text-white font-semibold mb-3">運営会社</p>
            <p className="text-sm leading-relaxed">株式会社ミチビキ</p>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-xs">
          <p>&copy; {new Date().getFullYear()} 株式会社ミチビキ. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
