import type {
  FieldErrors,
  FieldValues,
  Path,
  UseFormRegister,
} from "react-hook-form";

interface Props<T extends FieldValues> {
  label: string;
  name: Path<T>;
  disabled?: boolean;
  register: UseFormRegister<T>;
  errors: FieldErrors<T>;
  type?: React.HTMLInputTypeAttribute;
}

export default function InputField<T extends FieldValues>({
  register,
  label,
  name,
  errors,
  disabled,
  type,
}: Props<T>) {
  const errorMessage = errors[name]?.message;

  return (
    <div className="mt-4">
      <label htmlFor={name} className="block">
        {label}:
      </label>

      <input
        id={name}
        disabled={disabled}
        type={type}
        {...register(name)}
        className="block text-black w-full border bg-white rounded-md p-2 disabled:opacity-50"
      />

      {errorMessage && typeof errorMessage === "string" ? (
        <p className="text-red-500 text-xs mt-1">{errorMessage}</p>
      ) : null}
    </div>
  );
}
