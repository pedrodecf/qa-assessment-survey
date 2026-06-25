import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "./button";

type PaginationTableProps = {
  page: number;
  pages: number;
};

export function PaginationTable({ page, pages }: PaginationTableProps) {
  const [, setSearchParams] = useSearchParams();

  const totalPages = Math.max(pages, 1);
  const current = Math.min(Math.max(page, 1), totalPages);

  function goToPage(nextPage: number) {
    setSearchParams((params) => {
      params.set("page", String(nextPage));
      return params;
    });
  }

  return (
    <div className={cn("flex items-center gap-3")}>
      <span className="text-sm text-zinc-500">
        Página {current} de {totalPages}
      </span>
      <Button
        data-test-id="pagination-previous-button"
        variant="outline"
        size="sm"
        disabled={current <= 1}
        onClick={() => goToPage(current - 1)}
      >
        Anterior
      </Button>
      <Button
        data-test-id="pagination-next-button"
        variant="outline"
        size="sm"
        disabled={current >= totalPages}
        onClick={() => goToPage(current + 1)}
      >
        Próxima
      </Button>
    </div>
  );
}
