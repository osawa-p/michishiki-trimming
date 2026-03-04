import Link from "next/link";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
};

function buildUrl(
  baseUrl: string,
  page: number,
  searchParams?: Record<string, string>
): string {
  const params = new URLSearchParams(searchParams ?? {});
  if (page > 1) {
    params.set("page", String(page));
  } else {
    params.delete("page");
  }
  const qs = params.toString();
  return `${baseUrl}${qs ? `?${qs}` : ""}`;
}

/**
 * Calculate which page numbers to display.
 * Shows: 1, ..., (currentPage-1), currentPage, (currentPage+1), ..., totalPages
 */
function getPageNumbers(current: number, total: number): (number | "...")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages: (number | "...")[] = [];

  // Always show first page
  pages.push(1);

  if (current > 3) {
    pages.push("...");
  }

  // Pages around current
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);

  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  if (current < total - 2) {
    pages.push("...");
  }

  // Always show last page
  pages.push(total);

  return pages;
}

export default function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams,
}: Props) {
  if (totalPages <= 1) return null;

  const pages = getPageNumbers(currentPage, totalPages);

  const linkBase =
    "inline-flex items-center justify-center min-w-[40px] h-10 px-3 text-sm font-medium rounded-lg transition-colors";
  const activeClass = "bg-green-600 text-white";
  const inactiveClass =
    "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50";
  const disabledClass =
    "inline-flex items-center justify-center min-w-[40px] h-10 px-3 text-sm text-gray-300 cursor-not-allowed";

  return (
    <nav
      className="flex justify-center items-center gap-1.5 mt-10"
      aria-label="ページネーション"
    >
      {/* First page */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(baseUrl, 1, searchParams)}
          className={linkBase + " " + inactiveClass}
          aria-label="最初のページ"
        >
          <ChevronsLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span className={disabledClass} aria-hidden="true">
          <ChevronsLeft className="w-4 h-4" />
        </span>
      )}

      {/* Previous page */}
      {currentPage > 1 ? (
        <Link
          href={buildUrl(baseUrl, currentPage - 1, searchParams)}
          className={linkBase + " " + inactiveClass}
          aria-label="前のページ"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      ) : (
        <span className={disabledClass} aria-hidden="true">
          <ChevronLeft className="w-4 h-4" />
        </span>
      )}

      {/* Page numbers */}
      {pages.map((page, index) => {
        if (page === "...") {
          return (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex items-center justify-center min-w-[40px] h-10 text-sm text-gray-400"
            >
              ...
            </span>
          );
        }

        const isCurrent = page === currentPage;
        return (
          <Link
            key={page}
            href={buildUrl(baseUrl, page, searchParams)}
            className={`${linkBase} ${isCurrent ? activeClass : inactiveClass}`}
            aria-current={isCurrent ? "page" : undefined}
            aria-label={`${page}ページ目`}
          >
            {page}
          </Link>
        );
      })}

      {/* Next page */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(baseUrl, currentPage + 1, searchParams)}
          className={linkBase + " " + inactiveClass}
          aria-label="次のページ"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className={disabledClass} aria-hidden="true">
          <ChevronRight className="w-4 h-4" />
        </span>
      )}

      {/* Last page */}
      {currentPage < totalPages ? (
        <Link
          href={buildUrl(baseUrl, totalPages, searchParams)}
          className={linkBase + " " + inactiveClass}
          aria-label="最後のページ"
        >
          <ChevronsRight className="w-4 h-4" />
        </Link>
      ) : (
        <span className={disabledClass} aria-hidden="true">
          <ChevronsRight className="w-4 h-4" />
        </span>
      )}
    </nav>
  );
}
