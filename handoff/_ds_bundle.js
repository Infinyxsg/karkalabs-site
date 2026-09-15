/* @ds-bundle: {"format":4,"namespace":"KarkaLabsDesignSystem_0a4ecd","components":[{"name":"BoardFrame","sourcePath":"components/board/BoardFrame.jsx"},{"name":"CONCEPT_STATES","sourcePath":"components/board/ConceptChip.jsx"},{"name":"ConceptChip","sourcePath":"components/board/ConceptChip.jsx"},{"name":"StepProgress","sourcePath":"components/board/StepProgress.jsx"},{"name":"Eyebrow","sourcePath":"components/content/Eyebrow.jsx"},{"name":"TodoCopy","sourcePath":"components/content/TodoCopy.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Field","sourcePath":"components/forms/Field.jsx"},{"name":"LeadForm","sourcePath":"components/forms/LeadForm.jsx"},{"name":"WhatsAppCta","sourcePath":"components/forms/WhatsAppCta.jsx"}],"sourceHashes":{"components/board/BoardFrame.jsx":"d168e5f05d31","components/board/ConceptChip.jsx":"b11d88470ab9","components/board/StepProgress.jsx":"61fe3569cdc8","components/content/Eyebrow.jsx":"541e7d44611c","components/content/TodoCopy.jsx":"c654478a451f","components/core/Button.jsx":"2ab6ed07337e","components/forms/Field.jsx":"b02875c22105","components/forms/LeadForm.jsx":"302ad806df21","components/forms/WhatsAppCta.jsx":"0ddeba2de109","ui_kits/parent_dashboard/ParentDashboard.jsx":"c851df3a6ad7","ui_kits/website/Website.jsx":"5bdd3b68954f","ui_kits/worksheet/Worksheet.jsx":"90e7823d7256"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.KarkaLabsDesignSystem_0a4ecd = window.KarkaLabsDesignSystem_0a4ecd || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/board/BoardFrame.jsx
try { (() => {
function SpeakerIcon({
  on
}) {
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 24 24",
    style: {
      width: '1.25rem',
      height: '1.25rem'
    },
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("path", {
    d: "M4 9v6h4l5 4V5L8 9H4z",
    fill: "currentColor",
    stroke: "none"
  }), on ? /*#__PURE__*/React.createElement("path", {
    d: "M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12",
    strokeLinecap: "round"
  }) : /*#__PURE__*/React.createElement("path", {
    d: "M17 9l5 6M22 9l-5 6",
    strokeLinecap: "round"
  }));
}
const tones = {
  ink: {
    card: {
      background: 'rgb(244 243 238 / 0.06)',
      color: 'var(--color-on-ink)'
    },
    tutor: {
      color: 'var(--color-teal-on-ink)'
    }
  },
  paper: {
    card: {
      background: 'var(--color-board)',
      color: 'var(--color-ink)',
      border: '1px solid var(--color-line)'
    },
    tutor: {
      color: 'var(--color-teal)'
    }
  }
};

/**
 * The Karka board's visual chrome: board surface (pale blue-grey scene ground sampled from the
 * product board, 20px radius, the one deep shadow in the system) + caption track (tutor eyebrow +
 * current line) + voice toggle.
 */
function BoardFrame({
  poster,
  alt = '',
  tutor = 'Aarya',
  caption,
  tone = 'ink',
  showVoice = false,
  voiceOn = false,
  onToggleVoice,
  aspect = '16/10',
  surface = 'scene',
  children
}) {
  const t = tones[tone];
  const [hoverVoice, setHoverVoice] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      aspectRatio: aspect,
      overflow: 'hidden',
      borderRadius: 'var(--radius-board)',
      background: surface === 'white' ? 'var(--color-board)' : 'var(--color-scene)',
      boxShadow: 'var(--shadow-board)'
    }
  }, poster && /*#__PURE__*/React.createElement("img", {
    src: poster,
    alt: alt,
    loading: "lazy",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover'
    }
  }), children), caption && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: '1rem',
      minHeight: '7rem',
      borderRadius: 'var(--radius-card)',
      padding: '1rem',
      ...t.card
    },
    "aria-live": "polite"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-eyebrow)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      ...t.tutor
    }
  }, tutor), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '0.375rem 0 0',
      fontSize: 'var(--text-lead)',
      lineHeight: 'var(--leading-lead)',
      textWrap: 'pretty'
    }
  }, caption)), showVoice && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: onToggleVoice,
    "aria-pressed": voiceOn,
    onMouseEnter: () => setHoverVoice(true),
    onMouseLeave: () => setHoverVoice(false),
    style: {
      marginTop: '0.75rem',
      display: 'inline-flex',
      minHeight: 'var(--hit-target-lg)',
      alignItems: 'center',
      gap: '0.5rem',
      borderRadius: 'var(--radius-pill)',
      background: hoverVoice ? 'var(--color-teal-press)' : 'var(--color-teal-deep)',
      padding: '0 1.25rem',
      border: 'none',
      cursor: 'pointer',
      fontSize: 'var(--text-body)',
      fontWeight: 600,
      color: 'var(--color-on-ink)',
      fontFamily: 'var(--font-sans)',
      transition: 'background-color var(--dur-fast) var(--ease-karka-out)'
    }
  }, /*#__PURE__*/React.createElement(SpeakerIcon, {
    on: voiceOn
  }), voiceOn ? `Mute ${tutor}` : `Hear ${tutor}`));
}
Object.assign(__ds_scope, { BoardFrame });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/board/BoardFrame.jsx", error: String((e && e.message) || e) }); }

