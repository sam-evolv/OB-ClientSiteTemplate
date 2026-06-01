// ============================================================================
// Chrome + helpers — these don't change per business.
// Hooks · OpenBookBadge · StickyNav · StickyBookBar · BusinessImage · BusinessVideo
// ============================================================================
const { useState, useEffect, useRef } = React;

// ── Hooks ──────────────────────────────────────────────────────────────────

function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setV(true);
      return;
    }
    const o = new IntersectionObserver(
      (entries) => entries.forEach((x) => {
        if (x.isIntersecting) { setV(true); o.disconnect(); }
      }),
      { threshold, rootMargin: '0px 0px -6% 0px' }
    );
    o.observe(ref.current);
    return () => o.disconnect();
  }, [threshold]);
  return [ref, v];
}

function useScrolledPast(px = 500) {
  const [s, setS] = useState(false);
  useEffect(() => {
    const onS = () => setS(window.scrollY > px);
    onS();
    window.addEventListener('scroll', onS, { passive: true });
    return () => window.removeEventListener('scroll', onS);
  }, [px]);
  return s;
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(id); }),
        { threshold: 0.3, rootMargin: '-30% 0px -40% 0px' }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o && o.disconnect());
  }, [ids.join(',')]);
  return active;
}

function scrollToSection(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const top = el.getBoundingClientRect().top + window.pageYOffset - 80;
  window.scrollTo({ top, behavior: 'smooth' });
}

// ── Count-up — animates a number from 0 → target when `active` flips true.
// Respects reduced-motion (snaps straight to target). easeOutCubic.

function useCountUp(target, active, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(target);
      return;
    }
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration]);
  return val;
}

// ── Scroll progress — hairline accent bar at the very top of the viewport
// that fills left→right as the page is read. The premium "you are here" cue.

function ScrollProgress({ accent }) {
  const [p, setP] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      setP(h > 0 ? Math.min(1, Math.max(0, window.scrollY / h)) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, height: 2, zIndex: 100,
      pointerEvents: 'none',
    }}>
      <div style={{
        height: '100%', width: '100%',
        background: accent,
        transformOrigin: 'left center',
        transform: `scaleX(${p})`,
        transition: 'transform 120ms linear',
        boxShadow: `0 0 12px ${accent}80`,
        opacity: p > 0.005 ? 1 : 0,
      }} />
    </div>
  );
}

// ── OpenBook badge — gold-accent footer mark. Only place gold appears. ─────

function OpenBookBadge({ size = 'sm' }) {
  const sm = size === 'sm';
  const h = sm ? 44 : 60;
  return (
    <a
      href="https://openbook.ie"
      target="_blank"
      rel="noopener"
      className="ob-badge"
      aria-label="Powered by OpenBook"
      style={{
        display: 'inline-block',
        textDecoration: 'none',
        lineHeight: 0,
        borderRadius: 999,
      }}
    >
      <img
        src="./media/powered-by-openbook.png"
        alt="Powered by OpenBook"
        style={{
          display: 'block',
          height: h, width: 'auto',
        }}
      />
    </a>
  );
}

// ── Sticky top nav (appears once hero is scrolled past) ────────────────────

