'use client';

import type { ReactNode } from 'react';

/**
 * Wraps a section of the live site with an edit affordance.
 *
 * The wrapper is deliberately inert until hovered, so the owner sees their real
 * website first and the editing layer only appears when they go looking for it.
 */
export function EditableSection({
  id,
  label,
  onEdit,
  children,
}: {
  id: string;
  label: string;
  onEdit: (id: string, label: string) => void;
  children: ReactNode;
}) {
  return (
    <div className="ed-section" data-ed-section={id}>
      <button
        type="button"
        className="ed-section-btn"
        onClick={() => onEdit(id, label)}
        aria-label={`Edit ${label}`}
      >
        Edit {label}
      </button>
      {children}
    </div>
  );
}
