import React from 'react';

/** Labelled text input, 48px min-height, paper fill, sage-deep focus border. */
export function Field({ id, label, type = 'text', required, placeholder, ...input }) {
  const [focus, setFocus] = React.useState(false);
  return (
    <div style={{ display: 'grid', gap: '0.375rem', fontFamily: 'var(--font-sans)' }}>
      <label htmlFor={id} style={{ fontSize: 'var(--text-caption)', fontWeight: 600, color: 'var(--color-ink)' }}>{label}</label>
      <input id={id} type={type} required={required} placeholder={placeholder}
        onFocus={() => setFocus(true)} onBlur={() => setFocus(false)}
        style={{
          minHeight: 'var(--hit-target-lg)', borderRadius: 'var(--radius-field)',
          border: `1px solid ${focus ? 'var(--color-teal)' : 'var(--color-line)'}`,
          background: 'var(--color-paper)', padding: '0 0.75rem',
          fontSize: 'var(--text-body)', color: 'var(--color-ink)', outline: 'none', fontFamily: 'inherit',
        }} {...input} />
    </div>
  );
}
