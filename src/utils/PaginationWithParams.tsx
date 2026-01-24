"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PaginationWithParamsProps {
  totalPages: number;
}

export function PaginationWithParams({ totalPages }: PaginationWithParamsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentPage = Number(searchParams.get("page") || 1);

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  const goToPage = (page: number) => {
    router.push(createPageURL(page));
  };

  const getPageNumbers = () => {
    const pageNumbers: (number | "...")[] = [];

    if (currentPage > 3) {
      pageNumbers.push(1);
      if (currentPage > 4) pageNumbers.push("...");
    }

    for (let i = Math.max(1, currentPage - 1); i <= Math.min(totalPages, currentPage + 1); i++) {
      pageNumbers.push(i);
    }

    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) pageNumbers.push("...");
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <Button
        variant="default"
        size="icon"
        onClick={() => goToPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Previous page</span>
      </Button>

      {getPageNumbers().map((page, index) =>
        page === "..." ? (
          <Button key={`ellipsis-${index}`} variant="ghost" size="icon" disabled>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        ) : (
          <Button
            key={`page-${page}`}
            size="icon"
            onClick={() => goToPage(page as number)}
            className={`${
              currentPage === page
                ? "bg-linear-to-b from-[#FF9853] to-[#F46200] text-white"
                : "bg-white text-black border"
            }`}
          >
            {page}
          </Button>
        )
      )}

      <Button
        variant="default"
        size="icon"
        onClick={() => goToPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Next page</span>
      </Button>
    </div>
  );
}
