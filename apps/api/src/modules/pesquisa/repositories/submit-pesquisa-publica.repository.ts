import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../../prisma/prisma.service";

@Injectable()
export class SubmitPesquisaPublicaRepository {
  constructor(private readonly prisma: PrismaService) {}

  execute(input: {
    pesquisaId: string;
    empresaId: string;
    iniciadoEm: Date | null;
    finalizadoEm: Date | null;
    respostas: Omit<
      Prisma.respostaCreateManyInput,
      "pesquisaId" | "empresaId" | "iniciadoEm" | "finalizadoEm"
    >[];
  }) {
    return this.prisma.resposta.createMany({
      data: input.respostas.map((resposta) => ({
        ...resposta,
        pesquisaId: input.pesquisaId,
        empresaId: input.empresaId,
        iniciadoEm: input.iniciadoEm,
        finalizadoEm: input.finalizadoEm,
      })),
    });
  }
}
