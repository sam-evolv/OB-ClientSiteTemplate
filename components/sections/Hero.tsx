'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useReveal } from '@/lib/hooks';
import { scrollToSection } from '@/lib/utils/scroll';
import { FONT_SERIF, FONT_SANS, FONT_MONO } from '@/lib/ui/fonts';
import type { CSSProperties } from 'react';
import type { BusinessVM, HeroVariant } from '@/lib/viewModel/businessViewModel';

/**
 * Hero — three variants exposed per business via website_hero_variant:
 *   'photo'  — photo background with ambient breath/drift/vignette + bg video.
 *   'type'   — type-led, no hero image.
 *   'split'  — 50/50 type + photo.
 * Italic accent on hero_headline_2 is the brand voice moment. Ported
 * near-verbatim from handoff/reference/sections.jsx.
 */
export function Hero({
  b,
  accent,
  variant
}: {
  b: BusinessVM;
  accent: string;
  variant: HeroVariant;
}) {
  const [ref, v] = useReveal();
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  // iOS autoplay: React does not reflect `muted` as an HTML attribute, so iOS
  // Safari treats the hero video as unmuted and refuses to autoplay (the layer
  // stays blank over the poster). Force muted on the element and kick playback
  // once it mounts (revealed + reduced-motion allows it).
  const heroVideoRef = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    const vid = heroVideoRef.current;
    if (!vid) return;
    vid.muted = true;
    vid.defaultMuted = true;
    vid.play().catch(() => {});
  }, [v, reducedMotion]);

  const Eyebrow = (
    <div
      style={{
        fontSize: 12,
        fontFamily: FONT_MONO,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: accent,
        marginBottom: 24,
        fontWeight: 500,
        opacity: v ? 1 : 0,
        transform: v ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1) 200ms'
      }}
    >
      {b.tagline}
    </div>
  );

  const Headline = (
    <h1
      style={{
        fontFamily: FONT_SERIF,
        fontWeight: 400,
        fontSize: variant === 'type' ? 'clamp(54px, 9vw, 140px)' : 'clamp(44px, 7.5vw, 116px)',
        lineHeight: 0.94,
        letterSpacing: '-0.03em',
        marginBottom: 'clamp(20px, 3vw, 32px)',
        maxWidth: '14ch',
        opacity: v ? 1 : 0,
        transform: v ? 'translateY(0)' : 'translateY(40px)',
        transition: 'all 1200ms cubic-bezier(0.16, 1, 0.3, 1) 350ms'
      }}
    >
      {b.hero_headline_1}
      <br />
      <span style={{ color: accent, fontStyle: 'italic', fontWeight: 300 }}>{b.hero_headline_2}</span>
    </h1>
  );

  const Subhead = (
    <p
      style={{
        fontSize: 'clamp(17px, 1.7vw, 21px)',
        lineHeight: 1.5,
        maxWidth: 580,
        opacity: v ? 0.92 : 0,
        transform: v ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 1000ms cubic-bezier(0.16, 1, 0.3, 1) 550ms',
        marginBottom: 'clamp(28px, 4vw, 40px)'
      }}
    >
      {b.hero_subhead}
    </p>
  );

  const Ctas = (
    <div
      style={{
        display: 'flex',
        gap: 12,
        flexWrap: 'wrap',
        opacity: v ? 1 : 0,
        transform: v ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 1000ms cubic-bezier(0.16, 1, 0.3, 1) 750ms',
        marginBottom: 28
      }}
    >
      <button
        onClick={() => scrollToSection('events')}
        className="cta-primary"
        style={{
          background: accent,
          color: '#080808',
          border: 'none',
          padding: '18px 30px',
          borderRadius: 12,
          fontFamily: FONT_SANS,
          fontSize: 15,
          fontWeight: 600,
          cursor: 'pointer',
          minHeight: 56,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
          boxShadow: 'var(--shadow-lg), var(--inset-highlight)'
        }}
      >
        Book your event →
      </button>
      <button
        onClick={() => scrollToSection('coaching')}
        className="cta-secondary"
        style={{
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          color: '#fafafa',
          border: '1px solid rgba(255,255,255,0.15)',
          padding: '18px 30px',
          borderRadius: 12,
          fontFamily: FONT_SANS,
          fontSize: 15,
          fontWeight: 500,
          cursor: 'pointer',
          minHeight: 56
        }}
      >
        Book a lesson
      </button>
    </div>
  );

  const Trust = (
    <div
      style={{
        display: 'flex',
        gap: 10,
        flexWrap: 'wrap',
        opacity: v ? 1 : 0,
        transform: v ? 'translateY(0)' : 'translateY(12px)',
        transition: 'all 1000ms cubic-bezier(0.16, 1, 0.3, 1) 900ms'
      }}
    >
      {b.trust_signals.map((t, i) => (
        <div
          key={i}
          className="hover-pill"
          style={
            {
              padding: '7px 14px 7px 12px',
              background: 'rgba(255,255,255,0.035)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 999,
              fontSize: 11,
              fontFamily: FONT_MONO,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'rgba(255,255,255,0.82)',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
              cursor: 'default',
              '--hover-accent': `${accent}55`
            } as CSSProperties
          }
        >
          <span
            style={{
              width: 4,
              height: 4,
              borderRadius: '50%',
              background: accent,
              flexShrink: 0,
              opacity: 0.7
            }}
          />
          {t.label}
        </div>
      ))}
    </div>
  );

  const TopUtility = (
    <nav
      style={{
        position: 'relative',
        zIndex: 2,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 'clamp(18px, 3vw, 28px) clamp(20px, 4vw, 40px)',
        opacity: v ? 1 : 0,
        transition: 'opacity 1000ms ease 100ms',
        gap: 16,
        flexWrap: 'wrap'
      }}
    >
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        aria-label={b.name}
        style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
      >
        <Image
          src={b.logo}
          alt={b.name}
          width={68}
          height={68}
          className="brand-logo"
          style={
            {
              borderRadius: '50%',
              filter: 'invert(1)',
              background: '#080808',
              flexShrink: 0,
              '--logo-glow': `${accent}55`
            } as CSSProperties
          }
        />
      </a>
      <div
        className="hover-pill"
        style={
          {
            display: 'inline-flex',
            alignItems: 'center',
            gap: 10,
            padding: '8px 14px 8px 12px',
            background: 'rgba(255,255,255,0.04)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 999,
            cursor: 'default',
            '--hover-accent': `${accent}55`
          } as CSSProperties
        }
      >
        <span
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#4ade80',
            boxShadow: '0 0 10px #4ade80',
            animation: 'pulse 2.4s ease-in-out infinite',
            flexShrink: 0
          }}
        />
        <span
          style={{
            fontFamily: FONT_MONO,
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.78)',
            fontWeight: 500
          }}
        >
          Taking 2026 dates
        </span>
      </div>
    </nav>
  );

  // ── Variant: photo (with an optional looping bg video) ───────────────────
  if (variant === 'photo') {
    const hasVideo = !!b.hero_image.videoUrl;
    return (
      <header
        ref={ref as React.RefObject<HTMLElement>}
        style={{
          position: 'relative',
          minHeight: 'min(100vh, 880px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
      >
        {/* Photo background — always present. When a video is supplied, the video
            layers on top muted/autoplay/loop and the photo is the fallback
            (also what reduced-motion users see). */}
        <div
          className={v ? 'hero-bg-ambient' : ''}
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${b.hero_image.url})`,
            backgroundSize: 'cover',
            backgroundPosition: '50% 50%',
            transform: v ? 'scale(1)' : 'scale(1.06)',
            transition: 'transform 2200ms cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform, background-position'
          }}
        />

        {hasVideo && !reducedMotion && (
          <video
            ref={heroVideoRef}
            className="hero-video"
            src={b.hero_image.videoUrl as string}
            poster={b.hero_image.url}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: '50% 50%',
              opacity: v ? 1 : 0,
              transition: 'opacity 1800ms cubic-bezier(0.16, 1, 0.3, 1) 400ms',
              filter: 'contrast(1.05) saturate(0.95)'
            }}
          />
        )}

        <div
          className={v ? 'hero-vignette' : ''}
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(180deg, rgba(8,8,8,0.7) 0%, rgba(8,8,8,0.25) 35%, rgba(8,8,8,0.96) 100%)',
            willChange: 'opacity'
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 25% 75%, ${accent}1A 0%, transparent 55%)`
          }}
        />

        {TopUtility}

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: 'clamp(32px, 6vw, 72px) clamp(20px, 4vw, 40px) clamp(40px, 6vw, 80px)',
            maxWidth: 1600,
            margin: '0 auto',
            width: '100%'
          }}
        >
          {Eyebrow}
          {Headline}
          {Subhead}
          {Ctas}
          {Trust}
        </div>
      </header>
    );
  }

  // ── Variant: type-led ────────────────────────────────────────────────────
  if (variant === 'type') {
    return (
      <header
        ref={ref as React.RefObject<HTMLElement>}
        style={{
          position: 'relative',
          minHeight: 'min(100vh, 880px)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: '#080808'
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at 70% 20%, ${accent}10 0%, transparent 60%)`
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '-10%',
            top: '8%',
            width: 'clamp(280px, 32vw, 520px)',
            height: 'clamp(280px, 32vw, 520px)',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${accent}06 0%, transparent 70%)`,
            opacity: v ? 1 : 0,
            transition: 'opacity 2000ms ease 400ms'
          }}
        />

        {TopUtility}

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: 'clamp(48px, 8vw, 96px) clamp(20px, 4vw, 40px)',
            maxWidth: 1600,
            margin: '0 auto',
            width: '100%'
          }}
        >
          {Eyebrow}
          {Headline}
          {Subhead}
          {Ctas}
          {Trust}
        </div>
      </header>
    );
  }

  // ── Variant: split (50/50 type + photo) ─────────────────────────────────
  return (
    <header
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        position: 'relative',
        minHeight: 'min(100vh, 880px)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#080808'
      }}
    >
      {TopUtility}

      <div
        className="hero-split"
        style={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
          gap: 'clamp(24px, 4vw, 64px)',
          padding: 'clamp(32px, 6vw, 72px) clamp(20px, 4vw, 40px) clamp(40px, 6vw, 80px)',
          maxWidth: 1600,
          margin: '0 auto',
          width: '100%',
          alignItems: 'center'
        }}
      >
        <div>
          {Eyebrow}
          {Headline}
          {Subhead}
          {Ctas}
          {Trust}
        </div>
        <div
          style={{
            position: 'relative',
            aspectRatio: '4/5',
            overflow: 'hidden',
            borderRadius: 16,
            opacity: v ? 1 : 0,
            transform: v ? 'translateY(0) scale(1)' : 'translateY(20px) scale(1.04)',
            transition: 'all 1400ms cubic-bezier(0.16, 1, 0.3, 1) 250ms'
          }}
        >
          <Image
            src={b.hero_image.url}
            alt={b.hero_image.alt || ''}
            fill
            sizes="(max-width: 900px) 100vw, 45vw"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'contrast(1.05) saturate(0.95)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `linear-gradient(180deg, transparent 60%, ${accent}22 100%)`
            }}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .hero-split { grid-template-columns: 1fr !important; }
          .hero-split > div:last-child { display: none; }
        }
      `}</style>
    </header>
  );
}
