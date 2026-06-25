import { Module } from "@nestjs/common";
import { CreatePesquisaController } from "./controllers/create-pesquisa.controller";
import { ListPesquisasController } from "./controllers/list-pesquisas.controller";
import { CreatePesquisaRepository } from "./repositories/create-pesquisa.repository";
import { FindPesquisaByNomeRepository } from "./repositories/find-pesquisa-by-nome.repository";
import { ListPesquisasRepository } from "./repositories/list-pesquisas.repository";
import { CreatePesquisaService } from "./services/create-pesquisa.service";
import { ListPesquisasService } from "./services/list-pesquisas.service";
import { ShowPesquisaPublicaController } from "./controllers/show-pesquisa-publica.controller";
import { SubmitPesquisaPublicaController } from "./controllers/submit-pesquisa-publica.controller";
import { ShowPesquisaPublicaService } from "./services/show-pesquisa-publica.service";
import { SubmitPesquisaPublicaService } from "./services/submit-pesquisa-publica.service";
import { FindPesquisaByPublicIdRepository } from "./repositories/find-pesquisa-by-public-id.repository";
import { SubmitPesquisaPublicaRepository } from "./repositories/submit-pesquisa-publica.repository";

@Module({
  controllers: [
    CreatePesquisaController,
    ListPesquisasController,
    ShowPesquisaPublicaController,
    SubmitPesquisaPublicaController
  ],
  providers: [
    CreatePesquisaService,
    ListPesquisasService,
    ShowPesquisaPublicaService,
    SubmitPesquisaPublicaService,
    CreatePesquisaRepository,
    ListPesquisasRepository,
    FindPesquisaByNomeRepository,
    FindPesquisaByPublicIdRepository,
    SubmitPesquisaPublicaRepository,
  ],
})
export class PesquisaModule {}
