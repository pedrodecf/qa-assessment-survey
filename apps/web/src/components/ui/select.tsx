import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

type TOption = {
  value: string;
  label: string;
};

type TSelect<T extends FieldValues> = {
  "data-test-id"?: string;
  options: TOption[];
  placeholder?: string;
  label?: string;
  helperText?: string;
  name: Path<T>;
  control: Control<T>;
  clearable?: boolean;
  onChangeCapture?: (value: string) => void;
};

export default function Select<T extends FieldValues>({
  options,
  placeholder,
  label,
  helperText,
  name,
  control,
  clearable = true,
  onChangeCapture,
  "data-test-id": dataTestId,
}: TSelect<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { value, onChange } }) => (
        <div className="flex w-full flex-col gap-1.5">
          {label && (
            <label className="text-sm font-medium text-zinc-700">{label}</label>
          )}
          <select
            data-test-id={dataTestId}
            value={value ?? ""}
            onChange={(event) => {
              const next = event.target.value;
              onChange(next === "" ? null : next);
              onChangeCapture?.(next);
            }}
            className={cn(
              "h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1",
              helperText ? "border-red-400" : "border-zinc-300",
            )}
          >
            {(clearable || !value) && (
              <option value="">{placeholder ?? "Selecione..."}</option>
            )}
            {options.map((option, index) => (
              <option
                key={option.value}
                value={option.value}
                data-test-id={`${dataTestId}-option-${index}`}
              >
                {option.label}
              </option>
            ))}
          </select>
          {helperText && (
            <span
              data-test-id={`${dataTestId}-helper-text`}
              className="text-xs text-red-600"
            >
              {helperText}
            </span>
          )}
        </div>
      )}
    />
  );
}
