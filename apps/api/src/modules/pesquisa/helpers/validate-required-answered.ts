import { BadRequestException } from "@nestjs/common";

export function validateRequiredAnswered(
  perguntas: { id: number; respostaObrigatoria: boolean }[],
  respostas: { perguntaId: number }[],
): void {
  const respondidas = new Set(respostas.map((r) => r.perguntaId));
  const faltantes = perguntas
    .filter((p) => p.respostaObrigatoria && !respondidas.has(p.id))
    .map((p) => p.id);

  if (faltantes.length > 0) {
    throw new BadRequestException(
      `As perguntas obrigatórias a seguir não foram respondidas: ${faltantes.join(", ")}.`,
    );
  }
}
