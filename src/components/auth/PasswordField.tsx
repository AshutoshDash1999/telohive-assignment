interface PasswordFieldProps {
  id: string;
  label: string;
  value: string;
  autoComplete: string;
  isVisible: boolean;
  error?: string;
  onChange: (value: string) => void;
  onToggleVisibility: () => void;
}

export function PasswordField({
  id,
  label,
  value,
  autoComplete,
  isVisible,
  error,
  onChange,
  onToggleVisibility,
}: PasswordFieldProps) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="text-sm font-medium text-zinc-900">
        {label}
      </label>
      <div className="flex gap-2">
        <input
          id={id}
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm outline-none ring-zinc-900/10 transition focus:border-zinc-400 focus:ring-2"
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={onToggleVisibility}
          className="rounded-md border border-zinc-300 px-3 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100"
        >
          {isVisible ? "Hide" : "Show"}
        </button>
      </div>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
