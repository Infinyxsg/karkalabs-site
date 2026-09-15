/** Parents' WhatsApp deep-link CTA; inert with a visible reason until a number exists. */
export interface WhatsAppCtaProps {
  /** Digits with country code, or null → disabled state with caption. */
  number?: string | null;
}
export declare function WhatsAppCta(props: WhatsAppCtaProps): JSX.Element;
