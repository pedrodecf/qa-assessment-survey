import { BadRequestException } from "@nestjs/common";
import { isFilled } from "../../../shared/helpers/is-filled";
import type { PerguntaInput, RespostaInput } from "./types";

export function validateAnswersDuplicates(
  perguntasMap: Map<number, PerguntaInput>,
  respostas: RespostaInput[],
): void {
  const seenPerguntaIds = new Set<number>();
  const optionsByPerguntaId = new Map<number, Set<number>>();
  const outroByPerguntaId = new Set<number>();

  for (const resposta of respostas) {
    const pergunta = perguntasMap.get(resposta.perguntaId);

    if (!pergunta) {
      throw new BadRequestException(
        `A pergunta ${resposta.perguntaId} não pertence a esta pesquisa.`,
      );
    }

    if (pergunta.tipo === "opcoes_diversas") {
      if (isFilled(resposta.opcaoId)) {
        const opcoes =
          optionsByPerguntaId.get(pergunta.id) ?? new Set<number>();
        if (opcoes.has(resposta.opcaoId!)) {
          throw new BadRequestException(
            `A opção ${resposta.opcaoId} foi enviada mais de uma vez para a pergunta ${pergunta.id}.`,
          );
        }
        opcoes.add(resposta.opcaoId!);
        optionsByPerguntaId.set(pergunta.id, opcoes);
      } else if (isFilled(resposta.outroTexto)) {
        if (outroByPerguntaId.has(pergunta.id)) {
          throw new BadRequestException(
            `A opção "outro" foi enviada mais de uma vez para a pergunta ${pergunta.id}.`,
          );
        }
        outroByPerguntaId.add(pergunta.id);
      }
      continue;
    }

    if (seenPerguntaIds.has(pergunta.id)) {
      throw new BadRequestException(
        `A pergunta ${pergunta.id} foi respondida mais de uma vez.`,
      );
    }
    seenPerguntaIds.add(pergunta.id);
  }
}