// components/board/ConceptChip.jsx
try { (() => {
/**
 * Mastery-state token map. The product's real vocabulary is not yet supplied — every label here is
 * a TODO:VB placeholder and MUST NOT be shipped as copy. Override via the `states` prop, or edit
 * this map once the site session reports the real mastery terms.
 */
const CONCEPT_STATES = {
  initial: {
    label: 'TODO:VB',
    fg: 'var(--color-on-ink)',
    titleFg: 'var(--color-on-ink-muted)',
    bg: 'transparent',
    border: 'rgb(244 243 238 / 0.25)',
    dot: 'var(--color-teal-on-ink)'
  },
  terminal: {
    label: 'TODO:VB',
    fg: 'var(--color-sage-deep)',
    titleFg: 'var(--color-sage-deep)',
    bg: 'var(--color-sage-tint)',
    border: 'var(--color-sage-tint)',
    dot: 'var(--color-sage-deep)'
  }
};

/** Concept-state chip. Labels and colours come from a state map, never hard-coded. */
function ConceptChip({
  state = 'initial',
  states = CONCEPT_STATES,
  title = 'Concept state',
  summary = false
}) {
  const keys = Object.keys(states);
  const s = states[state] || states[keys[0]];
  return /*#__PURE__*/React.createElement("p", {
    "aria-live": "polite",
    "data-concept-state": summary ? 'summary' : state,
    style: {
      margin: 0,
      display: 'inline-flex',
      minHeight: '2rem',
      alignItems: 'center',
      gap: '0.5rem',
      borderRadius: 'var(--radius-pill)',
      padding: '0 0.75rem',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-caption)',
      fontWeight: 600,
      background: s.bg,
      color: s.fg,
      border: `1px solid ${s.border}`,
      transition: 'background-color var(--dur-base) var(--ease-karka-out), border-color var(--dur-base) var(--ease-karka-out), color var(--dur-base) var(--ease-karka-out)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: '0.5rem',
      height: '0.5rem',
      borderRadius: '50%',
      background: s.dot
    },
    "aria-hidden": "true"
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      color: s.titleFg || s.fg
    }
  }, title), /*#__PURE__*/React.createElement("span", null, summary ? keys.map(k => states[k].label).join(' → ') : s.label));
}
Object.assign(__ds_scope, { CONCEPT_STATES, ConceptChip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/board/ConceptChip.jsx", error: String((e && e.message) || e) }); }

// components/board/StepProgress.jsx
try { (() => {
/** Step dots for a board scene: past steps stretch to 20px olive pills; upcoming stay 6px on-ink/25 dots. Designed for the ink ground. */
function StepProgress({
  current = 0,
  total = 6
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.375rem'
    },
    role: "img",
    "aria-label": `Step ${current} of ${total}`
  }, Array.from({
    length: total
  }, (_, i) => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      height: '0.375rem',
      borderRadius: 'var(--radius-pill)',
      width: i < current ? '1.25rem' : '0.375rem',
      background: i < current ? 'var(--color-teal-on-ink)' : 'rgb(244 243 238 / 0.25)',
      transition: 'width var(--dur-base) var(--ease-karka-out), background-color var(--dur-base) var(--ease-karka-out)'
    }
  })));
}
Object.assign(__ds_scope, { StepProgress });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/board/StepProgress.jsx", error: String((e && e.message) || e) }); }

// components/content/Eyebrow.jsx
try { (() => {
/** Uppercase-tracked section label. tone 'paper' = sage-deep, 'ink' = olive. */
function Eyebrow({
  tone = 'paper',
  children
}) {
  return /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-eyebrow)',
      lineHeight: 'var(--leading-eyebrow)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: 'var(--tracking-eyebrow)',
      color: tone === 'ink' ? 'var(--color-teal-on-ink)' : 'var(--color-teal)'
    }
  }, children);
}
Object.assign(__ds_scope, { Eyebrow });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/Eyebrow.jsx", error: String((e && e.message) || e) }); }

// components/content/TodoCopy.jsx
try { (() => {
/** Visible placeholder for copy that hasn't been written yet. Never invent copy to fill a slot — render this instead. */
function TodoCopy({
  what,
  owner = 'TODO'
}) {
  return /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      borderRadius: 'var(--radius-card)',
      border: '1px dashed var(--color-olive)',
      background: 'var(--color-olive-tint)',
      padding: '0.75rem 1rem',
      fontFamily: 'var(--font-sans)',
      fontSize: 'var(--text-body)',
      color: 'var(--color-ink)'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontWeight: 600
    }
  }, owner), " \xB7 ", what);
}
Object.assign(__ds_scope, { TodoCopy });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/content/TodoCopy.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const base = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  borderRadius: 'var(--radius-pill)',
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--text-body)',
  fontWeight: 600,
  textDecoration: 'none',
  cursor: 'pointer',
  border: '1px solid transparent',
  transition: 'background-color var(--dur-fast) var(--ease-karka-out), border-color var(--dur-fast) var(--ease-karka-out), color var(--dur-fast) var(--ease-karka-out)'
};
const variants = {
  primary: {
    background: 'var(--color-ink)',
    color: 'var(--color-on-ink)'
  },
  accent: {
    background: 'var(--color-teal-deep)',
    color: 'var(--color-on-ink)'
  },
  chip: {
    background: 'var(--color-board)',
    color: 'var(--color-ink)',
    border: '1px solid var(--color-line)',
    fontWeight: 500
  }
};

