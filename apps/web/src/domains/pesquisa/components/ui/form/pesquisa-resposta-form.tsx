import { UseFormReturn } from "react-hook-form";
import { PesquisaSubmitInputSchema } from "../../../schema/pesquisa-submit.schema";
import { PublicPesquisaDTO } from "../../../types/dtos/pesquisa.dto";
import { RespostaPergunta } from "./resposta-pergunta";

type TPesquisaRespostaForm = {
  pesquisa: PublicPesquisaDTO;
  formMethods: UseFormReturn<PesquisaSubmitInputSchema>;
  missingIds: number[];
};

export function PesquisaRespostaForm({
  pesquisa,
  formMethods,
  missingIds,
}: TPesquisaRespostaForm) {
  const { control } = formMethods;

  return (
    <div className="flex flex-col gap-4">
      {pesquisa.perguntas.map((pergunta, index) => (
        <RespostaPergunta
          key={pergunta.id}
          control={control}
          index={index}
          pergunta={pergunta}
          missing={missingIds.includes(pergunta.id)}
        />
      ))}
    </div>
  );
}
