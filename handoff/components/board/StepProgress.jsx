import React from 'react';

/** Step dots for a board scene: past steps stretch to 20px olive pills; upcoming stay 6px on-ink/25 dots. Designed for the ink ground. */
export function StepProgress({ current = 0, total = 6 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }} role="img" aria-label={`Step ${current} of ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span key={i} style={{
          height: '0.375rem', borderRadius: 'var(--radius-pill)',
          width: i < current ? '1.25rem' : '0.375rem',
          background: i < current ? 'var(--color-teal-on-ink)' : 'rgb(244 243 238 / 0.25)',
          transition: 'width var(--dur-base) var(--ease-karka-out), background-color var(--dur-base) var(--ease-karka-out)',
        }}></span>
      ))}
    </div>
  );
}
