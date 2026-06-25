import { Injectable, NotFoundException } from "@nestjs/common";
import { validatePesquisaDisponivel } from "../helpers/validate-pesquisa-disponivel";
import { FindPesquisaByPublicIdRepository } from "../repositories/find-pesquisa-by-public-id.repository";

@Injectable()
export class ShowPesquisaPublicaService {
  constructor(private readonly repository: FindPesquisaByPublicIdRepository) {}

  async execute(idPublico: string) {
    const pesquisa = await this.repository.execute(idPublico);

    if (!pesquisa) {
      throw new NotFoundException("Pesquisa não encontrada.");
    }

    validatePesquisaDisponivel(pesquisa);

    return pesquisa;
  }
}
