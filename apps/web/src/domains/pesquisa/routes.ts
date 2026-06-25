import { PesquisaCreateContainer } from "./components/containers/pesquisa-create.container";
import { PesquisaListContainer } from "./components/containers/pesquisa-list.container";
import { PesquisaSubmitContainer } from "./components/containers/pesquisa-submit.container";

export const pesquisaRoutes = {
  PESQUISA_LIST: PesquisaListContainer,
  PESQUISA_CREATE: PesquisaCreateContainer,
  PESQUISA_SUBMIT: PesquisaSubmitContainer,
};
