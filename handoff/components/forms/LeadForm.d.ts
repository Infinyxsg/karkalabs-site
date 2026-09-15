/**
 * Demo-request lead form for schools / tuition centres.
 * @startingPoint section="Components" subtitle="Demo-request card with honest status line" viewport="700x560"
 */
export interface LeadFormProps {
  /** Label for the organisation field: "School" or "Centre". */
  orgLabel?: string;
  /** When false (default), shows the honest "not connected yet" status line. */
  connected?: boolean;
  onSubmit?: (e: React.FormEvent) => void;
}
export declare function LeadForm(props: LeadFormProps): JSX.Element;