/** KarkaLabs pill button/CTA. Variants from the site: primary (ink), accent (teal-deep, e.g. "Hear Aarya"), chip (audience pill). */
function Button({
  variant = 'primary',
  size = 'lg',
  disabled = false,
  tone = 'paper',
  href,
  children,
  style,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const s = {
    ...base,
    minHeight: size === 'lg' ? 'var(--hit-target-lg)' : 'var(--hit-target)',
    padding: size === 'lg' ? '0 1.25rem' : '0 1rem',
    ...variants[variant],
    ...(hover && !disabled && variant === 'accent' ? {
      background: 'var(--color-teal-press)'
    } : null),
    ...(hover && !disabled && variant === 'chip' ? {
      borderColor: 'var(--color-teal)'
    } : null),
    ...(hover && !disabled && variant === 'primary' ? {
      background: 'var(--color-ink-2)'
    } : null),
    ...(disabled ? tone === 'ink' ? {
      background: 'rgb(244 243 238 / 0.10)',
      color: 'var(--color-on-ink-muted)',
      cursor: 'not-allowed',
      border: '1px solid rgb(244 243 238 / 0.18)'
    } : {
      background: 'rgb(26 35 43 / 0.08)',
      color: 'var(--color-ink-muted)',
      cursor: 'not-allowed',
      border: '1px solid transparent'
    } : null),
    ...style
  };
  const props = {
    style: s,
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
    ...rest
  };
  if (href && !disabled) return /*#__PURE__*/React.createElement("a", _extends({
    href: href
  }, props), children);
  return /*#__PURE__*/React.createElement("button", _extends({
    type: "button",
    disabled: disabled,
    "aria-disabled": disabled || undefined
  }, props), children);
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/forms/Field.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/** Labelled text input, 48px min-height, paper fill, sage-deep focus border. */
function Field({
  id,
  label,
  type = 'text',
  required,
  placeholder,
  ...input
}) {
  const [focus, setFocus] = React.useState(false);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: '0.375rem',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement("label", {
    htmlFor: id,
    style: {
      fontSize: 'var(--text-caption)',
      fontWeight: 600,
      color: 'var(--color-ink)'
    }
  }, label), /*#__PURE__*/React.createElement("input", _extends({
    id: id,
    type: type,
    required: required,
    placeholder: placeholder,
    onFocus: () => setFocus(true),
    onBlur: () => setFocus(false),
    style: {
      minHeight: 'var(--hit-target-lg)',
      borderRadius: 'var(--radius-field)',
      border: `1px solid ${focus ? 'var(--color-teal)' : 'var(--color-line)'}`,
      background: 'var(--color-paper)',
      padding: '0 0.75rem',
      fontSize: 'var(--text-body)',
      color: 'var(--color-ink)',
      outline: 'none',
      fontFamily: 'inherit'
    }
  }, input)));
}
Object.assign(__ds_scope, { Field });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Field.jsx", error: String((e && e.message) || e) }); }

// components/forms/LeadForm.jsx
try { (() => {
/**
 * Demo-request lead form (schools / tuition centres). White card, line border, 16px radius.
 * Status line is honest about being unconnected until `connected` is true.
 */
function LeadForm({
  orgLabel = 'School',
  connected = false,
  onSubmit
}) {
  const [attempted, setAttempted] = React.useState(false);
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: e => {
      e.preventDefault();
      setAttempted(true);
      onSubmit && onSubmit(e);
    },
    style: {
      display: 'grid',
      gap: '1rem',
      borderRadius: 'var(--radius-card)',
      border: '1px solid var(--color-line)',
      background: 'var(--color-board)',
      padding: '1.25rem',
      fontFamily: 'var(--font-sans)'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Field, {
    id: "lf-name",
    label: "Name",
    name: "name",
    autoComplete: "name",
    required: true
  }), /*#__PURE__*/React.createElement(__ds_scope.Field, {
    id: "lf-email",
    label: "Work email",
    name: "email",
    type: "email",
    autoComplete: "email",
    required: true
  }), /*#__PURE__*/React.createElement(__ds_scope.Field, {
    id: "lf-org",
    label: orgLabel,
    name: "organisation",
    autoComplete: "organization",
    required: true
  }), /*#__PURE__*/React.createElement(__ds_scope.Field, {
    id: "lf-phone",
    label: "Phone (optional)",
    name: "phone",
    type: "tel",
    autoComplete: "tel"
  }), /*#__PURE__*/React.createElement(__ds_scope.Button, {
    type: "submit"
  }, "Request a demo"), !connected && /*#__PURE__*/React.createElement("p", {
    role: "status",
    style: {
      margin: 0,
      fontSize: 'var(--text-caption)',
      color: 'var(--color-ink-muted)'
    }
  }, attempted ? 'Nothing was sent: this form isn’t connected yet.' : 'Not connected yet: submissions go nowhere.'));
}
Object.assign(__ds_scope, { LeadForm });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/LeadForm.jsx", error: String((e && e.message) || e) }); }

// components/forms/WhatsAppCta.jsx
try { (() => {
/** Parents → WhatsApp deep link. Rendered inert (disabled + reason) until a number is supplied. */
function WhatsAppCta({
  number = null
}) {
  if (!number) {
    return /*#__PURE__*/React.createElement("p", {
      style: {
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '0.75rem',
        margin: 0,
        fontFamily: 'var(--font-sans)'
      }
    }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
      disabled: true
    }, "Chat on WhatsApp"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 'var(--text-caption)',
        color: 'var(--color-ink-muted)'
      }
    }, "Number not set yet"));
  }
  return /*#__PURE__*/React.createElement(__ds_scope.Button, {
    href: `https://wa.me/${String(number).replace(/\D/g, '')}`
  }, "Chat on WhatsApp");
}
Object.assign(__ds_scope, { WhatsAppCta });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/WhatsAppCta.jsx", error: String((e && e.message) || e) }); }

// ui_kits/parent_dashboard/ParentDashboard.jsx
try { (() => {
function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// SAMPLE DATA. Redacted by the site lane on 2026-09-15, before karkalabs-site went public: this kit shipped
// with a real student's reports. No real student data in a public repo. The same fix is needed upstream in Claude Design.
const SESSIONS = [{
  date: 'Sample report',
  chips: [{
    label: 'Sample data',
    kind: 'flag'
  }],
  summary: 'After every session, a plain-English report: what was learned, the questions asked, and where the evidence is still thin.',
  cols: [{
    h: 'What they learned',
    body: 'Speed vs velocity, Acceleration definition, Motion graph interpretation'
  }],
  next: null
}];
function Chip({
  label,
  kind
}) {
  const styles = {
    metric: {
      background: 'var(--color-sage-tint)',
      color: 'var(--color-sage-deep)',
      border: '1px solid var(--color-sage-tint)'
    },
    flag: {
      background: 'var(--color-board)',
      color: 'var(--color-ink-muted)',
      border: '1px solid var(--color-line)'
    },
    good: {
      background: 'var(--color-board)',
      color: 'var(--color-sage-deep)',
      border: '1px solid var(--color-line)'
    }
  }[kind];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      minHeight: 30,
      borderRadius: 'var(--radius-pill)',
      padding: '0 12px',
      fontSize: 'var(--text-caption)',
      fontWeight: 600,
      ...styles
    }
  }, label);
}
function Label({
  children
}) {
  return /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-eyebrow)',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08em',
      color: 'var(--color-ink-muted)'
    }
  }, children);
}
function SessionCard({
  s
}) {
  return /*#__PURE__*/React.createElement("article", {
    style: {
      borderRadius: 'var(--radius-card)',
      border: '1px solid var(--color-line)',
      background: 'var(--color-paper)',
      padding: '24px 28px',
      display: 'grid',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: '1.125rem'
    }
  }, s.date), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'flex',
      gap: 8,
      flexWrap: 'wrap'
    }
  }, s.chips.map(c => /*#__PURE__*/React.createElement(Chip, _extends({
    key: c.label
  }, c))))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      lineHeight: 'var(--leading-body)'
    }
  }, s.summary), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
      gap: 24
    }
  }, s.cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h,
    style: {
      display: 'grid',
      gap: 6,
      alignContent: 'start'
    }
  }, /*#__PURE__*/React.createElement(Label, null, c.h), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--color-ink)',
      lineHeight: 'var(--leading-body)'
    }
  }, c.body)))), s.next && /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 'var(--radius-field)',
      border: '1px solid var(--color-line)',
      background: 'var(--color-board)',
      padding: '14px 18px',
      display: 'grid',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Label, null, "Suggested next session"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      lineHeight: 'var(--leading-body)'
    }
  }, s.next)));
}
function ParentDashboard() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'var(--font-sans)',
      color: 'var(--color-ink)',
      minHeight: '100vh'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '20px 40px'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: '1.25rem',
      fontWeight: 700
    }
  }, "Karka", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-sage)'
    }
  }, "Labs"), " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 400,
      color: 'var(--color-ink-muted)'
    }
  }, "\xB7 Parent")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-caption)',
      color: 'var(--color-ink-muted)'
    }
  }, "vinodh@example.com \xA0 ", /*#__PURE__*/React.createElement("a", {
    href: "#",
    style: {
      color: 'var(--color-ink)',
      fontWeight: 600
    }
  }, "Sign out"))), /*#__PURE__*/React.createElement("main", {
    style: {
      maxWidth: 1040,
      margin: '0 auto',
      padding: '24px var(--spacing-gutter) 80px',
      display: 'grid',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontFamily: 'var(--font-display)',
      fontSize: '2.5rem',
      fontWeight: 600,
      letterSpacing: 'var(--tracking-display)'
    }
  }, "Learning ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--color-sage)'
    }
  }, "progress")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      color: 'var(--color-ink-muted)'
    }
  }, "Recent one-to-one tutoring sessions.")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: '1.375rem',
      fontWeight: 700
    }
  }, "Your child ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-caption)',
      fontWeight: 400,
      color: 'var(--color-ink-muted)'
    }
  }, "O-Level Physics")), SESSIONS.map(s => /*#__PURE__*/React.createElement(SessionCard, {
    key: s.date,
    s: s
  }))));
}
window.ParentDashboard = ParentDashboard;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/parent_dashboard/ParentDashboard.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Website.jsx
try { (() => {
const {
  BoardFrame,
  ConceptChip,
  StepProgress,
  Eyebrow,
  Button,
  LeadForm,
  WhatsAppCta,
  TodoCopy
} = window.KarkaLabsDesignSystem_0a4ecd;
const {
  useState
} = React;
const CAPTIONS = ['A ball is launched at an angle. Let’s follow its path, and its velocity, the whole way.', 'Its velocity has two parts: one across, one up. Keep an eye on both.', 'Gravity only pulls down. So only the upward part shrinks as the ball rises.', 'You said the ball stops at the top. Let’s check that on the board.', 'At the top, only the upward part is zero. The across part never changed, so it keeps moving.', 'That’s why the path is a curve, not straight up and down. Now you’ve got it.'];
const wrap = {
  maxWidth: 1152,
  margin: '0 auto',
  padding: '0 var(--spacing-gutter-lg)'
};
const h2Style = {
  margin: 0,
  fontFamily: 'var(--font-display)',
  fontSize: 'var(--text-h2)',
  lineHeight: 'var(--leading-h2)',
  letterSpacing: 'var(--tracking-display)',
  fontWeight: 600,
  textWrap: 'balance'
};
function ParabolaScene({
  step
}) {
  // Trajectory ends inboard of the viewBox and just above the baseline, so the +44px velocity
  // arrow at the final step clears both the right edge (430+44=474 < 476) and the y=210 axis.
  const pts = [[40, 206], [105, 120], [170, 70], [235, 52], [300, 70], [365, 120], [430, 196]];
  const shown = Math.max(2, Math.ceil(step / 6 * pts.length));
  const d = pts.slice(0, shown).map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ');
  const ball = pts[Math.min(shown - 1, pts.length - 1)];
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 500 260",
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%'
    },
    "aria-hidden": "true"
  }, /*#__PURE__*/React.createElement("line", {
    x1: "24",
    y1: "210",
    x2: "476",
    y2: "210",
    stroke: "#9fbccd",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "40",
    y1: "230",
    x2: "40",
    y2: "36",
    stroke: "#9fbccd",
    strokeWidth: "1.5"
  }), /*#__PURE__*/React.createElement("path", {
    d: d,
    fill: "none",
    stroke: "#147d7b",
    strokeWidth: "2.5",
    strokeLinecap: "round",
    style: {
      transition: 'all var(--dur-base) var(--ease-karka-out)'
    }
  }), /*#__PURE__*/React.createElement("circle", {
    cx: ball[0],
    cy: ball[1],
    r: "7",
    fill: "#0f6564",
    style: {
      transition: 'all var(--dur-base) var(--ease-karka-out)'
    }
  }), /*#__PURE__*/React.createElement("line", {
    x1: ball[0],
    y1: ball[1],
    x2: ball[0] + 44,
    y2: ball[1],
    stroke: "#b66b13",
    strokeWidth: "2.5",
    style: {
      transition: 'all var(--dur-base) var(--ease-karka-out)'
    }
  }), step < 5 && /*#__PURE__*/React.createElement("line", {
    x1: ball[0],
    y1: ball[1],
    x2: ball[0],
    y2: ball[1] - (step >= 3 ? 20 : 40),
    stroke: "#147d7b",
    strokeWidth: "2.5",
    style: {
      transition: 'all var(--dur-base) var(--ease-karka-out)'
    }
  }));
}
function Hero() {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "board-grid",
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      position: 'relative',
      display: 'flex',
      minHeight: 420,
      flexDirection: 'column',
      justifyContent: 'flex-end',
      gap: 24,
      paddingTop: 32,
      paddingBottom: 60
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, "Diya and Aarya listen, understand and guide"), /*#__PURE__*/React.createElement("h1", {
    style: {
      ...h2Style,
      fontSize: 'var(--text-display)',
      lineHeight: 'var(--leading-display)',
      maxWidth: 760
    }
  }, "Real-time, human-like voice tutors"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      maxWidth: '65ch',
      fontSize: 'var(--text-lead)',
      lineHeight: 'var(--leading-lead)',
      color: 'var(--color-ink-muted)'
    }
  }, "Learn with AI, not from AI."), /*#__PURE__*/React.createElement("nav", {
    "aria-label": "Who Karka is for"
  }, /*#__PURE__*/React.createElement("ul", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 8,
      margin: 0,
      padding: 0,
      listStyle: 'none'
    }
  }, [['students', 'Students'], ['parents', 'Parents'], ['schools', 'Schools'], ['tuition', 'Tuition centres']].map(([id, label]) => /*#__PURE__*/React.createElement("li", {
    key: id
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "chip",
    size: "md",
    href: '#' + id
  }, label)))))));
}
function Students() {
  const [step, setStep] = useState(1);
  const total = CAPTIONS.length;
  return /*#__PURE__*/React.createElement("section", {
    id: "students",
    "data-screen-label": "Students",
    style: {
      background: 'var(--color-ink)',
      color: 'var(--color-on-ink)',
      padding: 'var(--spacing-section) 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: 'grid',
      gridTemplateColumns: 'minmax(0,5fr) minmax(0,7fr)',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    tone: "ink"
  }, "For students"), /*#__PURE__*/React.createElement("h2", {
    style: h2Style
  }, "You say it. Aarya catches it. The board redraws it."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement(ConceptChip, {
    state: step === total ? 'terminal' : 'initial'
  }), /*#__PURE__*/React.createElement(StepProgress, {
    current: step,
    total: total
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "md",
    tone: "ink",
    disabled: step === 1,
    onClick: () => setStep(s => Math.max(1, s - 1))
  }, "Back"), /*#__PURE__*/React.createElement(Button, {
    variant: "accent",
    size: "md",
    tone: "ink",
    disabled: step === total,
    onClick: () => setStep(s => Math.min(total, s + 1))
  }, "Next step"))), /*#__PURE__*/React.createElement(BoardFrame, {
    tutor: "Aarya",
    tone: "ink",
    aspect: "16/10",
    caption: CAPTIONS[step - 1],
    showVoice: true
  }, /*#__PURE__*/React.createElement(ParabolaScene, {
    step: step
  }))));
}
function Stub({
  id,
  label,
  eyebrow,
  children,
  poster,
  alt
}) {
  return /*#__PURE__*/React.createElement("section", {
    id: id,
    "data-screen-label": label,
    style: {
      borderTop: '1px solid var(--color-line)',
      padding: 'var(--spacing-section) 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: 'grid',
      gridTemplateColumns: 'minmax(0,1fr) minmax(0,1fr)',
      gap: 56,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, eyebrow), /*#__PURE__*/React.createElement("h2", {
    style: h2Style
  }, label), /*#__PURE__*/React.createElement(TodoCopy, {
    owner: "TODO:VB",
    what: "headline and section copy"
  }), children), /*#__PURE__*/React.createElement(BoardFrame, {
    tone: "paper",
    aspect: "4/3",
    poster: poster,
    alt: alt
  })));
}
function Footer() {
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--color-ink)',
      padding: '40px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...wrap,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/brand/wordmark-on-dark.png",
    alt: "KarkaLabs",
    style: {
      height: 26,
      width: 'auto'
    }
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-caption)',
      color: 'var(--color-on-ink-muted)',
      fontFamily: 'var(--font-sans)'
    }
  }, "Learn with AI, not from AI.")));
}
function Website() {
  return /*#__PURE__*/React.createElement("main", {
    style: {
      fontFamily: 'var(--font-sans)',
      color: 'var(--color-ink)'
    }
  }, /*#__PURE__*/React.createElement(Hero, null), /*#__PURE__*/React.createElement(Students, null), /*#__PURE__*/React.createElement(Stub, {
    id: "parents",
    label: "Parents",
    eyebrow: "For parents",
    poster: "../../assets/imagery/student-hero.png",
    alt: "A Karka lesson on screen: a 3D bus ride demonstrating Newton\u2019s first law."
  }, /*#__PURE__*/React.createElement(WhatsAppCta, {
    number: null
  })), /*#__PURE__*/React.createElement(Stub, {
    id: "schools",
    label: "Schools",
    eyebrow: "For schools",
    poster: "../../assets/imagery/student-hero.png",
    alt: "The Karka principal view: campus-wide curriculum coverage."
  }, /*#__PURE__*/React.createElement(LeadForm, {
    orgLabel: "School"
  })), /*#__PURE__*/React.createElement(Stub, {
    id: "tuition",
    label: "Tuition centres",
    eyebrow: "For tuition centres",
    poster: "../../assets/imagery/student-hero.png",
    alt: "The Karka mastery board: O-Level Physics topics as nodes."
  }, /*#__PURE__*/React.createElement(LeadForm, {
    orgLabel: "Centre"
  })), /*#__PURE__*/React.createElement(Footer, null));
}
window.Website = Website;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Website.jsx", error: String((e && e.message) || e) }); }

