// SAMPLE DATA. Redacted by the site lane on 2026-09-15, before karkalabs-site went public: this kit shipped
// with a real student's reports. No real student data in a public repo. The same fix is needed upstream in Claude Design.
const SESSIONS = [
  {
    date: 'Sample report',
    chips: [{ label: 'Sample data', kind: 'flag' }],
    summary: 'After every session, a plain-English report: what was learned, the questions asked, and where the evidence is still thin.',
    cols: [
      { h: 'What they learned', body: 'Speed vs velocity, Acceleration definition, Motion graph interpretation' },
    ],
    next: null,
  },
];

function Chip({ label, kind }) {
  const styles = {
    metric: { background: 'var(--color-sage-tint)', color: 'var(--color-sage-deep)', border: '1px solid var(--color-sage-tint)' },
    flag: { background: 'var(--color-board)', color: 'var(--color-ink-muted)', border: '1px solid var(--color-line)' },
    good: { background: 'var(--color-board)', color: 'var(--color-sage-deep)', border: '1px solid var(--color-line)' },
  }[kind];
  return <span style={{ display: 'inline-flex', alignItems: 'center', minHeight: 30, borderRadius: 'var(--radius-pill)', padding: '0 12px', fontSize: 'var(--text-caption)', fontWeight: 600, ...styles }}>{label}</span>;
}

function Label({ children }) {
  return <p style={{ margin: 0, fontSize: 'var(--text-eyebrow)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--color-ink-muted)' }}>{children}</p>;
}

function SessionCard({ s }) {
  return (
    <article style={{ borderRadius: 'var(--radius-card)', border: '1px solid var(--color-line)', background: 'var(--color-paper)', padding: '24px 28px', display: 'grid', gap: 18 }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
        <strong style={{ fontSize: '1.125rem' }}>{s.date}</strong>
        <span style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>{s.chips.map((c) => <Chip key={c.label} {...c} />)}</span>
      </header>
      <p style={{ margin: 0, lineHeight: 'var(--leading-body)' }}>{s.summary}</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 24 }}>
        {s.cols.map((c) => (
          <div key={c.h} style={{ display: 'grid', gap: 6, alignContent: 'start' }}>
            <Label>{c.h}</Label>
            <p style={{ margin: 0, color: 'var(--color-ink)', lineHeight: 'var(--leading-body)' }}>{c.body}</p>
          </div>
        ))}
      </div>
      {s.next && (
        <div style={{ borderRadius: 'var(--radius-field)', border: '1px solid var(--color-line)', background: 'var(--color-board)', padding: '14px 18px', display: 'grid', gap: 6 }}>
          <Label>Suggested next session</Label>
          <p style={{ margin: 0, lineHeight: 'var(--leading-body)' }}>{s.next}</p>
        </div>
      )}
    </article>
  );
}

function ParentDashboard() {
  return (
    <div style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-ink)', minHeight: '100vh' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '20px 40px' }}>
        <p style={{ margin: 0, fontSize: '1.25rem', fontWeight: 700 }}>Karka<span style={{ color: 'var(--color-sage)' }}>Labs</span> <span style={{ fontWeight: 400, color: 'var(--color-ink-muted)' }}>· Parent</span></p>
        <p style={{ margin: 0, fontSize: 'var(--text-caption)', color: 'var(--color-ink-muted)' }}>vinodh@example.com &nbsp; <a href="#" style={{ color: 'var(--color-ink)', fontWeight: 600 }}>Sign out</a></p>
      </header>
      <main style={{ maxWidth: 1040, margin: '0 auto', padding: '24px var(--spacing-gutter) 80px', display: 'grid', gap: 22 }}>
        <div>
          <h1 style={{ margin: 0, fontFamily: 'var(--font-display)', fontSize: '2.5rem', fontWeight: 600, letterSpacing: 'var(--tracking-display)' }}>Learning <span style={{ color: 'var(--color-sage)' }}>progress</span></h1>
          <p style={{ margin: '6px 0 0', color: 'var(--color-ink-muted)' }}>Recent one-to-one tutoring sessions.</p>
        </div>
        <p style={{ margin: '8px 0 0', fontSize: '1.375rem', fontWeight: 700 }}>Your child <span style={{ fontSize: 'var(--text-caption)', fontWeight: 400, color: 'var(--color-ink-muted)' }}>O-Level Physics</span></p>
        {SESSIONS.map((s) => <SessionCard key={s.date} s={s} />)}
      </main>
    </div>
  );
}
window.ParentDashboard = ParentDashboard;
