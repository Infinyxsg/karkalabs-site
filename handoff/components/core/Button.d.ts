/**
 * KarkaLabs pill button / CTA.
 * @startingPoint section="Components" subtitle="Ink, olive and chip pill CTAs" viewport="700x260"
 */
export interface ButtonProps {
  /** 'primary' = ink pill (Request a demo, Chat on WhatsApp); 'accent' = teal-deep pill (Hear Aarya); 'chip' = bordered audience pill. */
  variant?: 'primary' | 'accent' | 'chip';
  /** 'lg' = 48px min-height (primary CTAs, fields); 'md' = 44px (chips). */
  size?: 'lg' | 'md';
  disabled?: boolean;
  /** Ground the button sits on — selects the disabled palette ('ink' uses on-ink/10 fill + on-ink-muted text). */
  tone?: 'paper' | 'ink';
  /** Renders an <a> when set (and not disabled). */
  href?: string;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export declare function Button(props: ButtonProps): JSX.Element;
