import type { InputHTMLAttributes } from 'react';

/** Labelled input, 48px, paper fill, teal focus border — adopted from handoff/components/forms/Field.jsx. */
export function Field({ id, label, ...input }: { id: string; label: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="text-caption font-semibold text-ink">
        {label}
      </label>
      <input
        id={id}
        {...input}
        className="min-h-hit-target-lg rounded-field border border-line bg-paper px-3 text-body text-ink outline-none transition-colors duration-(--dur-fast) ease-karka-out focus:border-teal"
      />
    </div>
  );
}
