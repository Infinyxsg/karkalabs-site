import type { ReactNode } from 'react';

/**
 * Uppercase-tracked section label — adopted from handoff/components/content/Eyebrow.jsx.
 * 'paper' = teal, 'ink' = teal-on-ink (bundle). 'scene' is a site addition: teal on the scene
 * ground #EEF2F4 is 4.39:1, under AA for 12px text, so the hero uses teal-deep (reported to the DS).
 */
export function Eyebrow({
  tone = 'paper',
  children,
  className = '',
}: {
  tone?: 'paper' | 'ink' | 'scene';
  children: ReactNode;
  className?: string;
}) {
  const color = { paper: 'text-teal', ink: 'text-teal-on-ink', scene: 'text-teal-deep' }[tone];
  return <p className={`text-eyebrow font-semibold uppercase tracking-eyebrow ${color} ${className}`}>{children}</p>;
}
