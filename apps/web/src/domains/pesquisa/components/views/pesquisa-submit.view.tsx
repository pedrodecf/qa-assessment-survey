import { UseFormReturn } from "react-hook-form";
import { NavigateFunction } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PesquisaSubmitInputSchema } from "../../schema/pesquisa-submit.schema";
import { PublicPesquisaDTO } from "../../types/dtos/pesquisa.dto";
import { PesquisaRespostaForm } from "../ui/form/pesquisa-resposta-form";

type TPesquisaSubmitView = {
  pesquisa?: PublicPesquisaDTO;
  loading: boolean;
  isError: boolean;
  submitting: boolean;
  submitError: boolean;
  submitted: boolean;
  missingIds: number[];
  formMethods: UseFormReturn<PesquisaSubmitInputSchema>;
  navigate: NavigateFunction;
  onSubmit: (data: PesquisaSubmitInputSchema) => Promise<void>;
};

export function PesquisaSubmitView({
  pesquisa,
  loading,
  isError,
  submitting,
  submitError,
  submitted,
  missingIds,
  formMethods,
  navigate,
  onSubmit,
}: Readonly<TPesquisaSubmitView>) {
  if (loading) {
    return (
      <div className="mx-auto w-full max-w-2xl p-8 text-zinc-500">
        Carregando pesquisa…
      </div>
    );
  }

  if (isError || !pesquisa) {
    return (
      <div
        data-test-id="pesquisa-submit-unavailable"
        className="mx-auto w-full max-w-2xl p-8 text-zinc-600"
      >
        Pesquisa não encontrada ou indisponível para respostas.
      </div>
    );
  }

  if (submitted) {
    return (
      <div
        data-test-id="pesquisa-submit-success"
        className="mx-auto flex w-full max-w-2xl flex-col items-start gap-4 p-8"
      >
        <h1 className="text-2xl font-semibold text-zinc-900">
          Respostas enviadas!
        </h1>
        <p className="text-sm text-zinc-500">
          Obrigado por responder a pesquisa.
        </p>
        <Button variant="outline" onClick={() => navigate("/pesquisas")}>
          Voltar
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 p-8">
      <header>
        <h1 className="text-2xl font-semibold text-zinc-900">{pesquisa.nome}</h1>
        {pesquisa.descricao && (
          <p className="text-sm text-zinc-500">{pesquisa.descricao}</p>
        )}
      </header>

      <form
        onSubmit={formMethods.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <PesquisaRespostaForm
          pesquisa={pesquisa}
          formMethods={formMethods}
          missingIds={missingIds}
        />

        {missingIds.length > 0 && (
          <p
            data-test-id="pesquisa-submit-missing"
            className="text-sm text-red-600"
          >
            Responda todas as perguntas obrigatórias.
          </p>
        )}

        {submitError && (
          <p
            data-test-id="pesquisa-submit-error"
            className="text-sm text-red-600"
          >
            Erro ao enviar as respostas. Tente novamente.
          </p>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            data-test-id="pesquisa-submit-button"
            disabled={submitting}
          >
            {submitting ? "Enviando…" : "Enviar respostas"}
          </Button>
        </div>
      </form>
    </div>
  );
}
