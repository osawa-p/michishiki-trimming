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

export default function AreaPrefectureLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center gap-2 mb-6 animate-pulse">
        <div className="h-4 bg-gray-200 rounded w-12" />
        <div className="h-4 bg-gray-200 rounded w-4" />
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-4 bg-gray-200 rounded w-4" />
        <div className="h-4 bg-gray-200 rounded w-16" />
      </div>

      {/* Title skeleton */}
      <div className="h-8 bg-gray-200 rounded w-64 mb-8 animate-pulse" />

      {/* City navigation skeleton */}
      <div className="bg-white rounded-2xl shadow-sm p-6 mb-8 animate-pulse">
        <div className="h-5 bg-gray-200 rounded w-48 mb-4" />
        <div className="flex flex-wrap gap-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-9 bg-gray-100 rounded-lg w-24" />
          ))}
        </div>
      </div>

      {/* Count skeleton */}
      <div className="h-4 bg-gray-200 rounded w-40 mb-4 animate-pulse" />

      {/* Cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    </div>
  );
}
