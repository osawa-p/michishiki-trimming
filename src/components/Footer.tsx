import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 mt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="text-white font-bold text-lg flex items-center gap-2 mb-3">
              <span>🐕</span> トリムDB
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
              <li><Link href="/register" className="hover:text-white transition-colors">サロンを登録する</Link></li>
              <li><Link href="/auth/login" className="hover:text-white transition-colors">ログイン</Link></li>
              <li><Link href="/auth/signup" className="hover:text-white transition-colors">新規登録</Link></li>
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
