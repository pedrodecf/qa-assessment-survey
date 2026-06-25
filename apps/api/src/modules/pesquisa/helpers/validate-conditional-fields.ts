import { BadRequestException } from "@nestjs/common";
import { isFilled } from "../../../shared/helpers/is-filled";
import type { PerguntaInput, RespostaInput } from "./types";

export function validateConditionalFields(
  pergunta: PerguntaInput,
  resposta: RespostaInput,
): void {
  if (isFilled(resposta.outroTexto) && !pergunta.permitirOutro) {
    throw new BadRequestException(
      'Esta pergunta não permite preencher o campo "outro".',
    );
  }

  if (isFilled(resposta.justificativaTexto) && !pergunta.justificarResposta) {
    throw new BadRequestException("Esta pergunta não permite justificativa.");
  }
}
