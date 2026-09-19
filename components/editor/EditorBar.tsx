'use client';

import { useState, useTransition } from 'react';
import { setPublishedAction } from '@/lib/editor/save-actions';
import { signOutAction } from '@/lib/editor/auth-actions';
import type { EditableSectionRef } from '@/lib/editor/sections';

/**
 * The owner's editing chrome.
 *
 * Beyond whose site it is and whether it is live, this bar lists every section
 * that has something to edit. The per-section pills on the page are the primary
 * affordance, but a nine-thousand-pixel page hides them: the list means the
 * owner can see the whole editable surface without hunting, and jump straight
 * to a section from the top.
 */
export function EditorBar({
  businessName,
  logoUrl,
  published,
  liveUrl,
  sections,
  onOpen,
}: {
  businessName: string;
  logoUrl: string | null;
  published: boolean;
  liveUrl: string | null;
  sections: EditableSectionRef[];
  onOpen: (id: string, label: string) => void;
}) {
  const [pending, startTransition] = useTransition();
  const [isPublished, setIsPublished] = useState(published);

  return (
    <div className="ed-bar">
      <div className="ed-bar-brand">
        {logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="ed-bar-logo" src={logoUrl} alt="" width={26} height={26} />
        )}
        <span className="ed-bar-name">{businessName}</span>
        <span className="ed-bar-tag">Website admin · edits go live straight away</span>
      </div>

      <nav className="ed-bar-nav" aria-label="Editable sections">
        {sections.map((s) => (
          <button
            key={s.id}
            type="button"
            className="ed-pill"
            onClick={() => onOpen(s.id, s.label)}
          >
            {s.label}
          </button>
        ))}
      </nav>

      <div className="ed-bar-spacer" />

      <button
        type="button"
        className={`ed-pill${isPublished ? ' ed-pill-live' : ''}`}
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            const next = !isPublished;
            const res = await setPublishedAction(next);
            if (res.ok) setIsPublished(next);
          })
        }
        title={isPublished ? 'Your website is live — click to hide it' : 'Your website is hidden — click to publish'}
      >
        <span className="ed-dot" />
        {isPublished ? 'Live' : 'Hidden'}
      </button>

      {liveUrl && (
        <a className="ed-pill" href={liveUrl} target="_blank" rel="noopener">
          View live site ↗
        </a>
      )}

      <form action={signOutAction}>
        <button className="ed-pill" type="submit">
          Sign out
        </button>
      </form>
    </div>
  );
}
