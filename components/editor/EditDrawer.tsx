'use client';

import { useEffect, useRef, useState, useTransition } from 'react';
import {
  addGalleryImageAction,
  removeGalleryImageAction,
  removeHeroAction,
  saveAboutAction,
  saveAmenitiesAction,
  saveContactAction,
  saveFaqAction,
  saveHeroAction,
  saveMissionAction,
  saveServiceAction,
  saveStatsAction,
  uploadAboutPortraitAction,
  uploadHeroAction,
  type SaveResult,
} from '@/lib/editor/save-actions';
import {
  ABOUT_BODY_MAX,
  ABOUT_HEADLINE_MAX,
  GALLERY_MAX,
  HEADLINE_MAX,
  SUBHEAD_MAX,
} from '@/lib/editor/limits';

export interface EditorGalleryItem {
  id: string;
  url: string;
  alt: string | null;
  caption: string | null;
}

export interface EditorService {
  id: string;
  name: string;
  description: string | null;
  price_cents: number | null;
  is_active: boolean;
  cta_url: string | null;
  cta_label: string | null;
}

export interface EditorContent {
  hero: {
    headline1: string | null;
    headline2: string | null;
    subhead: string | null;
    imageUrl: string | null;
  };
  stats: Array<{ value: string; label: string }>;
  mission: { statement: string | null; highlight: string | null };
  about: { headline: string | null; body: string | null; portraitUrl: string | null };
  included: string[];
  faq: Array<{ q: string; a: string }>;
  contact: { phone: string | null; email: string | null; address: string | null };
  gallery: EditorGalleryItem[];
  services: EditorService[];
}

function Field({
  label,
  max,
  value,
  name,
  textarea,
  placeholder,
  help,
}: {
  label: string;
  max?: number;
  value: string;
  name: string;
  textarea?: boolean;
  placeholder?: string;
  help?: string;
}) {
  const [v, setV] = useState(value);
  const over = max !== undefined && v.length > max;

  return (
    <label className="ed-field">
      <span className="ed-label">
        {label}
        {max !== undefined && (
          <span className={`ed-count${over ? ' ed-count-over' : ''}`}>
            {v.length}/{max}
          </span>
        )}
      </span>
      {textarea ? (
        <textarea
          className="ed-textarea"
          name={name}
          value={v}
          placeholder={placeholder}
          onChange={(e) => setV(e.target.value)}
        />
      ) : (
        <input
          className="ed-input"
          name={name}
          value={v}
          placeholder={placeholder}
          onChange={(e) => setV(e.target.value)}
        />
      )}
      {help && <span className="ed-help">{help}</span>}
    </label>
  );
}

/** A form bound to a server action, with inline saved/error feedback. */
function ActionForm({
  action,
  submitLabel,
  children,
  encType,
}: {
  action: (fd: FormData) => Promise<SaveResult>;
  submitLabel: string;
  children: React.ReactNode;
  encType?: string;
}) {
  const [state, setState] = useState<SaveResult | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <form
      encType={encType}
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        startTransition(async () => setState(await action(fd)));
      }}
      style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
    >
      {children}
      {state?.error && <p className="ed-error">{state.error}</p>}
      {state?.ok && state.message && <p className="ed-ok">{state.message}</p>}
      <button className="ed-button" type="submit" disabled={pending}>
        {pending ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}

