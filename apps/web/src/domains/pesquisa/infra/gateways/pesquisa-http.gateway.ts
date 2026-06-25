import { HttpClient } from "@/lib/http/http-client";
import type {
  CreatePesquisaDTO,
  PesquisaFilters,
  PublicPesquisaDTO,
  SubmitPesquisaDTO,
} from "../../types/dtos/pesquisa.dto";
import { PesquisaList } from "../entities/pesquisa-list.entity";
import { PesquisaGateway } from "./pesquisa.gateway";

export class PesquisaHttpGateway implements PesquisaGateway {
  constructor(private readonly httpClient: HttpClient) {}
  readonly route: string = "pesquisas";

  async listPesquisas(filters: PesquisaFilters): Promise<PesquisaList> {
    const response = await this.httpClient.get(`/${this.route}`, {
      ...filters,
    });

    return new PesquisaList({
      items: response.items,
      pages: response.pages,
      totalItems: response.totalItems,
    });
  }

  async createPesquisa(data: CreatePesquisaDTO): Promise<void> {
    await this.httpClient.post(`/${this.route}`, data);
  }

  async getPublicPesquisa(idPublico: string): Promise<PublicPesquisaDTO> {
    return await this.httpClient.get(`/public/${idPublico}`);
  }

  async submitPesquisa(
    idPublico: string,
    data: SubmitPesquisaDTO,
  ): Promise<void> {
    await this.httpClient.post(`/public/${idPublico}/respostas`, data);
  }
}
