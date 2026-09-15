import React from 'react';
import { Field } from './Field.jsx';
import { Button } from '../core/Button.jsx';

/**
 * Demo-request lead form (schools / tuition centres). White card, line border, 16px radius.
 * Status line is honest about being unconnected until `connected` is true.
 */
export function LeadForm({ orgLabel = 'School', connected = false, onSubmit }) {
  const [attempted, setAttempted] = React.useState(false);
  return (
    <form onSubmit={(e) => { e.preventDefault(); setAttempted(true); onSubmit && onSubmit(e); }}
      style={{ display: 'grid', gap: '1rem', borderRadius: 'var(--radius-card)', border: '1px solid var(--color-line)', background: 'var(--color-board)', padding: '1.25rem', fontFamily: 'var(--font-sans)' }}>
      <Field id="lf-name" label="Name" name="name" autoComplete="name" required />
      <Field id="lf-email" label="Work email" name="email" type="email" autoComplete="email" required />
      <Field id="lf-org" label={orgLabel} name="organisation" autoComplete="organization" required />
      <Field id="lf-phone" label="Phone (optional)" name="phone" type="tel" autoComplete="tel" />
      <Button type="submit">Request a demo</Button>
      {!connected && (
        <p role="status" style={{ margin: 0, fontSize: 'var(--text-caption)', color: 'var(--color-ink-muted)' }}>
          {attempted ? 'Nothing was sent: this form isn’t connected yet.' : 'Not connected yet: submissions go nowhere.'}
        </p>
      )}
    </form>
  );
}