function HeroPanel({ content }: { content: EditorContent }) {
  const [img, setImg] = useState(content.hero.imageUrl);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <ActionForm action={saveHeroAction} submitLabel="Save hero">
        <Field label="Headline" name="headline1" max={HEADLINE_MAX} value={content.hero.headline1 ?? ''} help="The first line visitors read. Keep it short." />
        <Field label="Second line" name="headline2" max={HEADLINE_MAX} value={content.hero.headline2 ?? ''} />
        <Field label="Supporting line" name="subhead" max={SUBHEAD_MAX} textarea value={content.hero.subhead ?? ''} help="One or two sentences under the headline." />
      </ActionForm>

      <hr style={{ border: 0, borderTop: '1px solid var(--ed-line)', margin: 0 }} />

      <div className="ed-field">
        <span className="ed-label">Hero photo</span>
        <span className="ed-help">JPEG, PNG or WebP. The site crops it to a wide landscape automatically.</span>
        {img && (
          <div className="ed-media-item" style={{ aspectRatio: '16 / 9', marginTop: 6 }}>
            <img src={img} alt="" />
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const fd = new FormData();
            fd.append('file', file);
            startTransition(async () => {
              const res = await uploadHeroAction(fd);
              // Show the new photo straight away; leaving the old preview up
              // makes a successful replace look like it did nothing.
              if (res.ok) { setImg(res.url ?? null); if (fileRef.current) fileRef.current.value = ''; }
            });
          }} />
          <button className="ed-button ed-button-ghost" type="button" disabled={pending} onClick={() => fileRef.current?.click()}>
            {pending ? 'Uploading…' : img ? 'Replace photo' : 'Upload photo'}
          </button>
          {img && (
            <button
              className="ed-button ed-button-danger"
              type="button"
              disabled={pending}
              onClick={() => startTransition(async () => {
                const res = await removeHeroAction();
                if (res.ok) setImg(null);
              })}
            >
              Remove
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function AboutPanel({ content }: { content: EditorContent }) {
  const [portrait, setPortrait] = useState(content.about.portraitUrl);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <ActionForm action={saveAboutAction} submitLabel="Save about">
        <Field label="Heading" name="headline" max={ABOUT_HEADLINE_MAX} value={content.about.headline ?? ''} />
        <Field
          label="About text"
          name="body"
          max={ABOUT_BODY_MAX}
          textarea
          value={content.about.body ?? ''}
          help="Blank lines start a new paragraph."
        />
      </ActionForm>

      <hr style={{ border: 0, borderTop: '1px solid var(--ed-line)', margin: 0 }} />

      <div className="ed-field">
        <span className="ed-label">About photo</span>
        <span className="ed-help">The portrait beside your About text. Cropped to a tall portrait automatically.</span>
        {portrait && (
          <div className="ed-media-item" style={{ aspectRatio: '4 / 5', maxWidth: 180, marginTop: 6 }}>
            <img src={portrait} alt="" />
          </div>
        )}
        <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              const fd = new FormData();
              fd.append('file', file);
              startTransition(async () => {
                const res = await uploadAboutPortraitAction(fd);
                if (res.ok) { setPortrait(res.url ?? null); if (fileRef.current) fileRef.current.value = ''; }
              });
            }}
          />
          <button className="ed-button ed-button-ghost" type="button" disabled={pending} onClick={() => fileRef.current?.click()}>
            {pending ? 'Uploading…' : portrait ? 'Replace photo' : 'Upload photo'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ContactPanel({ content }: { content: EditorContent }) {
  return (
    <ActionForm action={saveContactAction} submitLabel="Save contact details">
      <Field label="Phone" name="phone" value={content.contact.phone ?? ''} placeholder="087 123 4567" />
      <Field label="Email" name="email" value={content.contact.email ?? ''} placeholder="hello@example.com" />
      <Field label="Address" name="address" textarea value={content.contact.address ?? ''} />
    </ActionForm>
  );
}

function GalleryPanel({ content }: { content: EditorContent }) {
  const [items, setItems] = useState(content.gallery);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileRef = useRef<HTMLInputElement>(null);
  const full = items.length >= GALLERY_MAX;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <span className="ed-help">
        {items.length} of {GALLERY_MAX} photos. These appear in the gallery on your website.
      </span>

      <div className="ed-media-grid">
        {items.map((item) => (
          <div className="ed-media-item" key={item.id}>
            <img src={item.url} alt={item.alt ?? ''} />
            <button
              type="button"
              className="ed-media-remove"
              aria-label="Remove photo"
              disabled={pending}
              onClick={() =>
                startTransition(async () => {
                  const res = await removeGalleryImageAction(item.id);
                  if (res.ok) setItems((prev) => prev.filter((p) => p.id !== item.id));
                  else setError(res.error ?? 'Could not remove that photo.');
                })
              }
            >
              ×
            </button>
          </div>
        ))}
        {items.length === 0 && <div className="ed-media-empty">No photos yet</div>}
      </div>

      {error && <p className="ed-error">{error}</p>}

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (!file) return;
          const fd = new FormData();
          fd.append('file', file);
          setError(null);
          startTransition(async () => {
            const res = await addGalleryImageAction(fd);
            if (!res.ok) setError(res.error ?? 'Upload failed.');
            else if (res.url && res.id) {
              // Append in place. A full reload would close the panel and bounce
              // the owner to the top of the page, which reads as "it failed".
              setItems((prev) => [
                ...prev,
                { id: res.id as string, url: res.url as string, alt: null, caption: null },
              ]);
              if (fileRef.current) fileRef.current.value = '';
            }
          });
        }}
      />
      <button
        className="ed-button"
        type="button"
        disabled={pending || full}
        onClick={() => fileRef.current?.click()}
      >
        {pending ? 'Uploading…' : full ? `Limit reached (${GALLERY_MAX})` : 'Add a photo'}
      </button>
    </div>
  );
}

