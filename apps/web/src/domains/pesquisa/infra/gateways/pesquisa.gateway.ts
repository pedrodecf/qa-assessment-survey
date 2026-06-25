import type {
  CreatePesquisaDTO,
  PesquisaFilters,
  PublicPesquisaDTO,
  SubmitPesquisaDTO,
} from "../../types/dtos/pesquisa.dto";
import type { PesquisaList } from "../entities/pesquisa-list.entity";

export interface PesquisaGateway {
  listPesquisas(filters: PesquisaFilters): Promise<PesquisaList>;
  createPesquisa(data: CreatePesquisaDTO): Promise<void>;
  getPublicPesquisa(idPublico: string): Promise<PublicPesquisaDTO>;
  submitPesquisa(idPublico: string, data: SubmitPesquisaDTO): Promise<void>;
}
