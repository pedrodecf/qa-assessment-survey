import { BadRequestException } from "@nestjs/common";
import { isFilled } from "../../../shared/helpers/is-filled";
import {
  ALLOWED_FIELD_BY_TYPE,
  type PerguntaInput,
  type RespostaInput,
} from "./types";

export function validateRequiredFields(
  pergunta: PerguntaInput,
  resposta: RespostaInput,
): void {
  if (!pergunta.respostaObrigatoria) {
    return;
  }

  const allowedField = ALLOWED_FIELD_BY_TYPE[pergunta.tipo];
  const hasMainValue = isFilled(resposta[allowedField]);
  const hasValidOther = pergunta.permitirOutro && isFilled(resposta.outroTexto);

  if (!hasMainValue && !hasValidOther) {
    throw new BadRequestException(
      `A pergunta ${pergunta.id} é obrigatória e não foi respondida.`,
    );
  }

  if (pergunta.justificarResposta && !isFilled(resposta.justificativaTexto)) {
    throw new BadRequestException(
      `A pergunta ${pergunta.id} exige justificativa.`,
    );
  }
}