function ServicesPanel({ content }: { content: EditorContent }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      <span className="ed-help">
        Each service is a card on your website. Hide one to take it off the site without deleting it.
      </span>
      {content.services.map((s) => (
        <ActionForm key={s.id} action={saveServiceAction} submitLabel="Save">
          <input type="hidden" name="id" value={s.id} />
          <Field label="Name" name="name" value={s.name} max={120} />
          <Field
            label="Price (€)"
            name="price"
            value={s.price_cents != null ? (s.price_cents / 100).toFixed(2) : ''}
            placeholder="e.g. 79.00"
          />
          <Field label="Description" name="description" value={s.description ?? ''} max={600} textarea />
          <Field
            label="Button text"
            name="cta_label"
            value={s.cta_label ?? ''}
            placeholder="Join now"
            help="The wording on the button, e.g. “Join now” or “Book a lesson”."
          />
          <Field
            label="Button link"
            name="cta_url"
            value={s.cta_url ?? ''}
            placeholder="https://buy.stripe.com/..."
            help="Where the button sends people — your Stripe payment link, or any page."
          />
          <label className="ed-field" style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <input type="checkbox" name="is_active" defaultChecked={s.is_active} />
            <span className="ed-help">Show this on the website</span>
          </label>
        </ActionForm>
      ))}
    </div>
  );
}

/** Repeating value/label pairs — the strip of facts under the hero. */
function StatsPanel({ content }: { content: EditorContent }) {
  const [rows, setRows] = useState(content.stats);
  const set = (i: number, k: 'value' | 'label', v: string) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <span className="ed-help">
        The short facts under your hero. The big word is the value, the small line sits beneath it.
      </span>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 12, borderBottom: '1px solid var(--ed-line)' }}>
          <input className="ed-input" value={row.value} placeholder="For all" onChange={(e) => set(i, 'value', e.target.value)} />
          <input className="ed-input" value={row.label} placeholder="every body, every level" onChange={(e) => set(i, 'label', e.target.value)} />
          <button className="ed-button ed-button-danger" type="button" onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}>
            Remove
          </button>
        </div>
      ))}
      <button
        className="ed-button ed-button-ghost"
        type="button"
        onClick={() => setRows((r) => r.concat({ value: '', label: '' }))}
      >
        Add a fact
      </button>
      <SaveList action={saveStatsAction} name="stats" rows={rows} label="Save" />
    </div>
  );
}

function SaveList({
  action,
  name,
  rows,
  label,
}: {
  action: (fd: FormData) => Promise<SaveResult>;
  name: string;
  rows: unknown;
  label: string;
}) {
  const [state, setState] = useState<SaveResult | null>(null);
  const [pending, startTransition] = useTransition();
  return (
    <>
      {state?.error && <p className="ed-error">{state.error}</p>}
      {state?.ok && state.message && <p className="ed-ok">{state.message}</p>}
      <button
        className="ed-button"
        type="button"
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const fd = new FormData();
            fd.append(name, JSON.stringify(rows));
            setState(await action(fd));
          })
        }
      >
        {pending ? 'Saving…' : label}
      </button>
    </>
  );
}

