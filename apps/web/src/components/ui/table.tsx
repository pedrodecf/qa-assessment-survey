import { ReactNode } from "react";
import { useSearchParams } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import {
  Table as TableComponent,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./headless/table";
import { PaginationTable } from "./pagination-table";

export type Column<TData> = {
  id: string;
  header: ReactNode;
  cell: (row: TData, index: number) => ReactNode;
};

type DataTableProps<TData> = {
  columns: Column<TData>[];
  data?: TData[];
  page?: number;
  pages?: number;
  loading: boolean;
};

export default function Table<TData>({
  columns,
  data = [],
  page = 1,
  pages = 1,
  loading,
}: DataTableProps<TData>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const ordination = searchParams.get("ordination") ?? "desc";

  function toggleSort() {
    setSearchParams((params) => {
      params.set("orderBy", "nome");
      params.set("ordination", ordination === "asc" ? "desc" : "asc");
      params.set("page", "1");
      return params;
    });
  }

  return (
    <div className="w-full">
      <div className="flex justify-between py-4">
        <Button
          data-test-id="order-by-name-button"
          variant="ghost"
          size="sm"
          className="gap-1"
          onClick={toggleSort}
        >
          {ordination === "asc" ? "Nome (A → Z)" : "Nome (Z → A)"}
        </Button>
      </div>

      <div className="rounded-lg border border-zinc-200 bg-white">
        <TableComponent>
          <TableHeader className="bg-zinc-50">
            <TableRow className="hover:bg-transparent">
              {columns.map((column, index) => (
                <TableHead
                  key={column.id}
                  data-test-id={`data-table-${index}-header`}
                >
                  {column.header}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.length > 0 &&
              data.map((row, rowIndex) => (
                <TableRow
                  key={rowIndex}
                  data-test-id={`data-table-content-row-${rowIndex}`}
                >
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      {column.cell(row, rowIndex)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            {data.length === 0 && (
              <TableRow className="hover:bg-transparent">
                <TableCell
                  colSpan={columns.length}
                  className={cn("py-10 text-center font-medium text-zinc-500")}
                >
                  {loading ? "Carregando pesquisas…" : "Sem resultados"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </TableComponent>
      </div>

      <div className="mt-4 flex justify-end">
        <PaginationTable page={page} pages={pages} />
      </div>
    </div>
  );
}
