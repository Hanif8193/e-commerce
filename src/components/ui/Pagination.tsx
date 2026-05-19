import Link from "next/link";
import { cn } from "@/utils/cn";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  searchParams?: Record<string, string>;
}

function buildUrl(
  baseUrl: string,
  page: number,
  searchParams: Record<string, string>
): string {
  const params = new URLSearchParams({ ...searchParams, page: String(page) });
  return `${baseUrl}?${params.toString()}`;
}

export function Pagination({
  currentPage,
  totalPages,
  baseUrl,
  searchParams = {},
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const paramsWithoutPage = Object.fromEntries(
    Object.entries(searchParams).filter(([k]) => k !== "page")
  );

  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  const pages: (number | "ellipsis")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1);
    if (currentPage > 3) pages.push("ellipsis");
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    if (currentPage < totalPages - 2) pages.push("ellipsis");
    pages.push(totalPages);
  }

  return (
    <nav aria-label="Pagination" className="flex items-center justify-center gap-1">
      <Link
        href={buildUrl(baseUrl, currentPage - 1, paramsWithoutPage)}
        aria-disabled={!hasPrev}
        tabIndex={hasPrev ? 0 : -1}
        className={cn(
          "rounded-md px-3 py-2 text-sm font-medium transition",
          hasPrev
            ? "text-gray-700 hover:bg-gray-100"
            : "pointer-events-none text-gray-300"
        )}
        aria-label="Previous page"
      >
        &laquo;
      </Link>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span key={`ellipsis-${i}`} className="px-3 py-2 text-sm text-gray-400">
            &hellip;
          </span>
        ) : (
          <Link
            key={p}
            href={buildUrl(baseUrl, p, paramsWithoutPage)}
            aria-current={p === currentPage ? "page" : undefined}
            className={cn(
              "rounded-md px-3 py-2 text-sm font-medium transition",
              p === currentPage
                ? "bg-brand-600 text-white"
                : "text-gray-700 hover:bg-gray-100"
            )}
          >
            {p}
          </Link>
        )
      )}

      <Link
        href={buildUrl(baseUrl, currentPage + 1, paramsWithoutPage)}
        aria-disabled={!hasNext}
        tabIndex={hasNext ? 0 : -1}
        className={cn(
          "rounded-md px-3 py-2 text-sm font-medium transition",
          hasNext
            ? "text-gray-700 hover:bg-gray-100"
            : "pointer-events-none text-gray-300"
        )}
        aria-label="Next page"
      >
        &raquo;
      </Link>
    </nav>
  );
}