// ui_kits/worksheet/Worksheet.jsx
try { (() => {
const {
  Button
} = window.KarkaLabsDesignSystem_0a4ecd;
const {
  useState
} = React;
const wsWrap = {
  maxWidth: 760,
  margin: '0 auto',
  padding: '40px var(--spacing-gutter)',
  fontFamily: 'var(--font-sans)',
  color: 'var(--color-ink)'
};
const panel = {
  borderRadius: 'var(--radius-card)',
  background: 'var(--color-paper)',
  padding: '24px 28px',
  display: 'grid',
  gap: 16
};
function StepTabs({
  current,
  labels
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: `repeat(${labels.length},1fr)`,
      gap: 14
    }
  }, labels.map((l, i) => /*#__PURE__*/React.createElement("span", {
    key: l,
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: 40,
      borderRadius: 'var(--radius-field)',
      fontSize: 'var(--text-body)',
      fontWeight: i === current ? 600 : 400,
      background: i === current ? 'var(--color-board)' : 'var(--color-olive-tint)',
      border: i === current ? '1.5px solid var(--color-sage-deep)' : '1px solid transparent',
      color: i === current ? 'var(--color-ink)' : 'var(--color-ink-muted)'
    }
  }, l)));
}
function RadioCard({
  title,
  body,
  note,
  disabled,
  checked,
  onSelect
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'grid',
      gridTemplateColumns: '24px 1fr',
      gap: 14,
      padding: '18px 20px',
      borderRadius: 'var(--radius-field)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      background: disabled ? 'var(--color-olive-tint)' : 'var(--color-board)',
      border: disabled ? '1px dashed var(--color-line)' : `1px solid ${checked ? 'var(--color-sage-deep)' : 'var(--color-line)'}`
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "radio",
    name: "src",
    disabled: disabled,
    checked: !!checked,
    onChange: onSelect,
    style: {
      width: 20,
      height: 20,
      marginTop: 2,
      accentColor: '#4f6139'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'grid',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      fontSize: '1.0625rem',
      color: disabled ? 'var(--color-ink-muted)' : 'var(--color-ink)'
    }
  }, title), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-body)',
      color: 'var(--color-ink-muted)'
    }
  }, body), note && /*#__PURE__*/React.createElement("span", {
    style: {
      borderLeft: '3px solid var(--color-olive)',
      paddingLeft: 12,
      marginTop: 6,
      fontSize: 'var(--text-body)',
      color: 'var(--color-ink-muted)',
      lineHeight: 1.5
    }
  }, note)));
}
const LAWYER = "We can't accept this one yet. Whether we're allowed to process a worksheet somebody else published is still being checked with a lawyer, and we'd rather wait for that answer than guess.";
function FrontDoor({
  onContinue
}) {
  const [pick, setPick] = useState(null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: '2rem',
      fontWeight: 700
    }
  }, "Add a worksheet"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      color: 'var(--color-ink-muted)'
    }
  }, "Signed in as Priya")), /*#__PURE__*/React.createElement(StepTabs, {
    current: 0,
    labels: ["Where it's from", 'What we do with it', 'Which kind']
  }), /*#__PURE__*/React.createElement("div", {
    style: panel
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: '1.375rem',
      fontWeight: 700
    }
  }, "Where did this worksheet come from?"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 'var(--text-lead)',
      color: 'var(--color-ink-muted)'
    }
  }, "We ask because it decides whether we're allowed to use it at all.")), /*#__PURE__*/React.createElement(RadioCard, {
    title: "I made it myself",
    body: "You wrote these questions \u2014 your own revision notes or practice.",
    checked: pick === 'own',
    onSelect: () => setPick('own')
  }), /*#__PURE__*/React.createElement(RadioCard, {
    title: "My school or tutor gave it to me",
    body: "A sheet handed out in class or at tuition.",
    checked: pick === 'school',
    onSelect: () => setPick('school')
  }), /*#__PURE__*/React.createElement(RadioCard, {
    title: "It's from a textbook or past paper",
    body: "A published book, workbook or exam paper.",
    note: LAWYER,
    disabled: true
  }), /*#__PURE__*/React.createElement(RadioCard, {
    title: "I'm not sure where it's from",
    body: "Honest is better than a guess \u2014 but we can't take it yet either.",
    note: LAWYER,
    disabled: true
  }), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    disabled: !pick,
    onClick: onContinue,
    style: {
      borderRadius: 'var(--radius-field)'
    }
  }, "Continue"))));
}
function Router({
  onContinue,
  onBack
}) {
  const [pick, setPick] = useState(null);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: '2rem',
      fontWeight: 700
    }
  }, "Add a worksheet"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      color: 'var(--color-ink-muted)'
    }
  }, "Signed in as Priya")), /*#__PURE__*/React.createElement(StepTabs, {
    current: 1,
    labels: ["Where it's from", 'What we do with it', 'Which kind']
  }), /*#__PURE__*/React.createElement("div", {
    style: panel
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontSize: '1.375rem',
      fontWeight: 700
    }
  }, "Have you done this worksheet yet?"), /*#__PURE__*/React.createElement(RadioCard, {
    title: "I've already done it",
    body: "Your written answers are on the sheet \u2014 we mark what you wrote.",
    checked: pick === 'done',
    onSelect: () => setPick('done')
  }), /*#__PURE__*/React.createElement(RadioCard, {
    title: "It's still blank",
    body: "NOT READY YET \u2014 working on this one. No date to promise.",
    disabled: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Button, {
    variant: "chip",
    onClick: onBack,
    style: {
      borderRadius: 'var(--radius-field)'
    }
  }, "Back"), /*#__PURE__*/React.createElement(Button, {
    disabled: !pick,
    onClick: onContinue,
    style: {
      borderRadius: 'var(--radius-field)'
    }
  }, "Continue"))));
}
function Answer({
  text,
  tint
}) {
  const bg = {
    green: '#e7f0e2',
    cream: '#f6efd9',
    blue: '#dfe8f5',
    purple: '#f0e6f5'
  }[tint];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: bg,
      borderRadius: 'var(--radius-field)',
      padding: '18px 20px'
    }
  }, /*#__PURE__*/React.createElement("code", {
    style: {
      fontFamily: 'var(--font-mono)',
      fontSize: '1.0625rem'
    }
  }, text));
}
function MarkCard({
  q,
  status,
  children,
  accent
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: {
      borderRadius: 'var(--radius-card)',
      background: 'var(--color-paper)',
      padding: '20px 24px',
      borderLeft: accent ? '4px solid var(--color-sage-deep)' : undefined,
      border: accent ? undefined : '1px solid var(--color-line)',
      display: 'grid',
      gap: 14,
      ...(accent ? {
        border: '1px solid var(--color-line)',
        borderLeft: '4px solid var(--color-sage-deep)'
      } : null)
    }
  }, /*#__PURE__*/React.createElement("header", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'baseline'
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      fontSize: '1.125rem'
    }
  }, q), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 'var(--text-caption)',
      fontWeight: 700,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      color: 'var(--color-ink-muted)'
    }
  }, status)), children);
}
function Mark({
  ok,
  children
}) {
  return /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      display: 'flex',
      gap: 10,
      fontSize: 'var(--text-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: ok ? 'var(--color-sage-deep)' : '#8a6d1f',
      fontWeight: 700
    }
  }, ok ? '✓' : '✗'), children);
}
function Results({
  onBack
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 22
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: 0,
      fontSize: '2rem',
      fontWeight: 700
    }
  }, "Your marked worksheet"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '6px 0 0',
      fontSize: 'var(--text-lead)',
      color: 'var(--color-ink-muted)',
      maxWidth: '58ch'
    }
  }, "2 of 3 on the one question we could mark. 1 more was marked by the backup marker and is shown but not counted. 1 not marked yet.")), /*#__PURE__*/React.createElement(MarkCard, {
    q: "3(a)",
    status: "2 / 3",
    accent: true
  }, /*#__PURE__*/React.createElement(Answer, {
    text: "v = 12 m/s",
    tint: "green"
  }), /*#__PURE__*/React.createElement(Mark, {
    ok: true
  }, "Correct method: v = u + at"), /*#__PURE__*/React.createElement(Mark, {
    ok: true
  }, "Correct value, 12"), /*#__PURE__*/React.createElement(Mark, null, "Unit missing on the final answer")), /*#__PURE__*/React.createElement(MarkCard, {
    q: "4",
    status: "Waiting for a teacher"
  }, /*#__PURE__*/React.createElement(Answer, {
    text: "a = 3.0",
    tint: "cream"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--color-ink-muted)',
      lineHeight: 1.55
    }
  }, "We don't have a reviewed mark scheme for this one yet, so it's waiting for a teacher. It hasn't been marked right or wrong \u2014 nothing is counted either way."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      borderLeft: '3px solid var(--color-line)',
      paddingLeft: 12,
      fontSize: 'var(--text-caption)',
      color: 'var(--color-ink-muted)'
    }
  }, "Two bank items scored too near each other to tell them apart.")), /*#__PURE__*/React.createElement(MarkCard, {
    q: "5",
    status: "Shown, not counted"
  }, /*#__PURE__*/React.createElement(Answer, {
    text: "E = 1/2 mv^2",
    tint: "blue"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--color-ink-muted)',
      lineHeight: 1.55
    }
  }, "This one was marked by our backup marker, which checks for keywords rather than reading the physics. We're showing you what it found, but we're not counting it towards a score \u2014 it isn't accurate enough for that."), /*#__PURE__*/React.createElement(Mark, null, "Unit missing on the final answer")), /*#__PURE__*/React.createElement(MarkCard, {
    q: "6(b)",
    status: "Not marked yet"
  }, /*#__PURE__*/React.createElement(Answer, {
    text: "R = 4.0 ohm",
    tint: "purple"
  }), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: 'var(--color-ink-muted)',
      lineHeight: 1.55
    }
  }, "Marking is busy and this one is still queued. It hasn't been marked wrong \u2014 it just hasn't been marked yet.")), /*#__PURE__*/React.createElement("div", {
    style: {
      borderTop: '1px solid var(--color-line)',
      paddingTop: 18,
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-caption)',
      fontWeight: 700,
      letterSpacing: '0.04em',
      textTransform: 'uppercase'
    }
  }, "How this was marked"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-body)',
      color: 'var(--color-ink-muted)'
    }
  }, "Marked from a photograph of your own handwriting, not from typed answers."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-body)',
      color: 'var(--color-ink-muted)'
    }
  }, "You confirmed what we read before anything was marked."), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 'var(--text-body)',
      fontWeight: 600
    }
  }, "Our mark schemes have been checked by automated review and by their author \u2014 not by a qualified teacher.")), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Button, {
    variant: "chip",
    onClick: onBack,
    style: {
      borderRadius: 'var(--radius-field)'
    }
  }, "Start over")));
}
function WorksheetApp() {
  const [step, setStep] = useState(0);
  return /*#__PURE__*/React.createElement("main", {
    style: wsWrap,
    "data-screen-label": ['Front door', 'Router', 'Results'][step]
  }, step === 0 && /*#__PURE__*/React.createElement(FrontDoor, {
    onContinue: () => setStep(1)
  }), step === 1 && /*#__PURE__*/React.createElement(Router, {
    onBack: () => setStep(0),
    onContinue: () => setStep(2)
  }), step === 2 && /*#__PURE__*/React.createElement(Results, {
    onBack: () => setStep(0)
  }));
}
window.WorksheetApp = WorksheetApp;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/worksheet/Worksheet.jsx", error: String((e && e.message) || e) }); }

__ds_ns.BoardFrame = __ds_scope.BoardFrame;

__ds_ns.CONCEPT_STATES = __ds_scope.CONCEPT_STATES;

__ds_ns.ConceptChip = __ds_scope.ConceptChip;

__ds_ns.StepProgress = __ds_scope.StepProgress;

__ds_ns.Eyebrow = __ds_scope.Eyebrow;

__ds_ns.TodoCopy = __ds_scope.TodoCopy;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Field = __ds_scope.Field;

__ds_ns.LeadForm = __ds_scope.LeadForm;

__ds_ns.WhatsAppCta = __ds_scope.WhatsAppCta;

})();
