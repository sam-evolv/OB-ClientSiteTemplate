'use client';

import { useState, useTransition } from 'react';
import { setPublishedAction } from '@/lib/editor/save-actions';
import { signOutAction } from '@/lib/editor/auth-actions';

/**
 * The only chrome the owner sees above their website: whose site it is, whether
 * it is live, and the two things they can do — look at the real site, or leave.
 */
export function EditorBar({
  businessName,
  logoUrl,
  published,
  liveUrl,
}: {
  businessName: string;
  logoUrl: string | null;
  published: boolean;
  liveUrl: string | null;
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
      </div>

      <span className="ed-bar-tag">Website admin</span>

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
