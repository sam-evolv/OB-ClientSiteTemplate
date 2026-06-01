'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useActiveSection } from '@/lib/hooks';
import { scrollToSection } from '@/lib/utils/scroll';
import { FONT_SANS } from '@/lib/ui/fonts';
import type { CSSProperties } from 'react';
import type { BusinessVM, SectionLink } from '@/lib/viewModel/businessViewModel';

/**
 * Sticky top nav — appears once the hero is scrolled past. Scroll-spied active
 * link, accent "Book a date" button, mobile hamburger menu. Ported near-verbatim
 * from handoff/reference/chrome.jsx.
 */
export function StickyNav({
  visible,
  business,
  sections,
  accent
}: {
  visible: boolean;
  business: BusinessVM;
  sections: SectionLink[];
  accent: string;
}) {
  const active = useActiveSection(sections.map((s) => s.id));
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky-nav-edge"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 90,
        padding: 'clamp(12px, 1.5vw, 16px) clamp(16px, 3vw, 32px)',
        background: 'rgba(8,8,8,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transform: visible ? 'translateY(0)' : 'translateY(-110%)',
        transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: visible ? 'auto' : 'none'
      }}
    >
      <div
        style={{
          maxWidth: 1600,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16
        }}
      >
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={business.name}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'inline-flex',
            alignItems: 'center',
            flexShrink: 0
          }}
        >
          <Image
            src={business.logo}
            alt={business.name}
            width={48}
            height={48}
            className="brand-logo"
            style={
              {
                borderRadius: '50%',
                filter: 'invert(1)',
                background: '#080808',
                '--logo-glow': `${accent}55`
              } as CSSProperties
            }
          />
        </button>

        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {sections.map((s) => (
            <button
              key={s.id}
              className="nav-link"
              onClick={() => scrollToSection(s.id)}
              style={{ color: active === s.id ? accent : 'rgba(255,255,255,0.65)' }}
            >
              {s.label}
              {active === s.id && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: 2,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 4,
                    height: 4,
                    borderRadius: '50%',
                    background: accent
                  }}
                />
              )}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => scrollToSection('events')}
            className="nav-book"
            style={
              {
                background: accent,
                color: '#080808',
                border: 'none',
                padding: '10px 18px',
                borderRadius: 999,
                fontFamily: FONT_SANS,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                minHeight: 40,
                letterSpacing: '0.01em',
                boxShadow: `0 4px 16px ${accent}40`,
                '--hover-accent': `${accent}80`
              } as CSSProperties
            }
          >
            Book a date
          </button>

          <button
            className="nav-menu-toggle"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Menu"
            style={{
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 8,
              padding: 8,
              cursor: 'pointer',
              minHeight: 40,
              minWidth: 40,
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div
              style={{
                width: 16,
                height: 12,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <span
                style={{
                  height: 1.5,
                  background: '#fafafa',
                  borderRadius: 1,
                  transform: menuOpen ? 'translateY(5px) rotate(45deg)' : 'none',
                  transition: 'transform 200ms ease'
                }}
              />
              <span
                style={{
                  height: 1.5,
                  background: '#fafafa',
                  borderRadius: 1,
                  opacity: menuOpen ? 0 : 1,
                  transition: 'opacity 200ms ease'
                }}
              />
              <span
                style={{
                  height: 1.5,
                  background: '#fafafa',
                  borderRadius: 1,
                  transform: menuOpen ? 'translateY(-5px) rotate(-45deg)' : 'none',
                  transition: 'transform 200ms ease'
                }}
              />
            </div>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'rgba(8,8,8,0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            padding: 16
          }}
        >
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => {
                scrollToSection(s.id);
                setMenuOpen(false);
              }}
              style={{
                display: 'block',
                width: '100%',
                background: 'none',
                border: 'none',
                padding: '14px 16px',
                fontFamily: FONT_SANS,
                fontSize: 15,
                fontWeight: 500,
                color: active === s.id ? accent : 'rgba(255,255,255,0.8)',
                textAlign: 'left',
                cursor: 'pointer',
                borderRadius: 8,
                letterSpacing: '0.01em',
                minHeight: 48
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      )}
    </nav>
  );
}
