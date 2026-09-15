/** Visible placeholder for unwritten copy (dashed olive card). */
export interface TodoCopyProps {
  /** What's missing, e.g. "headline and section copy". */
  what: string;
  /** Owner tag; the site uses "TODO:VB". */
  owner?: string;
}
export declare function TodoCopy(props: TodoCopyProps): JSX.Element;
