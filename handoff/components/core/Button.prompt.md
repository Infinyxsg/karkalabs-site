KarkaLabs pill CTA — every button on the site is a full pill; use `primary` (ink) for the main action, `accent` (teal-deep) for board voice controls, `chip` for audience/filter pills.

```jsx
<Button>Request a demo</Button>
<Button variant="accent">Hear Aarya</Button>
<Button variant="chip" size="md" href="#students">Students</Button>
<Button disabled>Chat on WhatsApp</Button>
```

Hovers: primary → ink-2, accent → teal-press, chip → teal border. Disabled = flat fill + muted text + `aria-disabled` (used when a CTA is honestly not wired up yet, or a step control has nowhere to go) — pass `tone="ink"` on dark grounds so the disabled state stays legible. Never fake disabled with opacity.
