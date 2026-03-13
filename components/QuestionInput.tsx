"use client";

type Props = {
  code: string;
  values: Record<string, string>;
  onChange: (code: string, value: string) => void;
  placeholder?: string;
  className?: string;
};

const DEFAULT_CLASS = "w-full rounded border border-gray-300 px-2 py-1 text-sm";

/**
 * Shared text input bound to a question code.
 * Used across panel components instead of duplicating inline <input> patterns.
 */
export function QuestionInput({ code, values, onChange, placeholder = "", className = DEFAULT_CLASS }: Props) {
  return (
    <input
      type="text"
      value={values[code] ?? ""}
      onChange={(e) => onChange(code, e.target.value)}
      placeholder={placeholder}
      className={className}
    />
  );
}
