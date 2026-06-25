import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { NavigateFunction, useSearchParams } from "react-router-dom";
import { env } from "@/config/env";
import { pesquisaGateway } from "../../infra/gateways";
import {
  pesquisaFiltersSchema,
  PesquisaFiltersInputSchema,
  PesquisaFiltersOutputSchema,
} from "../../schema/pesquisa-filters.schema";
import type {
  PesquisaFilters,
  PesquisaStatus,
} from "../../types/dtos/pesquisa.dto";
import type { Order, OrderBy } from "../../types/others";
import { PesquisaListView } from "../views/pesquisa-list.view";

type TPesquisaListService = {
  navigate: NavigateFunction;
};

export function PesquisaListService({ navigate }: TPesquisaListService) {
  const [searchParams] = useSearchParams();

  const queries = useMemo<PesquisaFilters>(() => {
    const pageParam = Number(searchParams.get("page"));
    const page = Number.isInteger(pageParam) && pageParam > 0 ? pageParam : 1;

    const ordination: Order =
      searchParams.get("ordination") === "asc" ? "asc" : "desc";

    const orderBy: OrderBy =
      searchParams.get("orderBy") === "dataLancamento"
        ? "dataLancamento"
        : "nome";

    const statusParam = searchParams.get("status");
    const status: PesquisaStatus | null =
      statusParam === "ativo" || statusParam === "inativo" ? statusParam : null;

    return { page, ordination, orderBy, status, empresaId: env.empresaId };
  }, [searchParams]);

  const formFilters = useForm<
    PesquisaFiltersInputSchema,
    unknown,
    PesquisaFiltersOutputSchema
  >({
    resolver: zodResolver(pesquisaFiltersSchema),
    values: { status: queries.status },
  });

  const {
    data: pesquisas,
    isLoading,
    isError,
  } = useQuery(
    ["pesquisas", queries],
    async () => pesquisaGateway.listPesquisas(queries),
    {
      keepPreviousData: true,
      staleTime: 1000 * 60,
      retry: 2,
      refetchOnWindowFocus: false,
    },
  );

  return (
    <PesquisaListView
      pesquisas={pesquisas}
      loading={isLoading}
      isError={isError}
      navigate={navigate}
      page={queries.page}
      formFilters={formFilters}
    />
  );
}
