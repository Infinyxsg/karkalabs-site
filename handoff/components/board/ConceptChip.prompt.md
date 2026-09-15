Board concept-state chip. Labels and colours are driven by the `CONCEPT_STATES` token map, keyed in progression order — never hard-code a state word in a screen.

⚠️ **The current state labels are `TODO:VB` placeholders.** The product's real mastery vocabulary hasn't been supplied yet; edit `CONCEPT_STATES` in `ConceptChip.jsx` (or pass `states`) once it lands, and the chip, its summary line and every consumer update together. The chip *title* ("Concept state") is real copy, not a placeholder.

Every colour — including the title's — lives in the state entry (`fg`, `titleFg`, `bg`, `border`, `dot`), so a map with three or more states stays legible without touching the component.

```jsx
<ConceptChip state="initial" />
<ConceptChip state="terminal" />
<ConceptChip summary />  {/* reduced-motion: joins all labels with arrows */}
<ConceptChip states={myStates} state="secured" title="Concept state" />
```

The initial state is designed for the ink section ground; the terminal state uses the sage secured wash.
