import React from 'react';

function SpeakerIcon({ on }) {
  return (
    <svg viewBox="0 0 24 24" style={{ width: '1.25rem', height: '1.25rem' }} fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" stroke="none" />
      {on ? <path d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12" strokeLinecap="round" /> : <path d="M17 9l5 6M22 9l-5 6" strokeLinecap="round" />}
    </svg>
  );
}

const tones = {
  ink: { card: { background: 'rgb(244 243 238 / 0.06)', color: 'var(--color-on-ink)' }, tutor: { color: 'var(--color-teal-on-ink)' } },
  paper: { card: { background: 'var(--color-board)', color: 'var(--color-ink)', border: '1px solid var(--color-line)' }, tutor: { color: 'var(--color-teal)' } },
};

/**
 * The Karka board's visual chrome: board surface (pale blue-grey scene ground sampled from the
 * product board, 20px radius, the one deep shadow in the system) + caption track (tutor eyebrow +
 * current line) + voice toggle.
 */
export function BoardFrame({ poster, alt = '', tutor = 'Aarya', caption, tone = 'ink', showVoice = false, voiceOn = false, onToggleVoice, aspect = '16/10', surface = 'scene', children }) {
  const t = tones[tone];
  const [hoverVoice, setHoverVoice] = React.useState(false);
  return (
    <div style={{ fontFamily: 'var(--font-sans)' }}>
      <div style={{ position: 'relative', aspectRatio: aspect, overflow: 'hidden', borderRadius: 'var(--radius-board)', background: surface === 'white' ? 'var(--color-board)' : 'var(--color-scene)', boxShadow: 'var(--shadow-board)' }}>
        {poster && <img src={poster} alt={alt} loading="lazy" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
        {children}
      </div>
      {caption && (
        <div style={{ marginTop: '1rem', minHeight: '7rem', borderRadius: 'var(--radius-card)', padding: '1rem', ...t.card }} aria-live="polite">
          <p style={{ margin: 0, fontSize: 'var(--text-eyebrow)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 'var(--tracking-eyebrow)', ...t.tutor }}>{tutor}</p>
          <p style={{ margin: '0.375rem 0 0', fontSize: 'var(--text-lead)', lineHeight: 'var(--leading-lead)', textWrap: 'pretty' }}>{caption}</p>
        </div>
      )}
      {showVoice && (
        <button type="button" onClick={onToggleVoice} aria-pressed={voiceOn} onMouseEnter={() => setHoverVoice(true)} onMouseLeave={() => setHoverVoice(false)} style={{
          marginTop: '0.75rem', display: 'inline-flex', minHeight: 'var(--hit-target-lg)', alignItems: 'center', gap: '0.5rem',
          borderRadius: 'var(--radius-pill)', background: hoverVoice ? 'var(--color-teal-press)' : 'var(--color-teal-deep)', padding: '0 1.25rem', border: 'none', cursor: 'pointer',
          fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--color-on-ink)', fontFamily: 'var(--font-sans)',
          transition: 'background-color var(--dur-fast) var(--ease-karka-out)',
        }}>
          <SpeakerIcon on={voiceOn} />
          {voiceOn ? `Mute ${tutor}` : `Hear ${tutor}`}
        </button>
      )}
    </div>
  );
}
