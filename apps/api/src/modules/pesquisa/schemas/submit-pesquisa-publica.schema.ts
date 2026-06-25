import { opcoes_padronizadas } from "@prisma/client";
import { z } from "zod";

export const submitPesquisaPublicaSchema = z.object({
  iniciadoEm: z
    .string()
    .datetime()
    .transform((value) => new Date(value)),
  finalizadoEm: z
    .string()
    .datetime()
    .transform((value) => new Date(value)),
  respostas: z.array(
    z.object({
      perguntaId: z.number().int(),
      opcaoId: z.number().int().optional(),
      valorOpcaoPadronizada: z.nativeEnum(opcoes_padronizadas).optional(),
      valorOpcaoTexto: z.string().optional(),
      valorNumerico: z.number().int().optional(),
      outroTexto: z.string().optional(),
      justificativaTexto: z.string().optional(),
    }),
  ),
});
