function SkeletonCard() {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse">
      {/* Image placeholder */}
      <div className="w-full h-48 bg-gray-200" />

      {/* Content area */}
      <div className="p-5 space-y-3">
        {/* Title */}
        <div className="h-5 bg-gray-200 rounded w-3/4" />

        {/* Address */}
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0" />
          <div className="h-4 bg-gray-200 rounded w-full" />
        </div>

        {/* Business hours */}
        <div className="flex items-center gap-1.5">
          <div className="w-4 h-4 bg-gray-200 rounded-full shrink-0" />
          <div className="h-4 bg-gray-200 rounded w-2/3" />
        </div>

        {/* Description */}
        <div className="space-y-1.5 pt-1">
          <div className="h-3.5 bg-gray-100 rounded w-full" />
          <div className="h-3.5 bg-gray-100 rounded w-4/5" />
        </div>
      </div>
    </div>
  );
}

export default function SalonsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title skeleton */}
      <div className="mb-8">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
        <div className="flex gap-2 max-w-lg">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg animate-pulse" />
          <div className="w-20 h-10 bg-gray-200 rounded-lg animate-pulse" />
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
