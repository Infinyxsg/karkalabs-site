/** Concept-state chip. Labels and colours come from a state map — never hard-coded. */
export interface ConceptState {
  /** Visible state label. Placeholder until the product's real mastery vocabulary is supplied. */
  label: string;
  /** Text colour for the state label. */
  fg: string;
  /** Text colour for the chip title on this state's ground. Falls back to `fg`. */
  titleFg?: string;
  /** Fill. */
  bg: string;
  /** Border colour. */
  border: string;
  /** Status-dot colour. */
  dot: string;
}
/**
 * Concept-state chip props.
 * @startingPoint section="Components" subtitle="Board state chip driven by a mastery-state map" viewport="700x330"
 */
export interface ConceptChipProps {
  /** Key into `states`. Defaults to the first key. */
  state?: string;
  /** State token map, keyed in progression order (first = initial, last = terminal). Defaults to CONCEPT_STATES, whose labels are TODO:VB placeholders. */
  states?: Record<string, ConceptState>;
  /** Chip title shown before the state label. Grounded copy from the product's chip; not a placeholder. */
  title?: string;
  /** Reduced-motion summary: joins every state label with arrows. */
  summary?: boolean;
}
export declare const CONCEPT_STATES: Record<string, ConceptState>;
export declare function ConceptChip(props: ConceptChipProps): JSX.Element;
