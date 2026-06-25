import {
  Body,
  Controller,
  HttpCode,
  Param,
  Post,
  UsePipes,
} from "@nestjs/common";
import { ZodValidationPipe } from "nestjs-zod";
import { SubmitPesquisaPublicaService } from "../services/submit-pesquisa-publica.service";
import { SubmitPesquisaPublicaDto } from "../dtos/submit-pesquisa-publica.dto";

@Controller("public")
export class SubmitPesquisaPublicaController {
  constructor(private readonly service: SubmitPesquisaPublicaService) {}

  @Post(":idPublico/respostas")
  @HttpCode(201)
  @UsePipes(ZodValidationPipe)
  execute(
    @Param("idPublico") idPublico: string,
    @Body() body: SubmitPesquisaPublicaDto,
  ) {
    return this.service.execute(idPublico, body);
  }
}
