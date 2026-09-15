import React from 'react';

const base = {
  display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
  borderRadius: 'var(--radius-pill)', fontFamily: 'var(--font-sans)', fontSize: 'var(--text-body)',
  fontWeight: 600, textDecoration: 'none', cursor: 'pointer', border: '1px solid transparent',
  transition: 'background-color var(--dur-fast) var(--ease-karka-out), border-color var(--dur-fast) var(--ease-karka-out), color var(--dur-fast) var(--ease-karka-out)',
};

const variants = {
  primary: { background: 'var(--color-ink)', color: 'var(--color-on-ink)' },
  accent: { background: 'var(--color-teal-deep)', color: 'var(--color-on-ink)' },
  chip: { background: 'var(--color-board)', color: 'var(--color-ink)', border: '1px solid var(--color-line)', fontWeight: 500 },
};

/** KarkaLabs pill button/CTA. Variants from the site: primary (ink), accent (teal-deep, e.g. "Hear Aarya"), chip (audience pill). */
export function Button({ variant = 'primary', size = 'lg', disabled = false, tone = 'paper', href, children, style, ...rest }) {
  const [hover, setHover] = React.useState(false);
  const s = {
    ...base,
    minHeight: size === 'lg' ? 'var(--hit-target-lg)' : 'var(--hit-target)',
    padding: size === 'lg' ? '0 1.25rem' : '0 1rem',
    ...variants[variant],
    ...(hover && !disabled && variant === 'accent' ? { background: 'var(--color-teal-press)' } : null),
    ...(hover && !disabled && variant === 'chip' ? { borderColor: 'var(--color-teal)' } : null),
    ...(hover && !disabled && variant === 'primary' ? { background: 'var(--color-ink-2)' } : null),
    ...(disabled ? (tone === 'ink'
      ? { background: 'rgb(244 243 238 / 0.10)', color: 'var(--color-on-ink-muted)', cursor: 'not-allowed', border: '1px solid rgb(244 243 238 / 0.18)' }
      : { background: 'rgb(26 35 43 / 0.08)', color: 'var(--color-ink-muted)', cursor: 'not-allowed', border: '1px solid transparent' }) : null),
    ...style,
  };
  const props = { style: s, onMouseEnter: () => setHover(true), onMouseLeave: () => setHover(false), ...rest };
  if (href && !disabled) return <a href={href} {...props}>{children}</a>;
  return <button type="button" disabled={disabled} aria-disabled={disabled || undefined} {...props}>{children}</button>;
}
