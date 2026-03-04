"use client";

import Link from "next/link";
import { useState } from "react";
import { Dog, Search, UserPlus, LogIn, Menu, X } from "lucide-react";

const navLinks = [
  { href: "/salons", label: "サロンを探す" },
  { href: "/breeds", label: "犬種ガイド" },
  { href: "/guide", label: "はじめてガイド" },
  { href: "/register", label: "サロンを登録" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Dog className="h-6 w-6 text-green-600" />
            <span className="font-bold text-gray-900 text-lg">うちの犬スタイル</span>
            <span className="text-xs text-gray-400 font-normal hidden sm:inline">by ミチビキ</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/auth/login"
              className="text-sm font-medium text-gray-600 hover:text-green-600 transition-colors"
            >
              ログイン
            </Link>
            <Link
              href="/auth/signup"
              className="px-5 py-2 bg-green-600 text-white text-sm font-medium rounded-full hover:bg-green-700 transition-colors"
            >
              新規登録
            </Link>
          </nav>

          <button
            className="md:hidden p-2 rounded-md text-gray-600"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="メニュー"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {isOpen && (
          <nav className="md:hidden py-4 border-t border-gray-100 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block py-2 text-sm font-medium text-gray-600 hover:text-green-600"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/auth/login"
              className="block py-2 text-sm font-medium text-gray-600 hover:text-green-600"
              onClick={() => setIsOpen(false)}
            >
              ログイン
            </Link>
            <Link
              href="/auth/signup"
              className="block py-2 text-sm font-medium text-green-600"
              onClick={() => setIsOpen(false)}
            >
              新規登録
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}
