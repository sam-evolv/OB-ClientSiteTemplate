import type { BusinessRow } from '@/lib/schemas/business';

/**
 * Contact section. Returns null when no contact method is available.
 * Phone, email, instagram, WhatsApp number are pulled directly off the
 * business row (no JSONB refinement needed).
 */
export function Contact({ business }: { business: BusinessRow }) {
  const hasAny =
    business.phone || business.email || business.instagram_handle || business.whatsapp_number;
  if (!hasAny) return null;
  return (
    <section id="contact" data-section-type="contact" className="px-5 py-24 border-b border-white/5">
      <h2 className="font-serif font-light text-3xl sm:text-4xl tracking-tight">Contact</h2>
      <ul className="mt-6 grid gap-1.5 max-w-[40ch] opacity-85">
        {business.phone ? <li>Phone: {business.phone}</li> : null}
        {business.email ? <li>Email: {business.email}</li> : null}
        {business.instagram_handle ? <li>Instagram: {business.instagram_handle}</li> : null}
        {business.whatsapp_number ? <li>WhatsApp: {business.whatsapp_number}</li> : null}
      </ul>
      <p className="mt-8 font-mono text-xs uppercase tracking-[0.18em] opacity-40">
        TODO: implement contact
      </p>
    </section>
  );
}
