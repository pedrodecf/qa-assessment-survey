import { createZodDto } from "nestjs-zod";
import { submitPesquisaPublicaSchema } from "../schemas/submit-pesquisa-publica.schema";

export class SubmitPesquisaPublicaDto extends createZodDto(
  submitPesquisaPublicaSchema,
) {}
