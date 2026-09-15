const { BoardFrame, ConceptChip, StepProgress, Eyebrow, Button, LeadForm, WhatsAppCta, TodoCopy } = window.KarkaLabsDesignSystem_0a4ecd;
const { useState } = React;

const CAPTIONS = [
  'A ball is launched at an angle. Let’s follow its path, and its velocity, the whole way.',
  'Its velocity has two parts: one across, one up. Keep an eye on both.',
  'Gravity only pulls down. So only the upward part shrinks as the ball rises.',
  'You said the ball stops at the top. Let’s check that on the board.',
  'At the top, only the upward part is zero. The across part never changed, so it keeps moving.',
  'That’s why the path is a curve, not straight up and down. Now you’ve got it.',
];

const wrap = { maxWidth: 1152, margin: '0 auto', padding: '0 var(--spacing-gutter-lg)' };
const h2Style = { margin: 0, fontFamily: 'var(--font-display)', fontSize: 'var(--text-h2)', lineHeight: 'var(--leading-h2)', letterSpacing: 'var(--tracking-display)', fontWeight: 600, textWrap: 'balance' };

function ParabolaScene({ step }) {
  // Trajectory ends inboard of the viewBox and just above the baseline, so the +44px velocity
  // arrow at the final step clears both the right edge (430+44=474 < 476) and the y=210 axis.
  const pts = [[40, 206], [105, 120], [170, 70], [235, 52], [300, 70], [365, 120], [430, 196]];
  const shown = Math.max(2, Math.ceil((step / 6) * pts.length));
  const d = pts.slice(0, shown).map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ');
  const ball = pts[Math.min(shown - 1, pts.length - 1)];
  return (
    <svg viewBox="0 0 500 260" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden="true">
      <line x1="24" y1="210" x2="476" y2="210" stroke="#9fbccd" strokeWidth="1.5" />
      <line x1="40" y1="230" x2="40" y2="36" stroke="#9fbccd" strokeWidth="1.5" />
      <path d={d} fill="none" stroke="#147d7b" strokeWidth="2.5" strokeLinecap="round" style={{ transition: 'all var(--dur-base) var(--ease-karka-out)' }} />
      <circle cx={ball[0]} cy={ball[1]} r="7" fill="#0f6564" style={{ transition: 'all var(--dur-base) var(--ease-karka-out)' }} />
      <line x1={ball[0]} y1={ball[1]} x2={ball[0] + 44} y2={ball[1]} stroke="#b66b13" strokeWidth="2.5" style={{ transition: 'all var(--dur-base) var(--ease-karka-out)' }} />
      {step < 5 && <line x1={ball[0]} y1={ball[1]} x2={ball[0]} y2={ball[1] - (step >= 3 ? 20 : 40)} stroke="#147d7b" strokeWidth="2.5" style={{ transition: 'all var(--dur-base) var(--ease-karka-out)' }} />}
    </svg>
  );
}

function Hero() {
  return (
    <section style={{ position: 'relative', overflow: 'hidden' }}>
      <div className="board-grid" aria-hidden="true" style={{ position: 'absolute', inset: 0 }}></div>
      <div style={{ ...wrap, position: 'relative', display: 'flex', minHeight: 420, flexDirection: 'column', justifyContent: 'flex-end', gap: 24, paddingTop: 32, paddingBottom: 60 }}>
        <Eyebrow>Diya and Aarya listen, understand and guide</Eyebrow>
        <h1 style={{ ...h2Style, fontSize: 'var(--text-display)', lineHeight: 'var(--leading-display)', maxWidth: 760 }}>Real-time, human-like voice tutors</h1>
        <p style={{ margin: 0, maxWidth: '65ch', fontSize: 'var(--text-lead)', lineHeight: 'var(--leading-lead)', color: 'var(--color-ink-muted)' }}>Learn with AI, not from AI.</p>
        <nav aria-label="Who Karka is for">
          <ul style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: 0, padding: 0, listStyle: 'none' }}>
            {[['students', 'Students'], ['parents', 'Parents'], ['schools', 'Schools'], ['tuition', 'Tuition centres']].map(([id, label]) => (
              <li key={id}><Button variant="chip" size="md" href={'#' + id}>{label}</Button></li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}

function Students() {
  const [step, setStep] = useState(1);
  const total = CAPTIONS.length;
  return (
    <section id="students" data-screen-label="Students" style={{ background: 'var(--color-ink)', color: 'var(--color-on-ink)', padding: 'var(--spacing-section) 0' }}>
      <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)', gap: 56, alignItems: 'center' }}>
        <header style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <Eyebrow tone="ink">For students</Eyebrow>
          <h2 style={h2Style}>You say it. Aarya catches it. The board redraws it.</h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 12 }}>
            <ConceptChip state={step === total ? 'terminal' : 'initial'} />
            <StepProgress current={step} total={total} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="accent" size="md" tone="ink" disabled={step === 1} onClick={() => setStep((s) => Math.max(1, s - 1))}>Back</Button>
            <Button variant="accent" size="md" tone="ink" disabled={step === total} onClick={() => setStep((s) => Math.min(total, s + 1))}>Next step</Button>
          </div>
        </header>
        <BoardFrame tutor="Aarya" tone="ink" aspect="16/10" caption={CAPTIONS[step - 1]} showVoice>
          <ParabolaScene step={step} />
        </BoardFrame>
      </div>
    </section>
  );
}

function Stub({ id, label, eyebrow, children, poster, alt }) {
  return (
    <section id={id} data-screen-label={label} style={{ borderTop: '1px solid var(--color-line)', padding: 'var(--spacing-section) 0' }}>
      <div style={{ ...wrap, display: 'grid', gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)', gap: 56, alignItems: 'center' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <Eyebrow>{eyebrow}</Eyebrow>
          <h2 style={h2Style}>{label}</h2>
          <TodoCopy owner="TODO:VB" what="headline and section copy" />
          {children}
        </div>
        <BoardFrame tone="paper" aspect="4/3" poster={poster} alt={alt}></BoardFrame>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ background: 'var(--color-ink)', padding: '40px 0' }}>
      <div style={{ ...wrap, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
        <img src="../../assets/brand/wordmark-on-dark.png" alt="KarkaLabs" style={{ height: 26, width: 'auto' }} />
        <p style={{ margin: 0, fontSize: 'var(--text-caption)', color: 'var(--color-on-ink-muted)', fontFamily: 'var(--font-sans)' }}>Learn with AI, not from AI.</p>
      </div>
    </footer>
  );
}

function Website() {
  return (
    <main style={{ fontFamily: 'var(--font-sans)', color: 'var(--color-ink)' }}>
      <Hero />
      <Students />
      <Stub id="parents" label="Parents" eyebrow="For parents" poster="../../assets/imagery/student-hero.png" alt="A Karka lesson on screen: a 3D bus ride demonstrating Newton’s first law.">
        <WhatsAppCta number={null} />
      </Stub>
      <Stub id="schools" label="Schools" eyebrow="For schools" poster="../../assets/imagery/student-hero.png" alt="The Karka principal view: campus-wide curriculum coverage.">
        <LeadForm orgLabel="School" />
      </Stub>
      <Stub id="tuition" label="Tuition centres" eyebrow="For tuition centres" poster="../../assets/imagery/student-hero.png" alt="The Karka mastery board: O-Level Physics topics as nodes.">
        <LeadForm orgLabel="Centre" />
      </Stub>
      <Footer />
    </main>
  );
}
window.Website = Website;
