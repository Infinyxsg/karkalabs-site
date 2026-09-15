import React from 'react';

/** Visible placeholder for copy that hasn't been written yet. Never invent copy to fill a slot — render this instead. */
export function TodoCopy({ what, owner = 'TODO' }) {
  return (
    <p style={{
      margin: 0, borderRadius: 'var(--radius-card)', border: '1px dashed var(--color-olive)',
      background: 'var(--color-olive-tint)', padding: '0.75rem 1rem',
      fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)', color: 'var(--color-ink)',
    }}>
      <strong style={{ fontWeight: 600 }}>{owner}</strong> · {what}
    </p>
  );
}
