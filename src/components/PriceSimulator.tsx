'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import {
  Dog,
  Calculator,
  Scissors,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Sparkles,
  Search,
} from 'lucide-react';
import {
  priceData,
  sizeCategoryDescriptions,
  type PriceEntry,
  type ServiceEntry,
} from '@/lib/data/price-data';

const STEPS = ['犬種を選ぶ', 'サイズを選ぶ', 'メニューを選ぶ'] as const;

export default function PriceSimulator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedBreed, setSelectedBreed] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  // 選択した犬種のデータ
  const breedData: PriceEntry | undefined = useMemo(
    () => priceData.find((e) => e.breed === selectedBreed),
    [selectedBreed]
  );

  // サイズでフィルタした犬種リスト
  const filteredBreeds = useMemo(() => {
    if (!selectedSize) return priceData;
    return priceData.filter((e) => e.sizeCategory === selectedSize);
  }, [selectedSize]);

  // 合計金額計算
  const totalPrice = useMemo(() => {
    if (!breedData || selectedServices.length === 0) return null;
    let minTotal = 0;
    let maxTotal = 0;
    for (const slug of selectedServices) {
      const svc = breedData.services.find((s) => s.slug === slug);
      if (svc) {
        minTotal += svc.minPrice;
        maxTotal += svc.maxPrice;
      }
    }
    return { min: minTotal, max: maxTotal };
  }, [breedData, selectedServices]);

  // サービス一覧（基本 / オプション に分割）
  const basicServices: ServiceEntry[] = breedData?.services.filter((s) => !s.isOption) ?? [];
  const optionServices: ServiceEntry[] = breedData?.services.filter((s) => s.isOption) ?? [];

  const toggleService = (slug: string) => {
    setSelectedServices((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug]
    );
  };

  const handleBreedSelect = (breed: string) => {
    setSelectedBreed(breed);
    // サイズ自動設定
    const entry = priceData.find((e) => e.breed === breed);
    if (entry) {
      setSelectedSize(entry.sizeCategory);
    }
    setCurrentStep(1);
  };

  const handleSizeConfirm = () => {
    setCurrentStep(2);
  };

  const handleShowResult = () => {
    setShowResult(true);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedBreed('');
    setSelectedSize('');
    setSelectedServices([]);
    setShowResult(false);
  };

  const goBack = () => {
    if (showResult) {
      setShowResult(false);
      return;
    }
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const formatPrice = (price: number) => {
    return price.toLocaleString('ja-JP');
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* 進捗バー */}
      {!showResult && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            {STEPS.map((label, i) => (
              <div key={label} className="flex items-center gap-1 flex-1">
                <div
                  className={`
                    flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold shrink-0
                    transition-all duration-300
                    ${
                      i < currentStep
                        ? 'bg-emerald-600 text-white'
                        : i === currentStep
                          ? 'bg-emerald-600 text-white ring-4 ring-emerald-100'
                          : 'bg-gray-200 text-gray-400'
                    }
                  `}
                >
                  {i < currentStep ? (
                    <CheckCircle2 className="w-5 h-5" />
                  ) : (
                    i + 1
                  )}
                </div>
                <span
                  className={`text-xs font-medium hidden sm:inline ${
                    i <= currentStep ? 'text-gray-700' : 'text-gray-400'
                  }`}
                >
                  {label}
                </span>
                {i < STEPS.length - 1 && (
                  <div
                    className={`flex-1 h-0.5 mx-2 rounded transition-colors duration-300 ${
                      i < currentStep ? 'bg-emerald-500' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: 犬種選択 */}
      {currentStep === 0 && !showResult && (
        <div className="transition-opacity duration-300">
          <div className="flex items-center gap-2 mb-4">
            <Dog className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-900">犬種を選んでください</h3>
          </div>

          {/* サイズフィルタ */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setSelectedSize('')}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                selectedSize === ''
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              すべて
            </button>
            {(['小型犬', '中型犬', '大型犬'] as const).map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(selectedSize === size ? '' : size)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  selectedSize === size
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* 人気犬種 */}
          {!selectedSize && (
            <div className="mb-4">
              <p className="text-xs font-semibold text-emerald-600 mb-2 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                人気の犬種
              </p>
              <div className="flex flex-wrap gap-2">
                {priceData
                  .filter((e) => e.popular)
                  .map((entry) => (
                    <button
                      key={entry.breed}
                      onClick={() => handleBreedSelect(entry.breed)}
                      className={`
                        px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all
                        ${
                          selectedBreed === entry.breed
                            ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                            : 'border-emerald-200 bg-white text-gray-700 hover:border-emerald-400 hover:bg-emerald-50'
                        }
                      `}
                    >
                      {entry.breed}
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* 全犬種リスト */}
          <div>
            {selectedSize && (
              <p className="text-xs font-semibold text-gray-500 mb-2">
                {selectedSize}（{sizeCategoryDescriptions[selectedSize]}）
              </p>
            )}
            {!selectedSize && (
              <p className="text-xs font-semibold text-gray-500 mb-2 mt-4">すべての犬種</p>
            )}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredBreeds.map((entry) => (
                <button
                  key={entry.breed}
                  onClick={() => handleBreedSelect(entry.breed)}
                  className={`
                    px-4 py-3 rounded-xl text-sm font-medium border-2 transition-all text-left
                    ${
                      selectedBreed === entry.breed
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-400 hover:bg-emerald-50'
                    }
                  `}
                >
                  <span className="block">{entry.breed}</span>
                  <span className="text-xs text-gray-400">{entry.sizeCategory}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: サイズ確認 */}
      {currentStep === 1 && !showResult && (
        <div className="transition-opacity duration-300">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-900">サイズを確認してください</h3>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            選択した犬種: <span className="font-semibold text-gray-800">{selectedBreed}</span>
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
            {(['小型犬', '中型犬', '大型犬'] as const).map((size) => {
              const isAutoSelected = breedData?.sizeCategory === size;
              return (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`
                    relative px-4 py-5 rounded-xl border-2 transition-all text-center
                    ${
                      selectedSize === size
                        ? 'border-emerald-600 bg-emerald-50 text-emerald-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-emerald-400'
                    }
                  `}
                >
                  {isAutoSelected && (
                    <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs px-2 py-0.5 rounded-full">
                      おすすめ
                    </span>
                  )}
                  <span className="block text-lg font-bold">{size}</span>
                  <span className="text-xs text-gray-400">
                    {sizeCategoryDescriptions[size]}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex gap-3">
            <button
              onClick={goBack}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              戻る
            </button>
            <button
              onClick={handleSizeConfirm}
              disabled={!selectedSize}
              className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              次へ
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: メニュー選択 */}
      {currentStep === 2 && !showResult && (
        <div className="transition-opacity duration-300">
          <div className="flex items-center gap-2 mb-4">
            <Scissors className="w-6 h-6 text-emerald-600" />
            <h3 className="text-lg font-bold text-gray-900">メニューを選んでください</h3>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            <span className="font-semibold text-gray-800">{selectedBreed}</span>（{selectedSize}）のメニュー
            <br />
            <span className="text-xs">複数選択できます</span>
          </p>

          {/* 基本メニュー */}
          <div className="mb-5">
            <p className="text-xs font-semibold text-emerald-600 mb-2">基本コース</p>
            <div className="space-y-2">
              {basicServices.map((svc) => (
                <label
                  key={svc.slug}
                  className={`
                    flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all
                    ${
                      selectedServices.includes(svc.slug)
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:border-emerald-300'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(svc.slug)}
                    onChange={() => toggleService(svc.slug)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      selectedServices.includes(svc.slug)
                        ? 'bg-emerald-600 border-emerald-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedServices.includes(svc.slug) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-semibold text-gray-800">{svc.name}</span>
                  </div>
                  <span className="text-sm text-gray-500 shrink-0">
                    {formatPrice(svc.minPrice)}〜{formatPrice(svc.maxPrice)}円
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* オプションメニュー */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-gray-500 mb-2">オプション</p>
            <div className="space-y-2">
              {optionServices.map((svc) => (
                <label
                  key={svc.slug}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl border-2 cursor-pointer transition-all
                    ${
                      selectedServices.includes(svc.slug)
                        ? 'border-emerald-600 bg-emerald-50'
                        : 'border-gray-200 bg-white hover:border-emerald-300'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={selectedServices.includes(svc.slug)}
                    onChange={() => toggleService(svc.slug)}
                    className="sr-only"
                  />
                  <div
                    className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${
                      selectedServices.includes(svc.slug)
                        ? 'bg-emerald-600 border-emerald-600'
                        : 'border-gray-300'
                    }`}
                  >
                    {selectedServices.includes(svc.slug) && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-gray-700">{svc.name}</span>
                  </div>
                  <span className="text-xs text-gray-400 shrink-0">
                    +{formatPrice(svc.minPrice)}〜{formatPrice(svc.maxPrice)}円
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={goBack}
              className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              戻る
            </button>
            <button
              onClick={handleShowResult}
              disabled={selectedServices.length === 0}
              className="flex-1 flex items-center justify-center gap-1 px-4 py-2.5 rounded-xl bg-emerald-600 text-white text-sm font-bold hover:bg-emerald-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Calculator className="w-4 h-4" />
              料金を計算する
            </button>
          </div>
        </div>
      )}

      {/* 結果表示 */}
      {showResult && totalPrice && (
        <div className="transition-opacity duration-300">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 sm:p-8 text-white mb-6">
            <div className="text-center mb-6">
              <p className="text-emerald-100 text-sm mb-1">
                {selectedBreed}（{selectedSize}）の料金目安
              </p>
              <div className="flex items-baseline justify-center gap-1 mt-3">
                <span className="text-3xl sm:text-5xl font-bold">
                  {formatPrice(totalPrice.min)}
                </span>
                <span className="text-xl sm:text-2xl font-medium mx-1">〜</span>
                <span className="text-3xl sm:text-5xl font-bold">
                  {formatPrice(totalPrice.max)}
                </span>
                <span className="text-lg sm:text-xl ml-1">円</span>
              </div>
            </div>

            {/* 選択内訳 */}
            <div className="bg-white/10 rounded-xl p-4">
              <p className="text-emerald-100 text-xs font-semibold mb-2">選択したメニュー</p>
              <div className="space-y-1.5">
                {selectedServices.map((slug) => {
                  const svc = breedData?.services.find((s) => s.slug === slug);
                  if (!svc) return null;
                  return (
                    <div key={slug} className="flex justify-between text-sm">
                      <span className="text-white/90">
                        {svc.isOption && '+ '}
                        {svc.name}
                      </span>
                      <span className="text-emerald-100">
                        {formatPrice(svc.minPrice)}〜{formatPrice(svc.maxPrice)}円
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* アドバイスコメント */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-sm text-amber-800 leading-relaxed">
              {totalPrice.max <= 6000 && (
                <>
                  この料金帯は全国平均と比べてリーズナブルな価格帯です。
                  サロンによってはセット割引が適用される場合もあります。
                </>
              )}
              {totalPrice.max > 6000 && totalPrice.max <= 12000 && (
                <>
                  この料金帯は全国的に標準的な価格帯です。
                  サロンごとの技術力やサービス内容を比較して選びましょう。
                </>
              )}
              {totalPrice.max > 12000 && (
                <>
                  大型犬やフルコースの場合、料金は高めになります。
                  サロンによって大きく異なるため、複数のサロンで見積もりを取ることをおすすめします。
                </>
              )}
            </p>
          </div>

          {/* アクションボタン */}
          <div className="space-y-3">
            <Link
              href="/salons"
              className="flex items-center justify-center gap-2 w-full px-6 py-3.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors"
            >
              <Search className="w-5 h-5" />
              近くのサロンを探す
            </Link>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 w-full px-6 py-3 border border-gray-200 text-gray-600 font-medium rounded-xl hover:bg-gray-50 transition-colors text-sm"
            >
              もう一度シミュレーションする
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
