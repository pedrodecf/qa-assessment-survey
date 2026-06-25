import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class FindPesquisaByPublicIdRepository {
  constructor(private readonly prisma: PrismaService) {}

  execute(idPublico: string) {
    return this.prisma.pesquisa.findUnique({
      where: { idPublico, deletedAt: null },
      select: {
        id: true,
        empresaId: true,
        nome: true,
        descricao: true,
        dataLancamento: true,
        dataEncerramento: true,
        estaAtiva: true,
        idPublico: true,
        perguntas: {
          select: {
            id: true,
            nome: true,
            tipo: true,
            respostaObrigatoria: true,
            justificarResposta: true,
            permitirOutro: true,
            opcoes: {
              select: { id: true, texto: true },
            },
          },
        },
      },
    });
  }
}
