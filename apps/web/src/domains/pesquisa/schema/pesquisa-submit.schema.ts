import { z } from "zod";

export const respostaAnswerSchema = z.object({
  perguntaId: z.number(),
  valor: z.string().default(""),
  valores: z.array(z.string()).default([]),
  outroTexto: z.string().default(""),
  justificativaTexto: z.string().default(""),
});

export const pesquisaSubmitSchema = z.object({
  answers: z.array(respostaAnswerSchema),
});

export type RespostaAnswer = z.infer<typeof respostaAnswerSchema>;
export type PesquisaSubmitInputSchema = z.input<typeof pesquisaSubmitSchema>;
export type PesquisaSubmitValues = z.infer<typeof pesquisaSubmitSchema>;