function MissionPanel({ content }: { content: EditorContent }) {
  return (
    <ActionForm action={saveMissionAction} submitLabel="Save mission">
      <Field
        label="Mission statement"
        name="mission_statement"
        max={600}
        textarea
        value={content.mission.statement ?? ''}
      />
      <Field
        label="Words to emphasise"
        name="mission_highlight_word"
        max={80}
        value={content.mission.highlight ?? ''}
        help="This exact phrase is highlighted inside the statement above."
      />
    </ActionForm>
  );
}

function IncludedPanel({ content }: { content: EditorContent }) {
  const [rows, setRows] = useState<string[]>(content.included);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <span className="ed-help">The list of what a membership includes.</span>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', gap: 8 }}>
          <input
            className="ed-input"
            value={row}
            onChange={(e) => setRows((r) => r.map((v, idx) => (idx === i ? e.target.value : v)))}
          />
          <button className="ed-button ed-button-danger" type="button" onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}>
            ×
          </button>
        </div>
      ))}
      <button className="ed-button ed-button-ghost" type="button" onClick={() => setRows((r) => r.concat(''))}>
        Add an item
      </button>
      <SaveList action={saveAmenitiesAction} name="amenities" rows={rows} label="Save" />
    </div>
  );
}

function FaqPanel({ content }: { content: EditorContent }) {
  const [rows, setRows] = useState(content.faq);
  const set = (i: number, k: 'q' | 'a', v: string) =>
    setRows((r) => r.map((row, idx) => (idx === i ? { ...row, [k]: v } : row)));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <span className="ed-help">Questions and answers shown at the bottom of your website.</span>
      {rows.map((row, i) => (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 8, paddingBottom: 12, borderBottom: '1px solid var(--ed-line)' }}>
          <input className="ed-input" value={row.q} placeholder="Question" onChange={(e) => set(i, 'q', e.target.value)} />
          <textarea className="ed-textarea" value={row.a} placeholder="Answer" onChange={(e) => set(i, 'a', e.target.value)} />
          <button className="ed-button ed-button-danger" type="button" onClick={() => setRows((r) => r.filter((_, idx) => idx !== i))}>
            Remove
          </button>
        </div>
      ))}
      <button className="ed-button ed-button-ghost" type="button" onClick={() => setRows((r) => r.concat({ q: '', a: '' }))}>
        Add a question
      </button>
      <SaveList action={saveFaqAction} name="faq" rows={rows} label="Save" />
    </div>
  );
}

const PANELS: Record<string, { title: string; render: (c: EditorContent) => React.ReactNode }> = {
  hero: { title: 'Hero', render: (c) => <HeroPanel content={c} /> },
  stats: { title: 'Your key facts', render: (c) => <StatsPanel content={c} /> },
  mission: { title: 'Mission statement', render: (c) => <MissionPanel content={c} /> },
  services: { title: 'Services & pricing', render: (c) => <ServicesPanel content={c} /> },
  included: { title: "What's included", render: (c) => <IncludedPanel content={c} /> },
  about: { title: 'About', render: (c) => <AboutPanel content={c} /> },
  gallery: { title: 'Gallery', render: (c) => <GalleryPanel content={c} /> },
  faq: { title: 'Frequently asked questions', render: (c) => <FaqPanel content={c} /> },
  contact: { title: 'Contact', render: (c) => <ContactPanel content={c} /> },
  location: { title: 'Address & hours', render: (c) => <ContactPanel content={c} /> },
};

export function EditDrawer({
  section,
  label,
  content,
  onClose,
}: {
  section: string;
  label: string;
  content: EditorContent;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const panel = PANELS[section];
  if (!panel) return null;

  return (
    <>
      <div className="ed-scrim" onClick={onClose} />
      <aside className="ed-drawer" role="dialog" aria-label={`Edit ${label}`}>
        <div className="ed-drawer-head">
          <h2 className="ed-drawer-title">{panel.title}</h2>
          <button className="ed-close" type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        <div className="ed-drawer-body">{panel.render(content)}</div>
      </aside>
    </>
  );
}
