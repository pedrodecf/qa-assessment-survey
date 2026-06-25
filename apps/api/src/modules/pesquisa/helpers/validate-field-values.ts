import { BadRequestException } from "@nestjs/common";
import { opcoes_padronizadas } from "@prisma/client";
import { isFilled } from "../../../shared/helpers/is-filled";
import type { PerguntaInput, RespostaInput } from "./types";

const SATISFACTION_LEVEL_VALUES: opcoes_padronizadas[] = [
  opcoes_padronizadas.muito_satisfeito,
  opcoes_padronizadas.satisfeito,
  opcoes_padronizadas.indiferente,
  opcoes_padronizadas.insatisfeito,
  opcoes_padronizadas.muito_insatisfeito,
];

const PERCEIVED_QUALITY_VALUES: opcoes_padronizadas[] = [
  opcoes_padronizadas.excelente,
  opcoes_padronizadas.bom,
  opcoes_padronizadas.regular,
  opcoes_padronizadas.ruim,
  opcoes_padronizadas.pessimo,
];

export function validateFieldValues(
  pergunta: PerguntaInput,
  resposta: RespostaInput,
): void {
  switch (pergunta.tipo) {
    case "pontuacao_0_a_5": {
      if (
        isFilled(resposta.valorNumerico) &&
        (resposta.valorNumerico! < 0 || resposta.valorNumerico! > 5)
      ) {
        throw new BadRequestException("A pontuação deve estar entre 0 e 5.");
      }
      break;
    }
    case "pontuacao_0_a_10": {
      if (
        isFilled(resposta.valorNumerico) &&
        (resposta.valorNumerico! < 0 || resposta.valorNumerico! > 10)
      ) {
        throw new BadRequestException("A pontuação deve estar entre 0 e 10.");
      }
      break;
    }
    case "multipla_escolha":
    case "opcoes_diversas": {
      if (
        isFilled(resposta.opcaoId) &&
        !pergunta.opcoes.some((opcao) => opcao.id === resposta.opcaoId)
      ) {
        throw new BadRequestException(
          `A opção ${resposta.opcaoId} não pertence à pergunta ${pergunta.id}.`,
        );
      }
      break;
    }
    case "nivel_satisfacao": {
      if (
        isFilled(resposta.valorOpcaoPadronizada) &&
        !SATISFACTION_LEVEL_VALUES.includes(resposta.valorOpcaoPadronizada!)
      ) {
        throw new BadRequestException(
          "Valor inválido para nível de satisfação.",
        );
      }
      break;
    }
    case "qualidade_percebida": {
      if (
        isFilled(resposta.valorOpcaoPadronizada) &&
        !PERCEIVED_QUALITY_VALUES.includes(resposta.valorOpcaoPadronizada!)
      ) {
        throw new BadRequestException(
          "Valor inválido para qualidade percebida.",
        );
      }
      break;
    }
    default:
      break;
  }
}
