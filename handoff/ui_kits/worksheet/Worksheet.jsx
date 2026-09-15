const { Button } = window.KarkaLabsDesignSystem_0a4ecd;
const { useState } = React;

const wsWrap = { maxWidth: 760, margin: '0 auto', padding: '40px var(--spacing-gutter)', fontFamily: 'var(--font-sans)', color: 'var(--color-ink)' };
const panel = { borderRadius: 'var(--radius-card)', background: 'var(--color-paper)', padding: '24px 28px', display: 'grid', gap: 16 };

function StepTabs({ current, labels }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${labels.length},1fr)`, gap: 14 }}>
      {labels.map((l, i) => (
        <span key={l} style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 40,
          borderRadius: 'var(--radius-field)', fontSize: 'var(--text-body)',
          fontWeight: i === current ? 600 : 400,
          background: i === current ? 'var(--color-board)' : 'var(--color-olive-tint)',
          border: i === current ? '1.5px solid var(--color-sage-deep)' : '1px solid transparent',
          color: i === current ? 'var(--color-ink)' : 'var(--color-ink-muted)',
        }}>{l}</span>
      ))}
    </div>
  );
}

function RadioCard({ title, body, note, disabled, checked, onSelect }) {
  return (
    <label style={{
      display: 'grid', gridTemplateColumns: '24px 1fr', gap: 14, padding: '18px 20px',
      borderRadius: 'var(--radius-field)', cursor: disabled ? 'not-allowed' : 'pointer',
      background: disabled ? 'var(--color-olive-tint)' : 'var(--color-board)',
      border: disabled ? '1px dashed var(--color-line)' : `1px solid ${checked ? 'var(--color-sage-deep)' : 'var(--color-line)'}`,
    }}>
      <input type="radio" name="src" disabled={disabled} checked={!!checked} onChange={onSelect} style={{ width: 20, height: 20, marginTop: 2, accentColor: '#4f6139' }} />
      <span style={{ display: 'grid', gap: 4 }}>
        <span style={{ fontWeight: 600, fontSize: '1.0625rem', color: disabled ? 'var(--color-ink-muted)' : 'var(--color-ink)' }}>{title}</span>
        <span style={{ fontSize: 'var(--text-body)', color: 'var(--color-ink-muted)' }}>{body}</span>
        {note && <span style={{ borderLeft: '3px solid var(--color-olive)', paddingLeft: 12, marginTop: 6, fontSize: 'var(--text-body)', color: 'var(--color-ink-muted)', lineHeight: 1.5 }}>{note}</span>}
      </span>
    </label>
  );
}

const LAWYER = "We can't accept this one yet. Whether we're allowed to process a worksheet somebody else published is still being checked with a lawyer, and we'd rather wait for that answer than guess.";

function FrontDoor({ onContinue }) {
  const [pick, setPick] = useState(null);
  return (
    <div style={{ display: 'grid', gap: 22 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>Add a worksheet</h1>
        <p style={{ margin: '4px 0 0', color: 'var(--color-ink-muted)' }}>Signed in as Priya</p>
      </div>
      <StepTabs current={0} labels={["Where it's from", 'What we do with it', 'Which kind']} />
      <div style={panel}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.375rem', fontWeight: 700 }}>Where did this worksheet come from?</h2>
          <p style={{ margin: '6px 0 0', fontSize: 'var(--text-lead)', color: 'var(--color-ink-muted)' }}>We ask because it decides whether we're allowed to use it at all.</p>
        </div>
        <RadioCard title="I made it myself" body="You wrote these questions — your own revision notes or practice." checked={pick === 'own'} onSelect={() => setPick('own')} />
        <RadioCard title="My school or tutor gave it to me" body="A sheet handed out in class or at tuition." checked={pick === 'school'} onSelect={() => setPick('school')} />
        <RadioCard title="It's from a textbook or past paper" body="A published book, workbook or exam paper." note={LAWYER} disabled />
        <RadioCard title="I'm not sure where it's from" body="Honest is better than a guess — but we can't take it yet either." note={LAWYER} disabled />
        <div><Button disabled={!pick} onClick={onContinue} style={{ borderRadius: 'var(--radius-field)' }}>Continue</Button></div>
      </div>
    </div>
  );
}

function Router({ onContinue, onBack }) {
  const [pick, setPick] = useState(null);
  return (
    <div style={{ display: 'grid', gap: 22 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>Add a worksheet</h1>
        <p style={{ margin: '4px 0 0', color: 'var(--color-ink-muted)' }}>Signed in as Priya</p>
      </div>
      <StepTabs current={1} labels={["Where it's from", 'What we do with it', 'Which kind']} />
      <div style={panel}>
        <h2 style={{ margin: 0, fontSize: '1.375rem', fontWeight: 700 }}>Have you done this worksheet yet?</h2>
        <RadioCard title="I've already done it" body="Your written answers are on the sheet — we mark what you wrote." checked={pick === 'done'} onSelect={() => setPick('done')} />
        <RadioCard title="It's still blank" body="NOT READY YET — working on this one. No date to promise." disabled />
        <div style={{ display: 'flex', gap: 10 }}>
          <Button variant="chip" onClick={onBack} style={{ borderRadius: 'var(--radius-field)' }}>Back</Button>
          <Button disabled={!pick} onClick={onContinue} style={{ borderRadius: 'var(--radius-field)' }}>Continue</Button>
        </div>
      </div>
    </div>
  );
}

function Answer({ text, tint }) {
  const bg = { green: '#e7f0e2', cream: '#f6efd9', blue: '#dfe8f5', purple: '#f0e6f5' }[tint];
  return <div style={{ background: bg, borderRadius: 'var(--radius-field)', padding: '18px 20px' }}><code style={{ fontFamily: 'var(--font-mono)', fontSize: '1.0625rem' }}>{text}</code></div>;
}

function MarkCard({ q, status, children, accent }) {
  return (
    <section style={{
      borderRadius: 'var(--radius-card)', background: 'var(--color-paper)', padding: '20px 24px',
      borderLeft: accent ? '4px solid var(--color-sage-deep)' : undefined,
      border: accent ? undefined : '1px solid var(--color-line)', display: 'grid', gap: 14,
      ...(accent ? { border: '1px solid var(--color-line)', borderLeft: '4px solid var(--color-sage-deep)' } : null),
    }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <strong style={{ fontSize: '1.125rem' }}>{q}</strong>
        <span style={{ fontSize: 'var(--text-caption)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase', color: 'var(--color-ink-muted)' }}>{status}</span>
      </header>
      {children}
    </section>
  );
}

function Mark({ ok, children }) {
  return <p style={{ margin: 0, display: 'flex', gap: 10, fontSize: 'var(--text-body)' }}><span style={{ color: ok ? 'var(--color-sage-deep)' : '#8a6d1f', fontWeight: 700 }}>{ok ? '✓' : '✗'}</span>{children}</p>;
}

function Results({ onBack }) {
  return (
    <div style={{ display: 'grid', gap: 22 }}>
      <div>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>Your marked worksheet</h1>
        <p style={{ margin: '6px 0 0', fontSize: 'var(--text-lead)', color: 'var(--color-ink-muted)', maxWidth: '58ch' }}>2 of 3 on the one question we could mark. 1 more was marked by the backup marker and is shown but not counted. 1 not marked yet.</p>
      </div>
      <MarkCard q="3(a)" status="2 / 3" accent>
        <Answer text="v = 12 m/s" tint="green" />
        <Mark ok>Correct method: v = u + at</Mark>
        <Mark ok>Correct value, 12</Mark>
        <Mark>Unit missing on the final answer</Mark>
      </MarkCard>
      <MarkCard q="4" status="Waiting for a teacher">
        <Answer text="a = 3.0" tint="cream" />
        <p style={{ margin: 0, color: 'var(--color-ink-muted)', lineHeight: 1.55 }}>We don't have a reviewed mark scheme for this one yet, so it's waiting for a teacher. It hasn't been marked right or wrong — nothing is counted either way.</p>
        <p style={{ margin: 0, borderLeft: '3px solid var(--color-line)', paddingLeft: 12, fontSize: 'var(--text-caption)', color: 'var(--color-ink-muted)' }}>Two bank items scored too near each other to tell them apart.</p>
      </MarkCard>
      <MarkCard q="5" status="Shown, not counted">
        <Answer text="E = 1/2 mv^2" tint="blue" />
        <p style={{ margin: 0, color: 'var(--color-ink-muted)', lineHeight: 1.55 }}>This one was marked by our backup marker, which checks for keywords rather than reading the physics. We're showing you what it found, but we're not counting it towards a score — it isn't accurate enough for that.</p>
        <Mark>Unit missing on the final answer</Mark>
      </MarkCard>
      <MarkCard q="6(b)" status="Not marked yet">
        <Answer text="R = 4.0 ohm" tint="purple" />
        <p style={{ margin: 0, color: 'var(--color-ink-muted)', lineHeight: 1.55 }}>Marking is busy and this one is still queued. It hasn't been marked wrong — it just hasn't been marked yet.</p>
      </MarkCard>
      <div style={{ borderTop: '1px solid var(--color-line)', paddingTop: 18, display: 'grid', gap: 8 }}>
        <p style={{ margin: 0, fontSize: 'var(--text-caption)', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>How this was marked</p>
        <p style={{ margin: 0, fontSize: 'var(--text-body)', color: 'var(--color-ink-muted)' }}>Marked from a photograph of your own handwriting, not from typed answers.</p>
        <p style={{ margin: 0, fontSize: 'var(--text-body)', color: 'var(--color-ink-muted)' }}>You confirmed what we read before anything was marked.</p>
        <p style={{ margin: 0, fontSize: 'var(--text-body)', fontWeight: 600 }}>Our mark schemes have been checked by automated review and by their author — not by a qualified teacher.</p>
      </div>
      <div><Button variant="chip" onClick={onBack} style={{ borderRadius: 'var(--radius-field)' }}>Start over</Button></div>
    </div>
  );
}

function WorksheetApp() {
  const [step, setStep] = useState(0);
  return (
    <main style={wsWrap} data-screen-label={['Front door', 'Router', 'Results'][step]}>
      {step === 0 && <FrontDoor onContinue={() => setStep(1)} />}
      {step === 1 && <Router onBack={() => setStep(0)} onContinue={() => setStep(2)} />}
      {step === 2 && <Results onBack={() => setStep(0)} />}
    </main>
  );
}
window.WorksheetApp = WorksheetApp;
