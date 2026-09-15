import React from 'react';
import { Button } from '../core/Button.jsx';

/** Parents → WhatsApp deep link. Rendered inert (disabled + reason) until a number is supplied. */
export function WhatsAppCta({ number = null }) {
  if (!number) {
    return (
      <p style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '0.75rem', margin: 0, fontFamily: 'var(--font-sans)' }}>
        <Button disabled>Chat on WhatsApp</Button>
        <span style={{ fontSize: 'var(--text-caption)', color: 'var(--color-ink-muted)' }}>Number not set yet</span>
      </p>
    );
  }
  return <Button href={`https://wa.me/${String(number).replace(/\D/g, '')}`}>Chat on WhatsApp</Button>;
}
