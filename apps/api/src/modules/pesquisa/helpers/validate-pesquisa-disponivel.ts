import { BadRequestException } from "@nestjs/common";
import { getStatusFromPeriod } from "./get-status-from-period";

type PesquisaDisponibilidade = {
  estaAtiva: boolean;
  dataLancamento: Date;
  dataEncerramento: Date | null;
};

export function validatePesquisaDisponivel(
  pesquisa: PesquisaDisponibilidade,
): void {
  if (!pesquisa.estaAtiva) {
    throw new BadRequestException("Essa pesquisa não está ativa.");
  }

  if (!getStatusFromPeriod(pesquisa.dataLancamento, pesquisa.dataEncerramento)) {
    throw new BadRequestException(
      "Essa pesquisa não está disponível para respostas no momento.",
    );
  }
}
