import { Control, Controller } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { PesquisaSubmitInputSchema } from "../../../schema/pesquisa-submit.schema";
import { PublicPerguntaDTO } from "../../../types/dtos/pesquisa.dto";
import {
  NIVEL_SATISFACAO_OPTIONS,
  OUTRO_VALUE,
  pontuacaoMaxima,
  QUALIDADE_PERCEBIDA_OPTIONS,
} from "../../../types/others";

type TOption = { value: string; label: string };

type TRespostaPergunta = {
  control: Control<PesquisaSubmitInputSchema>;
  index: number;
  pergunta: PublicPerguntaDTO;
  missing: boolean;
};

export function RespostaPergunta({
  control,
  index,
  pergunta,
  missing,
}: TRespostaPergunta) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border p-4",
        missing ? "border-red-400" : "border-zinc-200",
      )}
    >
      <p className="font-medium text-zinc-800">
        {pergunta.nome}
        {pergunta.respostaObrigatoria && (
          <span className="text-red-600"> *</span>
        )}
      </p>

      {renderInput()}

      {pergunta.justificarResposta && (
        <Textarea
          control={control}
          name={`answers.${index}.justificativaTexto`}
          label="Justificativa"
          placeholder="Justifique sua resposta"
          rows={2}
          data-test-id={`resposta-justificativa-${pergunta.id}`}
        />
      )}

      {missing && (
        <span className="text-xs text-red-600">Resposta obrigatória.</span>
      )}
    </div>
  );

  function renderInput() {
    switch (pergunta.tipo) {
      case "texto_grande":
        return (
          <Textarea
            control={control}
            name={`answers.${index}.valor`}
            placeholder="Sua resposta"
            data-test-id={`resposta-texto-${pergunta.id}`}
          />
        );
      case "multipla_escolha":
        return renderRadios(
          pergunta.opcoes.map((opcao) => ({
            value: String(opcao.id),
            label: opcao.texto,
          })),
          pergunta.permitirOutro,
        );
      case "opcoes_diversas":
        return renderCheckboxes(
          pergunta.opcoes.map((opcao) => ({
            value: String(opcao.id),
            label: opcao.texto,
          })),
          pergunta.permitirOutro,
        );
      case "pontuacao_0_a_5":
      case "pontuacao_0_a_10":
        return renderRadios(
          Array.from({ length: pontuacaoMaxima(pergunta.tipo) + 1 }, (_, n) => ({
            value: String(n),
            label: String(n),
          })),
          false,
          true,
        );
      case "nivel_satisfacao":
        return renderRadios(NIVEL_SATISFACAO_OPTIONS, false);
      case "qualidade_percebida":
        return renderRadios(QUALIDADE_PERCEBIDA_OPTIONS, false);
      default:
        return null;
    }
  }

  function renderRadios(options: TOption[], permitirOutro: boolean, inline = false) {
    return (
      <Controller
        control={control}
        name={`answers.${index}.valor`}
        render={({ field }) => (
          <div className={cn("flex gap-3", inline ? "flex-wrap" : "flex-col")}>
            {options.map((opcao) => (
              <label
                key={opcao.value}
                className="flex items-center gap-2 text-sm text-zinc-700"
              >
                <input
                  type="radio"
                  className="accent-emerald-600"
                  data-test-id={`resposta-opcao-${pergunta.id}-${opcao.value}`}
                  checked={field.value === opcao.value}
                  onChange={() => field.onChange(opcao.value)}
                />
                {opcao.label}
              </label>
            ))}
            {permitirOutro && (
              <label className="flex items-center gap-2 text-sm text-zinc-700">
                <input
                  type="radio"
                  className="accent-emerald-600"
                  data-test-id={`resposta-outro-${pergunta.id}`}
                  checked={field.value === OUTRO_VALUE}
                  onChange={() => field.onChange(OUTRO_VALUE)}
                />
                Outro
              </label>
            )}
            {permitirOutro && field.value === OUTRO_VALUE && renderOutroInput()}
          </div>
        )}
      />
    );
  }

  function renderCheckboxes(options: TOption[], permitirOutro: boolean) {
    return (
      <Controller
        control={control}
        name={`answers.${index}.valores`}
        render={({ field }) => {
          const values: string[] = field.value ?? [];
          const toggle = (value: string) =>
            field.onChange(
              values.includes(value)
                ? values.filter((item) => item !== value)
                : [...values, value],
            );

          return (
            <div className="flex flex-col gap-2">
              {options.map((opcao) => (
                <label
                  key={opcao.value}
                  className="flex items-center gap-2 text-sm text-zinc-700"
                >
                  <input
                    type="checkbox"
                    className="accent-emerald-600"
                    data-test-id={`resposta-opcao-${pergunta.id}-${opcao.value}`}
                    checked={values.includes(opcao.value)}
                    onChange={() => toggle(opcao.value)}
                  />
                  {opcao.label}
                </label>
              ))}
              {permitirOutro && (
                <label className="flex items-center gap-2 text-sm text-zinc-700">
                  <input
                    type="checkbox"
                    className="accent-emerald-600"
                    data-test-id={`resposta-outro-${pergunta.id}`}
                    checked={values.includes(OUTRO_VALUE)}
                    onChange={() => toggle(OUTRO_VALUE)}
                  />
                  Outro
                </label>
              )}
              {permitirOutro && values.includes(OUTRO_VALUE) && renderOutroInput()}
            </div>
          );
        }}
      />
    );
  }

  function renderOutroInput() {
    return (
      <Controller
        control={control}
        name={`answers.${index}.outroTexto`}
        render={({ field }) => (
          <input
            type="text"
            value={field.value ?? ""}
            onChange={field.onChange}
            placeholder="Especifique"
            data-test-id={`resposta-outro-texto-${pergunta.id}`}
            className="h-10 w-full rounded-md border border-zinc-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
          />
        )}
      />
    );
  }
}