function StickyNav({ visible, business, sections, accent }) {
  const active = useActiveSection(sections.map((s) => s.id));
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav
      className="sticky-nav-edge"
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 90,
        padding: 'clamp(12px, 1.5vw, 16px) clamp(16px, 3vw, 32px)',
        background: 'rgba(8,8,8,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        transform: visible ? 'translateY(0)' : 'translateY(-110%)',
        transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
        pointerEvents: visible ? 'auto' : 'none',
      }}
    >
      <div style={{
        maxWidth: 1600, margin: '0 auto',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        gap: 16,
      }}>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label={business.name}
          style={{
            background: 'none', border: 'none', cursor: 'pointer',
            padding: 0, display: 'inline-flex', alignItems: 'center',
            flexShrink: 0,
          }}
        >
          <img
            src={business.logo}
            alt={business.name}
            width={48}
            height={48}
            className="brand-logo"
            style={{
              borderRadius: '50%',
              filter: 'invert(1)',
              background: '#080808',
              '--logo-glow': `${accent}55`,
            }}
          />
        </button>

        <div className="nav-links" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          {sections.map((s) => (
            <button
              key={s.id}
              className="nav-link"
              onClick={() => scrollToSection(s.id)}
              style={{
                color: active === s.id ? accent : 'rgba(255,255,255,0.65)',
              }}
            >
              {s.label}
              {active === s.id && (
                <span style={{
                  position: 'absolute', bottom: 2, left: '50%',
                  transform: 'translateX(-50%)',
                  width: 4, height: 4, borderRadius: '50%',
                  background: accent,
                }} />
              )}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <button
            onClick={() => scrollToSection('events')}
            className="nav-book"
            style={{
              background: accent, color: '#080808', border: 'none',
              padding: '10px 18px', borderRadius: 999,
              fontFamily: 'Geist, system-ui, sans-serif',
              fontSize: 13, fontWeight: 600,
              cursor: 'pointer', minHeight: 40,
              letterSpacing: '0.01em',
              boxShadow: `0 4px 16px ${accent}40`,
              '--hover-accent': `${accent}80`,
            }}
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
              borderRadius: 8, padding: 8,
              cursor: 'pointer', minHeight: 40, minWidth: 40,
              display: 'none', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <div style={{
              width: 16, height: 12,
              display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
            }}>
              <span style={{
                height: 1.5, background: '#fafafa', borderRadius: 1,
                transform: menuOpen ? 'translateY(5px) rotate(45deg)' : 'none',
                transition: 'transform 200ms ease',
              }} />
              <span style={{
                height: 1.5, background: '#fafafa', borderRadius: 1,
                opacity: menuOpen ? 0 : 1, transition: 'opacity 200ms ease',
              }} />
              <span style={{
                height: 1.5, background: '#fafafa', borderRadius: 1,
                transform: menuOpen ? 'translateY(-5px) rotate(-45deg)' : 'none',
                transition: 'transform 200ms ease',
              }} />
            </div>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, right: 0,
          background: 'rgba(8,8,8,0.96)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          padding: 16,
        }}>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => { scrollToSection(s.id); setMenuOpen(false); }}
              style={{
                display: 'block', width: '100%',
                background: 'none', border: 'none',
                padding: '14px 16px',
                fontFamily: 'Geist, system-ui, sans-serif',
                fontSize: 15, fontWeight: 500,
                color: active === s.id ? accent : 'rgba(255,255,255,0.8)',
                textAlign: 'left', cursor: 'pointer', borderRadius: 8,
                letterSpacing: '0.01em', minHeight: 48,
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

// ── Sticky book bar — bottom thumb-zone, always one tap to enquire ─────────

function StickyBookBar({ visible, accent }) {
  return (
    <div style={{
      position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 80,
      padding: 'clamp(12px, 2vw, 16px)',
      transform: visible ? 'translateY(0)' : 'translateY(110%)',
      transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
      pointerEvents: visible ? 'auto' : 'none',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center',
        background: 'rgba(8,8,8,0.94)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 8, gap: 12,
        maxWidth: 600, margin: '0 auto',
        boxShadow: 'var(--shadow-xl)',
      }}>
        <div style={{ flex: 1, padding: '4px 14px', display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
          <span style={{
            width: 8, height: 8, borderRadius: '50%',
            background: '#4ade80', boxShadow: '0 0 12px #4ade80', flexShrink: 0,
          }} />
          <div style={{ fontFamily: 'Geist, system-ui, sans-serif', fontSize: 13, color: '#fafafa', lineHeight: 1.3, minWidth: 0 }}>
            <div style={{ fontWeight: 500 }}>Taking bookings</div>
            <div style={{ opacity: 0.55, fontSize: 11, fontFamily: 'Geist Mono, monospace' }}>
              For 2026 dates
            </div>
          </div>
        </div>
        <button
          onClick={() => scrollToSection('events')}
          className="cta-primary"
          style={{
            background: accent, color: '#080808', border: 'none',
            padding: '14px 22px', borderRadius: 10,
            fontFamily: 'Geist, system-ui, sans-serif',
            fontSize: 14, fontWeight: 600,
            letterSpacing: '0.02em', cursor: 'pointer',
            minHeight: 48, minWidth: 110, whiteSpace: 'nowrap',
            boxShadow: 'var(--shadow-md), var(--inset-highlight)',
          }}
        >
          Get a quote →
        </button>
      </div>
    </div>
  );
}

// ── Image with caption-on-hover + placeholder fallback ─────────────────────

function BusinessImage({ image, fallbackLabel, accent, aspect = '4/3', style = {} }) {
  const [hover, setHover] = useState(false);
  if (image && image.url) {
    return (
      <div
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        style={{
          position: 'relative', aspectRatio: aspect, overflow: 'hidden',
          background: '#0c0c0c', ...style,
        }}
      >
        <img
          src={image.url}
          alt={image.alt || ''}
          loading="lazy"
          style={{
            width: '100%', height: '100%', objectFit: 'cover',
            filter: 'contrast(1.05) saturate(0.95)',
            transform: hover ? 'scale(1.03)' : 'scale(1)',
            transition: 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        />
        {image.caption && (
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '24px 16px 14px',
            background: 'linear-gradient(180deg, transparent 0%, rgba(8,8,8,0.92) 100%)',
            fontSize: 13, fontFamily: 'Geist, system-ui, sans-serif',
            color: 'rgba(255,255,255,0.95)',
            opacity: hover ? 1 : 0,
            transform: hover ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 400ms cubic-bezier(0.16, 1, 0.3, 1)',
            pointerEvents: 'none',
          }}>
            {image.caption}
          </div>
        )}
      </div>
    );
  }
  return (
    <div style={{
      aspectRatio: aspect,
      background: `linear-gradient(135deg, ${accent}10 0%, ${accent}03 100%)`,
      border: `1px solid ${accent}25`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      ...style,
    }}>
      <div style={{
        fontFamily: 'Fraunces, Georgia, serif', fontStyle: 'italic',
        fontWeight: 300, fontSize: 'clamp(18px, 2vw, 28px)',
        color: accent, opacity: 0.55, textAlign: 'center', padding: 24,
      }}>
        {fallbackLabel}
      </div>
    </div>
  );
}

// ── Inline video — plays muted/autoplay on tap; poster + play overlay otherwise.
// Designed for the videos the user will drop in once they're ready: poster image
// shows immediately, real videoUrl gets played on click.

function BusinessVideo({ video, accent, aspect = '4/5', style = {}, label }) {
  const [playing, setPlaying] = useState(false);
  const ref = useRef(null);

  const handlePlay = () => {
    if (!video || !video.videoUrl) return;
    if (ref.current) {
      ref.current.play();
      setPlaying(true);
    }
  };

  if (!video || (!video.posterUrl && !video.videoUrl)) {
    return (
      <div style={{
        aspectRatio: aspect,
        background: `linear-gradient(135deg, ${accent}10 0%, ${accent}03 100%)`,
        border: `1px solid ${accent}25`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        ...style,
      }}>
        <div style={{
          fontFamily: 'Fraunces, Georgia, serif', fontStyle: 'italic',
          color: accent, opacity: 0.55,
        }}>
          Video coming soon
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handlePlay}
      style={{
        position: 'relative', aspectRatio: aspect, overflow: 'hidden',
        background: '#0c0c0c',
        cursor: video.videoUrl ? 'pointer' : 'default',
        ...style,
      }}
    >
      {video.videoUrl && playing ? (
        <video
          ref={ref}
          src={video.videoUrl}
          controls
          autoPlay
          playsInline
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <>
          <img
            src={video.posterUrl}
            alt={video.alt || ''}
            loading="lazy"
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: 'contrast(1.05) saturate(0.95)',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, transparent 0%, rgba(8,8,8,0.5) 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(8,8,8,0.6)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              border: `2px solid ${accent}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 200ms ease',
            }}>
              <svg width="20" height="22" viewBox="0 0 24 24" fill={accent} style={{ marginLeft: 3 }}>
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
          {label && (
            <div style={{
              position: 'absolute', bottom: 16, left: 16,
              padding: '6px 12px',
              background: 'rgba(8,8,8,0.78)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6,
              fontSize: 11, fontFamily: 'Geist Mono, monospace',
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: accent, fontWeight: 500,
              display: 'inline-block',
              width: 'fit-content',
            }}>
              {label}
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Expose for the section file
Object.assign(window, {
  useReveal, useScrolledPast, useActiveSection, useCountUp, scrollToSection,
  OpenBookBadge, StickyNav, StickyBookBar, ScrollProgress, BusinessImage, BusinessVideo,
  Trajectory, Lightbox,
});

// ── Trajectory ─────────────────────────────────────────────────────────────
//
// The proprietary visual signature: a ball-flight arc. Stripe has its gradient,
// Linear has its orb — this is the texture that says "you are looking at a
// SIMply Golf 365 site and only a SIMply Golf 365 site". Three sizes:
//   variant="hero"    — large arc that draws on reveal, sits in the hero corner
//   variant="divider" — long thin arc used as a section break
//   variant="inline"  — tiny dotted arc, fits in a 64×24 box (used in stats)

function Trajectory({ accent, reveal = true, variant = 'hero' }) {
  if (variant === 'inline') {
    // Tiny: connects stat numbers with a hint of a ball-flight path.
    return (
      <svg width="64" height="24" viewBox="0 0 64 24" fill="none"
           aria-hidden="true" style={{ display: 'block' }}>
        <path
          d="M 2 20 Q 18 -4 32 8 T 62 4"
          stroke={accent} strokeWidth="1" strokeLinecap="round"
          strokeDasharray="2 4" opacity="0.5" fill="none"
        />
        <circle cx="62" cy="4" r="1.6" fill={accent} opacity="0.85" />
      </svg>
    );
  }

  if (variant === 'divider') {
    return (
      <svg width="100%" height="60" viewBox="0 0 1200 60" preserveAspectRatio="none"
           aria-hidden="true" style={{ display: 'block', opacity: 0.45 }}>
        <path
          d="M 0 55 Q 300 -20 600 30 T 1200 10"
          stroke={accent} strokeWidth="1" strokeLinecap="round"
          strokeDasharray="3 8" fill="none"
        />
        <circle cx="1200" cy="10" r="3" fill={accent} />
      </svg>
    );
  }

  // hero — the signature moment. Sits absolute in the upper-right.
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 320 220"
      preserveAspectRatio="xMaxYMin meet"
      style={{
        position: 'absolute',
        top: 'clamp(60px, 8vw, 96px)',
        right: 'clamp(20px, 4vw, 56px)',
        width: 'clamp(180px, 22vw, 320px)',
        height: 'auto',
        zIndex: 2,
        pointerEvents: 'none',
        opacity: reveal ? 1 : 0,
        transition: 'opacity 1400ms cubic-bezier(0.16, 1, 0.3, 1) 600ms',
      }}
    >
      <defs>
        <linearGradient id="trajGrad" x1="0" y1="220" x2="320" y2="0">
          <stop offset="0%"   stopColor={accent} stopOpacity="0" />
          <stop offset="35%"  stopColor={accent} stopOpacity="0.6" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.95" />
        </linearGradient>
      </defs>
      <path
        d="M 8 210 Q 140 -30 285 80 T 312 60"
        stroke="url(#trajGrad)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray="800"
        strokeDashoffset={reveal ? '0' : '800'}
        fill="none"
        style={{
          transition: 'stroke-dashoffset 2400ms cubic-bezier(0.16, 1, 0.3, 1) 500ms',
        }}
      />
      {/* Faint tee marker (start) */}
      <circle cx="8" cy="210" r="2" fill={accent} opacity="0.4" />
      {/* Ball (end) */}
      <circle
        cx="312" cy="60" r="4" fill={accent}
        style={{
          opacity: reveal ? 1 : 0,
          transition: 'opacity 600ms ease 2600ms',
        }}
      />
    </svg>
  );
}

// ── Lightbox ───────────────────────────────────────────────────────────────
//
// Fullscreen overlay for gallery items. Keyboard: ← / → / Esc.
// Click backdrop to close. Tap controls on mobile.

function Lightbox({ items, openIndex, onClose }) {
  const [idx, setIdx] = useState(openIndex);
  const [direction, setDirection] = useState(0);

  useEffect(() => { setIdx(openIndex); }, [openIndex]);

  useEffect(() => {
    if (openIndex === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft')  { setDirection(-1); setIdx((i) => (i - 1 + items.length) % items.length); }
      if (e.key === 'ArrowRight') { setDirection( 1); setIdx((i) => (i + 1) % items.length); }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [openIndex, onClose, items.length]);

  if (openIndex === null) return null;
  const item = items[idx];

  const next = () => { setDirection( 1); setIdx((i) => (i + 1) % items.length); };
  const prev = () => { setDirection(-1); setIdx((i) => (i - 1 + items.length) % items.length); };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(8,8,8,0.95)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 'clamp(16px, 4vw, 48px)',
        animation: 'lbFadeIn 200ms cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    >
      {/* Close (top-right) */}
      <button
        onClick={(e) => { e.stopPropagation(); onClose(); }}
        aria-label="Close"
        style={{
          position: 'absolute', top: 20, right: 20, zIndex: 3,
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.12)',
          cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fafafa', fontSize: 20, lineHeight: 1,
        }}
      >×</button>

      {/* Counter (top-left) */}
      <div style={{
        position: 'absolute', top: 28, left: 28, zIndex: 3,
        fontFamily: 'Geist Mono, monospace',
        fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
        color: 'rgba(255,255,255,0.6)',
      }}>
        {String(idx + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
      </div>

      {/* Prev */}
      {items.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); prev(); }}
          aria-label="Previous"
          style={{
            position: 'absolute', left: 'clamp(8px, 2vw, 24px)', top: '50%',
            transform: 'translateY(-50%)', zIndex: 3,
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer', color: '#fafafa',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      {/* Next */}
      {items.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); next(); }}
          aria-label="Next"
          style={{
            position: 'absolute', right: 'clamp(8px, 2vw, 24px)', top: '50%',
            transform: 'translateY(-50%)', zIndex: 3,
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            cursor: 'pointer', color: '#fafafa',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      )}

      {/* Media */}
      <div
        key={idx}
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 'min(1100px, 92vw)',
          maxHeight: '82vh',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
          animation: `lbSlide ${direction >= 0 ? 'In' : 'InRev'} 300ms cubic-bezier(0.16, 1, 0.3, 1)`,
        }}
      >
        {item.type === 'video' && item.videoUrl ? (
          <video
            src={item.videoUrl} poster={item.posterUrl}
            controls autoPlay playsInline
            style={{
              maxWidth: '100%', maxHeight: '72vh',
              borderRadius: 12, background: '#0c0c0c',
            }}
          />
        ) : (
          <img
            src={item.url || item.posterUrl}
            alt={item.alt || ''}
            style={{
              maxWidth: '100%', maxHeight: '72vh',
              objectFit: 'contain', borderRadius: 12,
            }}
          />
        )}

        {item.caption && (
          <div style={{
            fontFamily: 'Fraunces, Georgia, serif',
            fontWeight: 300, fontStyle: 'italic',
            fontSize: 'clamp(14px, 1.4vw, 17px)',
            color: 'rgba(255,255,255,0.78)',
            textAlign: 'center', maxWidth: '60ch',
            padding: '0 12px',
          }}>
            {item.caption}
          </div>
        )}
      </div>

      <style>{`
        @keyframes lbFadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes lbSlideIn    { from { opacity: 0; transform: translateX(24px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes lbSlideInRev { from { opacity: 0; transform: translateX(-24px); } to { opacity: 1; transform: translateX(0); } }
      `}</style>
    </div>
  );
}
