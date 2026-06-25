import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { cn } from "@/lib/utils";

type TDatePicker<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  helperText?: string;
  "data-test-id"?: string;
};

function toInputValue(value: unknown): string {
  if (!value) return "";
  const date = new Date(value as string | Date);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
}

export function DatePicker<T extends FieldValues>({
  name,
  control,
  label,
  helperText,
  "data-test-id": dataTestId,
}: TDatePicker<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <div className="flex flex-col gap-1.5">
          {label && (
            <label className="text-sm font-medium text-zinc-700">{label}</label>
          )}
          <input
            type="date"
            data-test-id={dataTestId}
            value={toInputValue(field.value)}
            onChange={(event) =>
              field.onChange(
                event.target.value
                  ? new Date(`${event.target.value}T00:00:00.000Z`)
                  : null,
              )
            }
            className={cn(
              "h-10 w-full rounded-md border bg-white px-3 py-2 text-sm text-zinc-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1",
              helperText ? "border-red-400" : "border-zinc-300",
            )}
          />
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
