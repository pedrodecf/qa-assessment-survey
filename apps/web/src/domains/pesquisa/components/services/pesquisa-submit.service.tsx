import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { NavigateFunction } from "react-router-dom";
import { pesquisaGateway } from "../../infra/gateways";
import { PesquisaSubmitInputSchema } from "../../schema/pesquisa-submit.schema";
import type {
  PublicPesquisaDTO,
  SubmitPesquisaDTO,
  SubmitRespostaDTO,
} from "../../types/dtos/pesquisa.dto";
import { OUTRO_VALUE, type OpcaoPadronizada } from "../../types/others";
import { PesquisaSubmitView } from "../views/pesquisa-submit.view";

type TPesquisaSubmitService = {
  idPublico: string;
  navigate: NavigateFunction;
};

export function PesquisaSubmitService({
  idPublico,
  navigate,
}: TPesquisaSubmitService) {
  const [iniciadoEm] = useState(() => new Date().toISOString());
  const [missingIds, setMissingIds] = useState<number[]>([]);
  const [submitted, setSubmitted] = useState(false);

  const {
    data: pesquisa,
    isLoading,
    isError,
  } = useQuery(
    ["public-pesquisa", idPublico],
    () => pesquisaGateway.getPublicPesquisa(idPublico),
    { retry: 1, refetchOnWindowFocus: false },
  );

  const values = useMemo<PesquisaSubmitInputSchema>(
    () => ({
      answers: (pesquisa?.perguntas ?? []).map((pergunta) => ({
        perguntaId: pergunta.id,
        valor: "",
        valores: [],
        outroTexto: "",
        justificativaTexto: "",
      })),
    }),
    [pesquisa],
  );

  const formMethods = useForm<PesquisaSubmitInputSchema>({ values });

  const {
    mutateAsync,
    isLoading: submitting,
    isError: submitError,
  } = useMutation({
    mutationFn: (data: SubmitPesquisaDTO) =>
      pesquisaGateway.submitPesquisa(idPublico, data),
    onSuccess: () => setSubmitted(true),
  });

  const onSubmit = async (data: PesquisaSubmitInputSchema) => {
    if (!pesquisa) return;

    const { respostas, missing } = buildRespostas(pesquisa, data);
    setMissingIds(missing);

    if (missing.length > 0 || respostas.length === 0) return;

    await mutateAsync({
      iniciadoEm,
      finalizadoEm: new Date().toISOString(),
      respostas,
    });
  };

  return (
    <PesquisaSubmitView
      pesquisa={pesquisa}
      loading={isLoading}
      isError={isError}
      submitting={submitting}
      submitError={submitError}
      submitted={submitted}
      missingIds={missingIds}
      formMethods={formMethods}
      navigate={navigate}
      onSubmit={onSubmit}
    />
  );
}

function buildRespostas(
  pesquisa: PublicPesquisaDTO,
  data: PesquisaSubmitInputSchema,
): { respostas: SubmitRespostaDTO[]; missing: number[] } {
  const respostas: SubmitRespostaDTO[] = [];
  const missing: number[] = [];

  pesquisa.perguntas.forEach((pergunta, index) => {
    const answer = data.answers?.[index];
    const valor = (answer?.valor ?? "").trim();
    const valores = answer?.valores ?? [];
    const outroTexto = (answer?.outroTexto ?? "").trim();
    const justificativaTexto = (answer?.justificativaTexto ?? "").trim();

    const perguntaRespostas: SubmitRespostaDTO[] = [];

    switch (pergunta.tipo) {
      case "texto_grande":
        if (valor) {
          perguntaRespostas.push({
            perguntaId: pergunta.id,
            valorOpcaoTexto: valor,
          });
        }
        break;
      case "multipla_escolha":
        if (valor === OUTRO_VALUE) {
          if (outroTexto) {
            perguntaRespostas.push({ perguntaId: pergunta.id, outroTexto });
          }
        } else if (valor) {
          perguntaRespostas.push({
            perguntaId: pergunta.id,
            opcaoId: Number(valor),
          });
        }
        break;
      case "opcoes_diversas":
        valores
          .filter((value) => value !== OUTRO_VALUE)
          .forEach((value) =>
            perguntaRespostas.push({
              perguntaId: pergunta.id,
              opcaoId: Number(value),
            }),
          );
        if (valores.includes(OUTRO_VALUE) && outroTexto) {
          perguntaRespostas.push({ perguntaId: pergunta.id, outroTexto });
        }
        break;
      case "pontuacao_0_a_5":
      case "pontuacao_0_a_10":
        if (valor) {
          perguntaRespostas.push({
            perguntaId: pergunta.id,
            valorNumerico: Number(valor),
          });
        }
        break;
      case "nivel_satisfacao":
      case "qualidade_percebida":
        if (valor) {
          perguntaRespostas.push({
            perguntaId: pergunta.id,
            valorOpcaoPadronizada: valor as OpcaoPadronizada,
          });
        }
        break;
    }

    const hasMainAnswer = perguntaRespostas.length > 0;

    if (pergunta.justificarResposta && justificativaTexto) {
      if (hasMainAnswer) {
        perguntaRespostas[0].justificativaTexto = justificativaTexto;
      } else if (!pergunta.respostaObrigatoria) {
        perguntaRespostas.push({
          perguntaId: pergunta.id,
          justificativaTexto,
        });
      }
    }

    if (pergunta.respostaObrigatoria) {
      const hasJustificativa =
        !pergunta.justificarResposta || justificativaTexto.length > 0;
      if (!hasMainAnswer || !hasJustificativa) {
        missing.push(pergunta.id);
      }
    }

    respostas.push(...perguntaRespostas);
  });

  return { respostas, missing };
}
