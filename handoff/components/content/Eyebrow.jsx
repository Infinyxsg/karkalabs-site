import React from 'react';

/** Uppercase-tracked section label. tone 'paper' = sage-deep, 'ink' = olive. */
export function Eyebrow({ tone = 'paper', children }) {
  return (
    <p style={{
      margin: 0, fontFamily: 'var(--font-sans)', fontSize: 'var(--text-eyebrow)', lineHeight: 'var(--leading-eyebrow)',
      fontWeight: 600, textTransform: 'uppercase', letterSpacing: 'var(--tracking-eyebrow)',
      color: tone === 'ink' ? 'var(--color-teal-on-ink)' : 'var(--color-teal)',
    }}>{children}</p>
  );
}
