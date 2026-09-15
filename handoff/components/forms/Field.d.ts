/** Labelled text input (caption-weight label, paper fill, sage-deep focus). */
export interface FieldProps {
  id: string;
  label: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  name?: string;
  autoComplete?: string;
}
export declare function Field(props: FieldProps): JSX.Element;
