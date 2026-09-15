import { AnimatePresence, m } from 'framer-motion';
import { duration, ease, nudge } from '../design/tokens';
import { CONCEPT_STATES, type ConceptState } from '../product/mastery';

/**
 * Concept-state chip — adopted from handoff/components/board/ConceptChip.jsx (props verbatim).
 * Labels and colours come from the state map, never hard-coded; the map is filled from the board
 * (src/product/mastery.ts). `summary` joins every label in `states` — pass the scene's journey.
 * The label cross-fade is the site's (reduced motion honoured by MotionConfig).
 */
export function ConceptChip({
  state,
  states = CONCEPT_STATES,
  title = 'Concept state',
  summary = false,
}: {
  state?: string;
  states?: Record<string, ConceptState>;
  title?: string;
  summary?: boolean;
}) {
  const keys = Object.keys(states);
  const key = state && states[state] ? state : keys[0]!;
  const s = states[key]!;
  return (
    <p
      aria-live="polite"
      data-concept-state={summary ? 'summary' : key}
      className="inline-flex min-h-8 items-center gap-2 rounded-pill border px-3 text-caption font-semibold transition-colors duration-(--dur-base) ease-karka-out"
      style={{ background: s.bg, color: s.fg, borderColor: s.border }}
    >
      <span className="size-2 rounded-full" style={{ background: s.dot }} aria-hidden="true" />
      <span style={{ color: s.titleFg ?? s.fg }}>{title}</span>
      {summary ? (
        <span>{keys.map((k) => states[k]!.label).join(' → ')}</span>
      ) : (
        <AnimatePresence mode="wait" initial={false}>
          <m.span
            key={key}
            initial={{ opacity: 0, y: nudge.sm }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -nudge.sm }}
            transition={{ duration: duration.fast, ease: ease.out }}
          >
            {s.label}
          </m.span>
        </AnimatePresence>
      )}
    </p>
  );
}
