import { Controller, Get, HttpCode, Param } from "@nestjs/common";
import { ShowPesquisaPublicaService } from "../services/show-pesquisa-publica.service";

@Controller("public")
export class ShowPesquisaPublicaController {
  constructor(private readonly service: ShowPesquisaPublicaService) {}

  @Get(":idPublico")
  @HttpCode(200)
  execute(@Param("idPublico") idPublico: string) {
    return this.service.execute(idPublico);
  }
}
