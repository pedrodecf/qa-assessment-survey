import { useNavigate, useParams } from "react-router-dom";
import { PesquisaSubmitService } from "../services/pesquisa-submit.service";

export const PesquisaSubmitContainer = () => {
  const navigate = useNavigate();
  const { idPublico = "" } = useParams();
  return <PesquisaSubmitService idPublico={idPublico} navigate={navigate} />;
};
