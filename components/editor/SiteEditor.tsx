'use client';

import { useState } from 'react';
import { EditorBar } from './EditorBar';
import { EditableMarketingPage } from './EditableMarketingPage';
import { EditDrawer, type EditorContent } from './EditDrawer';
import type { BusinessVM } from '@/lib/viewModel/businessViewModel';

/**
 * The owner's editing session.
 *
 * There is no sidebar and no navigation: the page IS their website, with an edit
 * control on each section that has something to change. Opening one slides a
 * panel in over the page so the owner always sees the edit in context.
 */
export function SiteEditor({
  b,
  content,
  liveUrl,
  published,
}: {
  b: BusinessVM;
  content: EditorContent;
  liveUrl: string | null;
  published: boolean;
}) {
  const [open, setOpen] = useState<{ id: string; label: string } | null>(null);

  return (
    <div className="ed-shell" style={{ '--ed-accent': b.primary_colour } as React.CSSProperties}>
      <EditorBar
        businessName={b.name}
        logoUrl={b.logo}
        published={published}
        liveUrl={liveUrl}
      />

      <EditableMarketingPage b={b} onEdit={(id, label) => setOpen({ id, label })} />

      {open && (
        <EditDrawer
          section={open.id}
          label={open.label}
          content={content}
          onClose={() => setOpen(null)}
        />
      )}
    </div>
  );
}
