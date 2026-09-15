import React from 'react';

/**
 * Mastery-state token map. The product's real vocabulary is not yet supplied — every label here is
 * a TODO:VB placeholder and MUST NOT be shipped as copy. Override via the `states` prop, or edit
 * this map once the site session reports the real mastery terms.
 */
export const CONCEPT_STATES = {
  initial: {
    label: 'TODO:VB',
    fg: 'var(--color-on-ink)',
    titleFg: 'var(--color-on-ink-muted)',
    bg: 'transparent',
    border: 'rgb(244 243 238 / 0.25)',
    dot: 'var(--color-teal-on-ink)',
  },
  terminal: {
    label: 'TODO:VB',
    fg: 'var(--color-sage-deep)',
    titleFg: 'var(--color-sage-deep)',
    bg: 'var(--color-sage-tint)',
    border: 'var(--color-sage-tint)',
    dot: 'var(--color-sage-deep)',
  },
};

/** Concept-state chip. Labels and colours come from a state map, never hard-coded. */
export function ConceptChip({ state = 'initial', states = CONCEPT_STATES, title = 'Concept state', summary = false }) {
  const keys = Object.keys(states);
  const s = states[state] || states[keys[0]];
  return (
    <p aria-live="polite" data-concept-state={summary ? 'summary' : state} style={{
      margin: 0, display: 'inline-flex', minHeight: '2rem', alignItems: 'center', gap: '0.5rem',
      borderRadius: 'var(--radius-pill)', padding: '0 0.75rem',
      fontFamily: 'var(--font-sans)', fontSize: 'var(--text-caption)', fontWeight: 600,
      background: s.bg, color: s.fg, border: `1px solid ${s.border}`,
      transition: 'background-color var(--dur-base) var(--ease-karka-out), border-color var(--dur-base) var(--ease-karka-out), color var(--dur-base) var(--ease-karka-out)',
    }}>
      <span style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: s.dot }} aria-hidden="true"></span>
      <span style={{ color: s.titleFg || s.fg }}>{title}</span>
      <span>{summary ? keys.map((k) => states[k].label).join(' → ') : s.label}</span>
    </p>
  );
}
