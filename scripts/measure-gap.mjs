// One-off diagnostic: where the Students section starts relative to the hero, and what the pin spacer does.
import { chromium } from '@playwright/test';
const b = await chromium.launch({ channel: 'chrome' });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(process.argv[2] ?? 'http://localhost:4173/');
await p.waitForFunction(() => document.getElementById('students')?.dataset.pinEnd, null, { timeout: 30000 });
console.log(JSON.stringify(await p.evaluate(() => {
  const r = (el) => { const b = el.getBoundingClientRect(); return { top: Math.round(b.top + scrollY), bottom: Math.round(b.bottom + scrollY), h: Math.round(b.height) }; };
  const hero = document.querySelector('section[aria-labelledby="hero-title"]');
  const students = document.getElementById('students');
  const spacer = students.firstElementChild;
  const pin = spacer.firstElementChild;
  const head = document.getElementById('students-title');
  const eyebrow = students.querySelector('div.flex.items-center');
  const cs = getComputedStyle(spacer);
  return {
    viewport: innerHeight,
    hero: r(hero), students: r(students), spacer: r(spacer), pin: r(pin),
    eyebrow: r(eyebrow), headline: r(head),
    spacerPadding: [cs.paddingTop, cs.paddingBottom],
    spacerClasses: spacer.className, pinClasses: pin.className,
    heroBottomToEyebrow: r(eyebrow).top - r(hero).bottom,
  };
}, null), null, 2));
await b.close();
