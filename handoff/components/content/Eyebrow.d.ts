/** Uppercase-tracked section eyebrow ("FOR STUDENTS"). */
export interface EyebrowProps {
  /** Ground it sits on: 'paper' → teal, 'ink' → teal-on-ink. */
  tone?: 'paper' | 'ink';
  children?: React.ReactNode;
}
export declare function Eyebrow(props: EyebrowProps): JSX.Element;
