import { useId, useState, type FormEvent } from 'react';
import type { Audience } from '../embed/config';
import { Button } from './Button';
import { Field } from './Field';

/**
 * Parents → WhatsApp deep link — adopted from handoff/components/forms/WhatsAppCta.jsx.
 * Inert (disabled + reason) until the number is supplied. TODO:VB — the number (src/content/copy.ts).
 */
export function WhatsAppCta({ number }: { number: string | null }) {
  if (!number) {
    return (
      <p className="flex flex-wrap items-center gap-3">
        <Button disabled>Chat on WhatsApp</Button>
        <span className="text-caption text-ink-muted">Number not set yet</span>
      </p>
    );
  }
  return <Button href={`https://wa.me/${number.replace(/\D/g, '')}`}>Chat on WhatsApp</Button>;
}

/**
 * Demo-request form (schools / tuition centres) — adopted from handoff/components/forms/LeadForm.jsx.
 * Posts nowhere until `connected` (Supabase table is a later word). Field ids stay unique per form
 * (useId), which the bundle's fixed ids would not be with two forms on one page.
 */
export function LeadForm({
  audience,
  orgLabel = 'School',
  connected = false,
  onSubmit,
}: {
  audience: Extract<Audience, 'schools' | 'tuition'>;
  orgLabel?: string;
  connected?: boolean;
  onSubmit?: (e: FormEvent<HTMLFormElement>) => void;
}) {
  const id = useId();
  const [attempted, setAttempted] = useState(false);
  return (
    <form
      data-audience={audience}
      onSubmit={(e) => {
        e.preventDefault();
        setAttempted(true);
        onSubmit?.(e);
      }}
      className="grid gap-4 rounded-card border border-line bg-board p-5"
    >
      <Field id={`${id}-name`} label="Name" name="name" autoComplete="name" required />
      <Field id={`${id}-email`} label="Work email" name="email" type="email" autoComplete="email" required />
      <Field id={`${id}-org`} label={orgLabel} name="organisation" autoComplete="organization" required />
      <Field id={`${id}-phone`} label="Phone (optional)" name="phone" type="tel" autoComplete="tel" />
      <Button type="submit">Request a demo</Button>
      {!connected && (
        <p role="status" className="text-caption text-ink-muted">
          {attempted ? 'Nothing was sent: this form isn’t connected yet.' : 'Not connected yet: submissions go nowhere.'}
        </p>
      )}
    </form>
  );
}
