import type { ButtonHTMLAttributes, ReactNode } from 'react';

/**
 * Pill button / CTA — adopted from handoff/components/core/Button.jsx (props and tokens verbatim).
 * Hover is CSS, not React state: behaviour stays the site's.
 */
interface OwnProps {
  /** 'primary' = ink pill; 'accent' = teal-deep pill; 'chip' = bordered audience pill. */
  variant?: 'primary' | 'accent' | 'chip';
  /** 'lg' = 48px min-height (primary CTAs); 'md' = 44px (chips). */
  size?: 'lg' | 'md';
  disabled?: boolean;
  /** Ground the button sits on — selects the disabled palette. */
  tone?: 'paper' | 'ink';
  /** Renders an <a> when set (and not disabled). */
  href?: string;
  /** Site addition: open `href` in a new tab (WhatsApp). */
  external?: boolean;
  children?: ReactNode;
  className?: string;
}

export type ButtonProps = OwnProps & Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof OwnProps>;

const base =
  'inline-flex items-center justify-center gap-2 rounded-pill border border-transparent text-body font-semibold no-underline transition-colors duration-(--dur-fast) ease-karka-out';
const sizes = { lg: 'min-h-hit-target-lg px-5', md: 'min-h-hit-target px-4' } as const;
const variants = {
  // Site addition: the ink pill hovers to the teal accent, so the product colour shows on interaction.
  primary: 'cursor-pointer bg-ink text-on-ink hover:bg-teal-deep',
  accent: 'cursor-pointer bg-teal-deep text-on-ink hover:bg-teal-press',
  chip: 'cursor-pointer border-line bg-board font-medium text-ink hover:border-teal hover:text-teal-deep',
} as const;
const disabledTone = {
  paper: 'cursor-not-allowed bg-ink/8 text-ink-muted',
  ink: 'cursor-not-allowed border-on-ink/18 bg-on-ink/10 text-on-ink-muted',
} as const;

export function Button({
  variant = 'primary',
  size = 'lg',
  disabled = false,
  tone = 'paper',
  href,
  external = false,
  children,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  const cls = `${base} ${sizes[size]} ${disabled ? disabledTone[tone] : variants[variant]} ${className}`;
  if (href && !disabled) {
    return (
      <a href={href} className={cls} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} disabled={disabled} aria-disabled={disabled || undefined} className={cls} {...rest}>
      {children}
    </button>
  );
}
