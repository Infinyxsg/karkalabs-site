/**
 * Contact targets (040 §B). Supplied by Vinodh in the session chat on 2026-09-15 — never invented,
 * never a placeholder. The build refuses to run if either is empty or malformed (vite.config.ts).
 */
export const WHATSAPP_NUMBER = '+6596470065';
export const DEMO_EMAIL = 'vinodh@karkalabs.ai';

/** E.164 (+ and 8–15 digits) and a plain address — checked at build time. */
export const CONTACT_FORMAT = {
  whatsapp: /^\+[1-9]\d{7,14}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;

/** Why the contact targets can't ship; empty = fine. vite.config.ts fails the build on any. */
export function contactProblems(whatsapp: string = WHATSAPP_NUMBER, email: string = DEMO_EMAIL): string[] {
  const problems: string[] = [];
  if (!CONTACT_FORMAT.whatsapp.test(whatsapp)) {
    problems.push(whatsapp ? `WHATSAPP_NUMBER "${whatsapp}" is not E.164` : 'WHATSAPP_NUMBER is empty');
  }
  if (!CONTACT_FORMAT.email.test(email)) {
    problems.push(email ? `DEMO_EMAIL "${email}" is not an email address` : 'DEMO_EMAIL is empty');
  }
  return problems;
}

// 040 §B, verbatim.
const WHATSAPP_PREFILL = "Hi, I'd like to try a Karka session.";

export const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER.replace(/\D/g, '')}?text=${encodeURIComponent(WHATSAPP_PREFILL)}`;

const mailto = (subject: string) => `mailto:${DEMO_EMAIL}?subject=${encodeURIComponent(subject)}`;

export const schoolDemoHref = mailto('Karka school demo');
export const licensingHref = mailto('Karka licensing');
