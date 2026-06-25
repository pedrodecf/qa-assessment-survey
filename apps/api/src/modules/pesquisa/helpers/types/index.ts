import { opcao, pergunta, pergunta_tipo, resposta } from "@prisma/client";

export type ResponseField =
  | "opcaoId"
  | "valorOpcaoPadronizada"
  | "valorOpcaoTexto"
  | "valorNumerico";

export type PerguntaInput = Pick<
  pergunta,
  | "id"
  | "tipo"
  | "respostaObrigatoria"
  | "justificarResposta"
  | "permitirOutro"
> & {
  opcoes: Pick<opcao, "id">[];
};

export type RespostaInput = Pick<resposta, "perguntaId"> &
  Partial<
    Pick<
      resposta,
      | "opcaoId"
      | "valorOpcaoPadronizada"
      | "valorOpcaoTexto"
      | "valorNumerico"
      | "outroTexto"
      | "justificativaTexto"
    >
  >;

export const ALLOWED_FIELD_BY_TYPE: Record<pergunta_tipo, ResponseField> = {
  texto_grande: "valorOpcaoTexto",
  multipla_escolha: "opcaoId",
  opcoes_diversas: "opcaoId",
  pontuacao_0_a_5: "valorNumerico",
  pontuacao_0_a_10: "valorNumerico",
  nivel_satisfacao: "valorOpcaoPadronizada",
  qualidade_percebida: "valorOpcaoPadronizada",
};
