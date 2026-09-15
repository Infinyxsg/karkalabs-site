/** Scene step-progress dots (olive pills on ink). */
export interface StepProgressProps {
  /** Steps completed (1-based count). */
  current?: number;
  total?: number;
}
export declare function StepProgress(props: StepProgressProps): JSX.Element;
