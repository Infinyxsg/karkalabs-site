/**
 * The Karka board frame: white board surface + caption track + voice toggle.
 * @startingPoint section="Components" subtitle="The board surface with caption track" viewport="700x420"
 */
export interface BoardFrameProps {
  /** Poster image URL shown on the board surface. */
  poster?: string;
  alt?: string;
  /** Tutor name shown as the caption eyebrow: Aarya, Diya, Ethan. */
  tutor?: string;
  /** Current narration line. Omit to hide the caption track. */
  caption?: React.ReactNode;
  /** Ground the frame sits on: 'ink' (on-ink/6 caption card) or 'paper' (white bordered card). Tutor eyebrow is teal on both. */
  tone?: 'ink' | 'paper';
  showVoice?: boolean;
  voiceOn?: boolean;
  onToggleVoice?: () => void;
  /** CSS aspect-ratio; site uses 4/3 mobile, 16/10 desktop. */
  aspect?: string;
  /** Board surface: 'scene' (default) = the real board's pale blue-grey #EEF2F4, sampled from product stills; 'white' = the marketing embed's bg-board. */
  surface?: 'scene' | 'white';
  /** Custom board content instead of / over the poster. */
  children?: React.ReactNode;
}
export declare function BoardFrame(props: BoardFrameProps): JSX.Element;
