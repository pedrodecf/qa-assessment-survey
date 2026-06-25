import { BadRequestException } from "@nestjs/common";
import { isFilled } from "../../../shared/helpers/is-filled";
import {
  ALLOWED_FIELD_BY_TYPE,
  type PerguntaInput,
  type ResponseField,
  type RespostaInput,
} from "./types";

const ALL_FIELDS: ResponseField[] = [
  "opcaoId",
  "valorOpcaoPadronizada",
  "valorOpcaoTexto",
  "valorNumerico",
];

export function validateAllowedFields(
  pergunta: PerguntaInput,
  resposta: RespostaInput,
): void {
  const allowedField = ALLOWED_FIELD_BY_TYPE[pergunta.tipo];
  const forbiddenFields = ALL_FIELDS.filter((field) => field !== allowedField);

  for (const field of forbiddenFields) {
    if (isFilled(resposta[field])) {
      throw new BadRequestException(
        `O campo "${field}" não é compatível com perguntas do tipo "${pergunta.tipo}".`,
      );
    }
  }
}
