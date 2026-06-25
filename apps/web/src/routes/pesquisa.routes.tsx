import type { RouteObject } from "react-router-dom";
import { pesquisaRoutes } from "@/domains/pesquisa/routes";

const routeName = "pesquisas";

export const pesquisaAppRoutes: RouteObject[] = [
  {
    path: `/${routeName}`,
    element: <pesquisaRoutes.PESQUISA_LIST />,
  },
  {
    path: `/${routeName}/criar`,
    element: <pesquisaRoutes.PESQUISA_CREATE />,
  },
  {
    path: `/${routeName}/resposta/:idPublico`,
    element: <pesquisaRoutes.PESQUISA_SUBMIT />,
  },
];
