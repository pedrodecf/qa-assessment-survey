import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Resolver, useForm } from "react-hook-form";
import { NavigateFunction } from "react-router-dom";
import { env } from "@/config/env";
import queryClient from "@/lib/query-client";
import { pesquisaGateway } from "../../infra/gateways";
import {
  pesquisaCreateSchema,
  PesquisaCreateInputSchema,
  PesquisaCreateOutputSchema,
} from "../../schema/pesquisa-create.schema";
import { TIPOS_COM_OPCOES } from "../../types/others";
import { PesquisaCreateView } from "../views/pesquisa-create.view";

type TPesquisaCreateService = {
  navigate: NavigateFunction;
};

export function PesquisaCreateService({ navigate }: TPesquisaCreateService) {
  const formMethods = useForm<
    PesquisaCreateInputSchema,
    unknown,
    PesquisaCreateOutputSchema
  >({
    mode: "onChange",
    resolver: zodResolver(pesquisaCreateSchema) as Resolver<
      PesquisaCreateInputSchema,
      unknown,
      PesquisaCreateOutputSchema
    >,
    defaultValues: {
      nome: "",
      descricao: "",
      dataLancamento: undefined,
      dataEncerramento: null,
      perguntas: [
        {
          nome: "",
          tipo: undefined,
          respostaObrigatoria: false,
          justificarResposta: false,
          permitirOutro: false,
          opcoes: [],
        },
      ],
    },
  });

  const { mutateAsync, isLoading, isError } = useMutation({
    mutationFn: (data: PesquisaCreateOutputSchema) =>
      pesquisaGateway.createPesquisa({
        empresaId: env.empresaId,
        nome: data.nome,
        descricao: data.descricao,
        dataLancamento: data.dataLancamento.toISOString(),
        dataEncerramento: data.dataEncerramento
          ? data.dataEncerramento.toISOString()
          : null,
        perguntas: data.perguntas.map((pergunta) => {
          const exigeOpcoes = TIPOS_COM_OPCOES.includes(pergunta.tipo);
          return {
            nome: pergunta.nome,
            tipo: pergunta.tipo,
            respostaObrigatoria: pergunta.respostaObrigatoria,
            justificarResposta: pergunta.justificarResposta,
            permitirOutro: exigeOpcoes ? pergunta.permitirOutro : false,
            opcoes: exigeOpcoes ? pergunta.opcoes.map((opcao) => opcao.texto) : [],
          };
        }),
      }),

    onSuccess: () => {
      queryClient.invalidateQueries(["pesquisas"]);
      navigate("/pesquisas");
    },
  });

  const onSubmit = (data: PesquisaCreateOutputSchema) => mutateAsync(data);

  return (
    <PesquisaCreateView
      formMethods={formMethods}
      navigate={navigate}
      loading={isLoading}
      isSubmitError={isError}
      onSubmit={onSubmit}
    />
  );
}
