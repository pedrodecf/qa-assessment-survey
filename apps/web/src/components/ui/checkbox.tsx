import { Control, Controller, FieldValues, Path } from "react-hook-form";

type TCheckbox<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  "data-test-id"?: string;
};

export function Checkbox<T extends FieldValues>({
  name,
  control,
  label,
  "data-test-id": dataTestId,
}: TCheckbox<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <label className="flex cursor-pointer items-center gap-2 text-sm text-zinc-700">
          <input
            type="checkbox"
            data-test-id={dataTestId}
            checked={!!field.value}
            onChange={(event) => field.onChange(event.target.checked)}
            className="h-4 w-4 rounded border-zinc-300 accent-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-1"
          />
          {label}
        </label>
      )}
    />
  );
}
