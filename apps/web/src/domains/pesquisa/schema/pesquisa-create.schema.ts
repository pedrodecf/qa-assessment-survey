import { z } from "zod";
import { PERGUNTA_TIPOS, TIPOS_COM_OPCOES } from "../types/others";

const utcDay = (date: Date): number =>
  Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());

export const pesquisaCreateSchema = z
  .object({
    nome: z
      .string({ required_error: "Campo obrigatório" })
      .trim()
      .min(3, "Mínimo de 3 caracteres")
      .max(300, "Máximo de 300 caracteres"),
    descricao: z
      .string()
      .trim()
      .optional()
      .transform((value) => (value === "" ? undefined : value))
      .refine((value) => value === undefined || value.length >= 3, {
        message: "Mínimo de 3 caracteres",
      })
      .refine((value) => value === undefined || value.length <= 1000, {
        message: "Máximo de 1000 caracteres",
      }),
    dataLancamento: z.date({
      required_error: "Campo obrigatório",
      invalid_type_error: "Campo obrigatório",
    }),
    dataEncerramento: z
      .date()
      .nullable()
      .optional()
      .transform((date) => date ?? null),
    perguntas: z
      .array(
        z
          .object({
            nome: z
              .string({ required_error: "Campo obrigatório" })
              .trim()
              .min(3, "Mínimo de 3 caracteres")
              .max(300, "Máximo de 300 caracteres"),
            tipo: z.enum(PERGUNTA_TIPOS, {
              required_error: "Campo obrigatório",
              invalid_type_error: "Campo obrigatório",
            }),
            respostaObrigatoria: z.boolean().optional().default(false),
            justificarResposta: z.boolean().optional().default(false),
            permitirOutro: z.boolean().optional().default(false),
            opcoes: z
              .array(
                z.object({
                  texto: z
                    .string()
                    .trim()
                    .min(1, "Campo obrigatório")
                    .max(300, "Máximo de 300 caracteres"),
                }),
              )
              .optional()
              .default([]),
          })
          .superRefine((pergunta, ctx) => {
            if (TIPOS_COM_OPCOES.includes(pergunta.tipo)) {
              if (pergunta.opcoes.length < 2) {
                ctx.addIssue({
                  code: z.ZodIssueCode.custom,
                  path: ["opcoes"],
                  message: "Adicione pelo menos duas opções",
                });
              }
            }
          }),
      )
      .min(1, "Adicione pelo menos uma pergunta"),
  })
  .refine(({ dataLancamento }) => utcDay(dataLancamento) >= utcDay(new Date()), {
    message: "A data não pode ser anterior a hoje.",
    path: ["dataLancamento"],
  })
  .refine(
    ({ dataEncerramento, dataLancamento }) =>
      !dataEncerramento || utcDay(dataEncerramento) >= utcDay(dataLancamento),
    {
      message: "A data não pode ser anterior ao lançamento.",
      path: ["dataEncerramento"],
    },
  );

export type PesquisaCreateInputSchema = z.input<typeof pesquisaCreateSchema>;
export type PesquisaCreateOutputSchema = z.output<typeof pesquisaCreateSchema>;
