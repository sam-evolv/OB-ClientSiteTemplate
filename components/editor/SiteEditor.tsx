'use client';

import { useState } from 'react';
import { EditorBar } from './EditorBar';
import { EditableMarketingPage } from './EditableMarketingPage';
import { EditDrawer, type EditorContent } from './EditDrawer';
import { editableSectionsFor } from '@/lib/editor/sections';
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
  const sections = editableSectionsFor(b);

  // Opening from the bar should also bring the section into view, so the owner
  // can see what they are changing behind the panel.
  const openSection = (id: string, label: string) => {
    setOpen({ id, label });
    if (typeof document !== 'undefined') {
      const el = document.querySelector(`[data-ed-section="${id}"]`);
      el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="ed-shell" style={{ '--ed-accent': b.primary_colour } as React.CSSProperties}>
      <EditorBar
        businessName={b.name}
        logoUrl={b.logo}
        published={published}
        liveUrl={liveUrl}
        sections={sections}
        onOpen={openSection}
      />

      <EditableMarketingPage b={b} onEdit={openSection} />

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
