import type { ReactNode } from 'react';

/**
 * The Karka board's visual chrome — adopted from handoff/components/board/BoardFrame.jsx: board
 * surface (the product's scene ground, 20px radius, the one deep shadow), caption track (tutor
 * eyebrow + current line), voice toggle. Purely presentational; all behaviour stays in KarkaEmbed.
 * Site additions: `poster` carries loading/visibility attrs, `captionLabel` overrides the caption
 * eyebrow (the classroom hold), `voiceNote` sits beside the voice button, and without `aspect` the
 * frame is 4/3 on mobile, 16/10 from lg (the bundle's documented site values).
 */
export interface BoardPoster {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Decorative while the live board covers it. */
  hidden?: boolean;
}

const tones = {
  ink: { card: 'bg-on-ink/6 text-on-ink', tutor: 'text-teal-on-ink' },
  paper: { card: 'border border-line bg-board text-ink', tutor: 'text-teal' },
} as const;

export function BoardFrame({
  poster,
  tutor = 'Aarya',
  captionLabel,
  caption,
  tone = 'ink',
  showVoice = false,
  voiceOn = false,
  onToggleVoice,
  voiceNote,
  aspect,
  surface = 'scene',
  children,
}: {
  poster?: BoardPoster;
  tutor?: string;
  captionLabel?: string;
  /** Current narration line. Omit to hide the caption track. */
  caption?: ReactNode;
  tone?: 'ink' | 'paper';
  showVoice?: boolean;
  voiceOn?: boolean;
  onToggleVoice?: () => void;
  voiceNote?: ReactNode;
  aspect?: string;
  /** 'scene' = the real board's pale blue-grey ground; 'white' = bg-board. */
  surface?: 'scene' | 'white';
  children?: ReactNode;
}) {
  const t = tones[tone];
  return (
    <div>
      <div
        className={`relative overflow-hidden rounded-board shadow-board ${surface === 'white' ? 'bg-board' : 'bg-scene'} ${
          aspect ? '' : 'aspect-4/3 lg:aspect-16/10'
        }`}
        style={aspect ? { aspectRatio: aspect } : undefined}
      >
        {poster && (
          <img
            src={poster.src}
            alt={poster.hidden ? '' : poster.alt}
            aria-hidden={poster.hidden || undefined}
            width={poster.width}
            height={poster.height}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 size-full object-cover"
          />
        )}
        {children}
      </div>
      {caption !== undefined && (
        <div className={`mt-4 min-h-28 rounded-card p-4 ${t.card}`} aria-live="polite" data-caption-track>
          <p className={`text-eyebrow font-semibold uppercase tracking-eyebrow ${t.tutor}`}>{captionLabel ?? tutor}</p>
          {caption}
        </div>
      )}
      {showVoice && (
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={onToggleVoice}
            aria-pressed={voiceOn}
            className="inline-flex min-h-hit-target-lg cursor-pointer items-center gap-2 rounded-pill bg-teal-deep px-5 text-body font-semibold text-on-ink transition-colors duration-(--dur-fast) ease-karka-out hover:bg-teal-press"
          >
            <SpeakerIcon on={voiceOn} />
            {voiceOn ? `Mute ${tutor}` : `Hear ${tutor}`}
          </button>
          {voiceNote}
        </div>
      )}
    </div>
  );
}

function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
      {on ? <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" strokeLinecap="round" /> : <path d="M17 9l5 6M22 9l-5 6" strokeLinecap="round" />}
    </svg>
  );
}
