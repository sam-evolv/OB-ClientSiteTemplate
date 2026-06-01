// ============================================================================
// Sections — every component in the locked section order.
// Hero · Stats · Mission · Events · About · Gallery · Travel · Press · Contact · Footer
//
// Section visibility comes from the `visible` map passed in by <Site>. When a
// section's flag is false, it returns null and the next section absorbs the
// rhythm. This is how the system handles "no press yet, no reviews yet".
// ============================================================================

const {
  useReveal, useScrolledPast, useCountUp, scrollToSection,
  OpenBookBadge, StickyNav, StickyBookBar, BusinessImage, BusinessVideo,
  Trajectory, Lightbox,
} = window;

// ── Stat value — counts up when numeric, plain render otherwise. ───────────
function StatValue({ value, reveal }) {
  const isNumeric = /^\d+$/.test(String(value));
  const target = isNumeric ? parseInt(value, 10) : 0;
  const counted = useCountUp(target, reveal && isNumeric);
  return <>{isNumeric ? counted : value}</>;
}

// ── Hero ───────────────────────────────────────────────────────────────────
//
// Three variants exposed via Tweaks:
//   'photo'  — original v9. Photo background with ambient breath/drift/vignette.
//   'type'   — type-led. No hero image. Big serif statement, mark on left.
//   'split'  — 50/50. Type on left, photo on right (collapses to stack on mobile).
//
// Italic accent on hero_headline_2 is the brand voice moment.

function Hero({ b, accent, variant, reveal }) {
  const [ref, v] = useReveal();
  const [reducedMotion, setReducedMotion] = React.useState(false);
  React.useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const apply = () => setReducedMotion(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  const Eyebrow = (
    <div style={{
      fontSize: 12, fontFamily: 'Geist Mono, monospace',
      letterSpacing: '0.2em', textTransform: 'uppercase',
      color: accent, marginBottom: 24, fontWeight: 500,
      opacity: v ? 1 : 0,
      transform: v ? 'translateY(0)' : 'translateY(12px)',
      transition: 'all 800ms cubic-bezier(0.16, 1, 0.3, 1) 200ms',
    }}>
      {b.tagline}
    </div>
  );

  const Headline = (
    <h1 style={{
      fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400,
      fontSize: variant === 'type' ? 'clamp(54px, 9vw, 140px)' : 'clamp(44px, 7.5vw, 116px)',
      lineHeight: 0.94, letterSpacing: '-0.03em',
      marginBottom: 'clamp(20px, 3vw, 32px)',
      maxWidth: '14ch',
      opacity: v ? 1 : 0,
      transform: v ? 'translateY(0)' : 'translateY(40px)',
      transition: 'all 1200ms cubic-bezier(0.16, 1, 0.3, 1) 350ms',
    }}>
      {b.hero_headline_1}<br />
      <span style={{ color: accent, fontStyle: 'italic', fontWeight: 300 }}>
        {b.hero_headline_2}
      </span>
    </h1>
  );

  const Subhead = (
    <p style={{
      fontSize: 'clamp(17px, 1.7vw, 21px)', lineHeight: 1.5,
      maxWidth: 580,
      opacity: v ? 0.92 : 0,
      transform: v ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 1000ms cubic-bezier(0.16, 1, 0.3, 1) 550ms',
      marginBottom: 'clamp(28px, 4vw, 40px)',
    }}>
      {b.hero_subhead}
    </p>
  );

  const Ctas = (
    <div style={{
      display: 'flex', gap: 12, flexWrap: 'wrap',
      opacity: v ? 1 : 0,
      transform: v ? 'translateY(0)' : 'translateY(20px)',
      transition: 'all 1000ms cubic-bezier(0.16, 1, 0.3, 1) 750ms',
      marginBottom: 28,
    }}>
      <button
        onClick={() => scrollToSection('events')}
        className="cta-primary"
        style={{
          background: accent, color: '#080808', border: 'none',
          padding: '18px 30px', borderRadius: 12,
          fontFamily: 'Geist, system-ui, sans-serif',
          fontSize: 15, fontWeight: 600,
          cursor: 'pointer', minHeight: 56,
          display: 'inline-flex', alignItems: 'center', gap: 10,
          boxShadow: 'var(--shadow-lg), var(--inset-highlight)',
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
          padding: '18px 30px', borderRadius: 12,
          fontFamily: 'Geist, system-ui, sans-serif',
          fontSize: 15, fontWeight: 500,
          cursor: 'pointer', minHeight: 56,
        }}
      >
        Book a lesson
      </button>
    </div>
  );

  const Trust = (
    <div style={{
      display: 'flex', gap: 10, flexWrap: 'wrap',
      opacity: v ? 1 : 0,
      transform: v ? 'translateY(0)' : 'translateY(12px)',
      transition: 'all 1000ms cubic-bezier(0.16, 1, 0.3, 1) 900ms',
    }}>
      {b.trust_signals.map((t, i) => (
        <div key={i}
          className="hover-pill"
          style={{
          padding: '7px 14px 7px 12px',
          background: 'rgba(255,255,255,0.035)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 999,
          fontSize: 11,
          fontFamily: 'Geist Mono, monospace',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.82)',
          fontWeight: 500,
          display: 'inline-flex', alignItems: 'center', gap: 8,
          cursor: 'default',
          '--hover-accent': `${accent}55`,
        }}>
          <span style={{
            width: 4, height: 4, borderRadius: '50%',
            background: accent, flexShrink: 0, opacity: 0.7,
          }} />
          {t.label}
        </div>
      ))}
    </div>
  );

  const TopUtility = (
    <nav style={{
      position: 'relative', zIndex: 2,
      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      padding: 'clamp(18px, 3vw, 28px) clamp(20px, 4vw, 40px)',
      opacity: v ? 1 : 0,
      transition: 'opacity 1000ms ease 100ms',
      gap: 16, flexWrap: 'wrap',
    }}>
      <a
        href="#" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
        aria-label={b.name}
        style={{ display: 'inline-flex', alignItems: 'center', textDecoration: 'none' }}
      >
        <img
          src={b.logo} alt={b.name}
          width={68} height={68}
          className="brand-logo"
          style={{
            borderRadius: '50%',
            filter: 'invert(1)',
            background: '#080808',
            flexShrink: 0,
            '--logo-glow': `${accent}55`,
          }}
        />
      </a>
      <div
        className="hover-pill"
        style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '8px 14px 8px 12px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 999,
        cursor: 'default',
        '--hover-accent': `${accent}55`,
      }}>
        <span style={{
          width: 7, height: 7, borderRadius: '50%',
          background: '#4ade80', boxShadow: '0 0 10px #4ade80',
          animation: 'pulse 2.4s ease-in-out infinite', flexShrink: 0,
        }} />
        <span style={{
          fontFamily: 'Geist Mono, monospace',
          fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.78)', fontWeight: 500,
        }}>
          Taking 2026 dates
        </span>
      </div>
    </nav>
  );

  // ── Variant: photo (original v9, optionally with a looping bg video) ────
  if (variant === 'photo') {
    const hasVideo = !!b.hero_image.videoUrl;
    return (
      <header ref={ref} style={{
        position: 'relative',
        minHeight: 'min(100vh, 880px)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Photo background — always present. When a video is supplied, the
            video layers on top muted/autoplay/loop and the photo is fallback
            (also what reduced-motion users see). */}
        <div
          className={v ? 'hero-bg-ambient' : ''}
          style={{
            position: 'absolute', inset: 0,
            backgroundImage: `url(${b.hero_image.url})`,
            backgroundSize: 'cover',
            backgroundPosition: '50% 50%',
            transform: v ? 'scale(1)' : 'scale(1.06)',
            transition: 'transform 2200ms cubic-bezier(0.16, 1, 0.3, 1)',
            willChange: 'transform, background-position',
          }}
        />

        {hasVideo && !reducedMotion && (
          <video
            className="hero-video"
            src={b.hero_image.videoUrl}
            poster={b.hero_image.url}
            autoPlay muted loop playsInline preload="metadata"
            style={{
              position: 'absolute', inset: 0,
              width: '100%', height: '100%',
              objectFit: 'cover', objectPosition: '50% 50%',
              opacity: v ? 1 : 0,
              transition: 'opacity 1800ms cubic-bezier(0.16, 1, 0.3, 1) 400ms',
              filter: 'contrast(1.05) saturate(0.95)',
            }}
          />
        )}

        <div
          className={v ? 'hero-vignette' : ''}
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(180deg, rgba(8,8,8,0.7) 0%, rgba(8,8,8,0.25) 35%, rgba(8,8,8,0.96) 100%)',
            willChange: 'opacity',
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 25% 75%, ${accent}1A 0%, transparent 55%)`,
        }} />

        {TopUtility}

        <div style={{
          position: 'relative', zIndex: 2, flex: 1,
          display: 'flex', flexDirection: 'column', justifyContent: 'flex-end',
          padding: 'clamp(32px, 6vw, 72px) clamp(20px, 4vw, 40px) clamp(40px, 6vw, 80px)',
          maxWidth: 1600, margin: '0 auto', width: '100%',
        }}>
          {Eyebrow}{Headline}{Subhead}{Ctas}{Trust}
        </div>
      </header>
    );
  }

  // ── Variant: type-led ────────────────────────────────────────────────────
  if (variant === 'type') {
    return (
      <header ref={ref} style={{
        position: 'relative',
        minHeight: 'min(100vh, 880px)',
        display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
        background: '#080808',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(ellipse at 70% 20%, ${accent}10 0%, transparent 60%)`,
        }} />
        <div style={{
          position: 'absolute', right: '-10%', top: '8%',
          width: 'clamp(280px, 32vw, 520px)', height: 'clamp(280px, 32vw, 520px)',
          borderRadius: '50%',
          background: `radial-gradient(circle, ${accent}06 0%, transparent 70%)`,
          opacity: v ? 1 : 0,
          transition: 'opacity 2000ms ease 400ms',
        }} />

        {TopUtility}

        <div style={{
          position: 'relative', zIndex: 2, flex: 1,
          display: 'flex', flexDirection: 'column', justifyContent: 'center',
          padding: 'clamp(48px, 8vw, 96px) clamp(20px, 4vw, 40px)',
          maxWidth: 1600, margin: '0 auto', width: '100%',
        }}>
          {Eyebrow}{Headline}{Subhead}{Ctas}{Trust}
        </div>
      </header>
    );
  }

  // ── Variant: split (50/50 type + photo) ─────────────────────────────────
  return (
    <header ref={ref} style={{
      position: 'relative',
      minHeight: 'min(100vh, 880px)',
      display: 'flex', flexDirection: 'column',
      overflow: 'hidden',
      background: '#080808',
    }}>
      {TopUtility}

      <div className="hero-split" style={{
        position: 'relative', zIndex: 2, flex: 1,
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 1.1fr) minmax(0, 1fr)',
        gap: 'clamp(24px, 4vw, 64px)',
        padding: 'clamp(32px, 6vw, 72px) clamp(20px, 4vw, 40px) clamp(40px, 6vw, 80px)',
        maxWidth: 1600, margin: '0 auto', width: '100%',
        alignItems: 'center',
      }}>
        <div>
          {Eyebrow}{Headline}{Subhead}{Ctas}{Trust}
        </div>
        <div style={{
          position: 'relative', aspectRatio: '4/5',
          overflow: 'hidden', borderRadius: 16,
          opacity: v ? 1 : 0,
          transform: v ? 'translateY(0) scale(1)' : 'translateY(20px) scale(1.04)',
          transition: 'all 1400ms cubic-bezier(0.16, 1, 0.3, 1) 250ms',
        }}>
          <img
            src={b.hero_image.url} alt={b.hero_image.alt}
            style={{
              width: '100%', height: '100%', objectFit: 'cover',
              filter: 'contrast(1.05) saturate(0.95)',
            }}
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(180deg, transparent 60%, ${accent}22 100%)`,
          }} />
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

// ── Stats bar ──────────────────────────────────────────────────────────────
//
// Numbers carry the brand. A tiny trajectory arc sits between each cell on
// wider viewports — the same ball-flight motif as the hero, in miniature.

function StatsBar({ b, accent }) {
  const [ref, v] = useReveal();
  return (
    <section ref={ref} style={{
      padding: 'clamp(64px, 9vw, 112px) clamp(20px, 4vw, 40px)',
      background: 'rgba(255,255,255,0.025)',
      opacity: v ? 1 : 0,
      transition: 'opacity 800ms ease',
    }}>
      <div style={{
        maxWidth: 1400, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(180px, 100%), 1fr))',
        gap: 'clamp(28px, 4vw, 56px)',
        alignItems: 'start',
      }}>
        {b.stats.map((s, i) => (
          <div key={i} style={{ textAlign: 'left', position: 'relative' }}>
            <div style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontWeight: 300,
              fontSize: 'clamp(40px, 5.5vw, 76px)',
              color: '#fafafa',
              lineHeight: 0.95, marginBottom: 14,
              letterSpacing: '-0.035em',
              fontVariantNumeric: 'tabular-nums lining-nums',
            }}>
              {s.prefix && (
                <span style={{ opacity: 0.45, fontSize: '0.55em', letterSpacing: 0 }}>{s.prefix}</span>
              )}
              <StatValue value={s.value} reveal={v} />
              {s.suffix && (
                <span style={{ opacity: 0.45, fontSize: '0.45em', letterSpacing: 0, fontWeight: 400 }}>
                  {s.suffix}
                </span>
              )}
            </div>
            <div style={{
              fontSize: 10, opacity: 0.5,
              letterSpacing: '0.22em', textTransform: 'uppercase',
              fontFamily: 'Geist Mono, monospace',
            }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── Mission — editorial pause. Italic Fraunces. Logo as emblem. ────────────

function Mission({ b, accent }) {
  const [ref, v] = useReveal();
  return (
    <section id="mission" ref={ref} style={{
      padding: 'clamp(100px, 16vw, 200px) clamp(20px, 4vw, 40px)',
      opacity: v ? 1 : 0,
      transform: v ? 'translateY(0)' : 'translateY(30px)',
      transition: 'all 1000ms cubic-bezier(0.16, 1, 0.3, 1)',
      textAlign: 'center',
      scrollMarginTop: 80,
    }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', marginBottom: 40,
          opacity: v ? 1 : 0,
          transform: v ? 'scale(1)' : 'scale(0.9)',
          transition: 'all 1200ms cubic-bezier(0.16, 1, 0.3, 1) 200ms',
        }}>
          <img
            src={b.logo} alt={b.name} width={84} height={84}
            style={{ borderRadius: '50%', filter: 'invert(1)', background: '#080808' }}
          />
        </div>

        <div style={{
          fontSize: 12, fontFamily: 'Geist Mono, monospace',
          letterSpacing: '0.24em', textTransform: 'uppercase',
          color: accent, marginBottom: 28, fontWeight: 500,
          opacity: v ? 1 : 0,
          transition: 'opacity 800ms ease 350ms',
        }}>
          Mission Statement
        </div>

        <p style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: 'clamp(22px, 2.6vw, 34px)',
          lineHeight: 1.4,
          letterSpacing: '-0.015em',
          color: 'rgba(250,250,250,0.96)',
          opacity: v ? 1 : 0,
          transform: v ? 'translateY(0)' : 'translateY(16px)',
          transition: 'all 1000ms cubic-bezier(0.16, 1, 0.3, 1) 500ms',
        }}>
          "Our mission is to make premium golf experiences accessible
          anywhere, anytime. Using cutting-edge{' '}
          <span style={{ color: accent, fontStyle: 'normal', fontWeight: 400 }}>Foresight</span>{' '}
          technology, we bring the excitement of the course to events, workplaces,
          and private gatherings, rain or shine, season after season.
          We aim to create memorable, social, and inclusive golf experiences
          that elevate any occasion."
        </p>

        <div style={{
          width: 60, height: 1, background: `${accent}60`,
          margin: '48px auto 24px',
          opacity: v ? 1 : 0,
          transition: 'opacity 800ms ease 800ms',
        }} />

        <div style={{
          fontSize: 13, fontFamily: 'Geist Mono, monospace',
          letterSpacing: '0.14em', textTransform: 'uppercase',
          opacity: v ? 0.55 : 0,
          transition: 'opacity 800ms ease 900ms',
        }}>
          {b.founder.name} · Founder
        </div>
      </div>
    </section>
  );
}

// ── Service card ───────────────────────────────────────────────────────────

function ServiceCard({ service, accent }) {
  const popular = service.popular;
  return (
    <div className="service-card" style={{
      position: 'relative', padding: 24,
      background: popular ? `${accent}0D` : 'rgba(255,255,255,0.035)',
      border: `1px solid ${popular ? `${accent}50` : 'rgba(255,255,255,0.08)'}`,
      borderRadius: 14, cursor: 'pointer',
      transition:
        'transform 400ms cubic-bezier(0.16, 1, 0.3, 1), box-shadow 400ms cubic-bezier(0.16, 1, 0.3, 1), border-color 400ms ease, background 400ms ease',
      display: 'flex', flexDirection: 'column', minHeight: 240,
      transformOrigin: 'center bottom',
      willChange: 'transform',
    }}>
      {popular && (
        <div style={{
          position: 'absolute', top: -10, right: 20,
          padding: '4px 10px', borderRadius: 999,
          background: accent, color: '#080808',
          fontSize: 10, fontWeight: 700,
          letterSpacing: '0.1em', textTransform: 'uppercase',
          boxShadow: 'var(--shadow-sm)',
        }}>
          Most popular
        </div>
      )}
      <div style={{
        fontSize: 11, opacity: 0.55,
        fontFamily: 'Geist Mono, monospace',
        letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 12,
      }}>
        {service.duration}
      </div>
      <div style={{
        fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400,
        fontSize: 22, letterSpacing: '-0.01em', marginBottom: 8, lineHeight: 1.15,
      }}>
        {service.name}
      </div>
      <div style={{
        fontSize: 15, opacity: 0.85, lineHeight: 1.6, flex: 1, marginBottom: 20,
      }}>
        {service.description}
      </div>
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
        paddingTop: 14,
        borderTop: `1px solid ${popular ? `${accent}30` : 'rgba(255,255,255,0.08)'}`,
      }}>
        <div className="service-price" style={{
          fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400,
          fontSize: service.price === null ? 18 : 30,
          color: accent, letterSpacing: '-0.02em', lineHeight: 1,
          fontVariantNumeric: 'tabular-nums lining-nums',
          transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1)',
          transformOrigin: 'left center',
        }}>
          {formatPrice(service.price)}
        </div>
        <div className="service-cta" style={{
          fontSize: 13, color: popular ? accent : 'rgba(255,255,255,0.75)', fontWeight: 500,
          transition: 'transform 400ms cubic-bezier(0.16, 1, 0.3, 1), color 200ms ease',
        }}>
          Enquire →
        </div>
      </div>
    </div>
  );
}

// ── Service groups (tabbed) ────────────────────────────────────────────────

function ServiceGroups({ groups, accent }) {
  const [active, setActive] = React.useState(0);
  return (
    <div>
      <div style={{
        display: 'flex', gap: 6, marginBottom: 28,
        flexWrap: 'wrap',
        padding: 6, background: 'rgba(255,255,255,0.03)',
        borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)',
        width: 'fit-content', maxWidth: '100%',
      }}>
        {groups.map((g, i) => (
          <button
            key={i} onClick={() => setActive(i)}
            style={{
              padding: '10px 18px', borderRadius: 8, border: 'none',
              background: active === i ? accent : 'transparent',
              color: active === i ? '#080808' : 'rgba(255,255,255,0.7)',
              fontFamily: 'Geist, system-ui, sans-serif',
              fontSize: 13, fontWeight: 500,
              cursor: 'pointer', letterSpacing: '0.01em',
              transition: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)', minHeight: 40,
            }}
          >
            {g.title}
          </button>
        ))}
      </div>
      <p style={{
        fontSize: 17, opacity: 0.86, marginBottom: 28,
        maxWidth: 600, lineHeight: 1.5,
        fontStyle: 'italic',
        fontFamily: 'Fraunces, Georgia, serif', fontWeight: 300,
      }}>
        {groups[active].blurb}
      </p>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(min(280px, 100%), 1fr))',
        gap: 12,
      }}>
        {groups[active].services.map((s, i) => (
          <ServiceCard key={i} service={s} accent={accent} />
        ))}
      </div>
    </div>
  );
}

// ── Events ─────────────────────────────────────────────────────────────────

function Events({ b, accent }) {
  const [ref, v] = useReveal();
  return (
    <section id="events" ref={ref} style={{
      padding: 'clamp(80px, 12vw, 160px) clamp(20px, 4vw, 40px)',
      background: 'rgba(255,255,255,0.018)',
      opacity: v ? 1 : 0,
      transform: v ? 'translateY(0)' : 'translateY(30px)',
      transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1)',
      scrollMarginTop: 80,
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 'clamp(40px, 6vw, 64px)' }}>
          <div className="eyebrow-mark" style={{
            fontSize: 12, color: accent, fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: 16, fontFamily: 'Geist, system-ui, sans-serif',
          }}>
            What we do
          </div>
          <h2 style={{
            fontFamily: 'Fraunces, Georgia, serif', fontWeight: 300,
            fontSize: 'clamp(32px, 5vw, 64px)',
            lineHeight: 1, letterSpacing: '-0.03em',
            marginBottom: 16, maxWidth: '16ch',
          }}>
            Pick your event.{' '}
            <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.92)' }}>
              We do the rest.
            </span>
          </h2>
          <p style={{
            fontSize: 17, opacity: 0.86, maxWidth: 640,
            lineHeight: 1.65, letterSpacing: '-0.002em',
          }}>
            All prices include VAT and setup. We arrive 2 hours before, run the day,
            and pack down after. Final invoicing on confirmed numbers.
          </p>
        </div>
        <ServiceGroups groups={b.service_groups} accent={accent} />
      </div>

      {/* Anchor target for the in-nav "Coaching" link — it scrolls users into
          the events section then we leave the tab switch to user choice. */}
      <div id="coaching" style={{ position: 'relative', height: 0, visibility: 'hidden' }} aria-hidden="true" />
    </section>
  );
}

// ── About ──────────────────────────────────────────────────────────────────

function About({ b, accent }) {
  const [ref, v] = useReveal();
  return (
    <section id="about" ref={ref} style={{
      padding: 'clamp(80px, 12vw, 160px) clamp(20px, 4vw, 40px)',
      opacity: v ? 1 : 0,
      transform: v ? 'translateY(0)' : 'translateY(30px)',
      transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1)',
      scrollMarginTop: 80,
    }}>
      <div style={{
        maxWidth: 1400, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(320px, 100%), 1fr))',
        gap: 'clamp(40px, 6vw, 80px)',
        alignItems: 'center',
      }}>
        <div>
          <div className="eyebrow-mark" style={{
            fontSize: 12, color: accent, fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: 20, fontFamily: 'Geist, system-ui, sans-serif',
          }}>
            How it started
          </div>
          <h2 style={{
            fontFamily: 'Fraunces, Georgia, serif', fontWeight: 300,
            fontSize: 'clamp(28px, 4vw, 48px)',
            lineHeight: 1.1, letterSpacing: '-0.025em',
            marginBottom: 32,
          }}>
            {b.about.headline}
          </h2>
          <p style={{
            fontSize: 17, lineHeight: 1.7, opacity: 0.88, letterSpacing: '-0.002em',
            marginBottom: 20, maxWidth: '60ch',
          }}>
            {b.about.body}
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 14,
            padding: 20, borderRadius: 12,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.07)',
            marginTop: 32, maxWidth: 480,
          }}>
            <div style={{
              width: 56, height: 56, borderRadius: '50%',
              background: `${accent}20`, border: `1px solid ${accent}40`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: 22, fontWeight: 400, color: accent,
              letterSpacing: '-0.02em',
            }}>
              {b.founder.name.split(' ').map((n) => n[0]).join('')}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 500 }}>{b.founder.name}</div>
              <div style={{ fontSize: 13, opacity: 0.65, marginTop: 2, lineHeight: 1.4 }}>
                {b.founder.role}
              </div>
            </div>
          </div>
        </div>

        <div style={{ position: 'relative' }}>
          <BusinessImage
            image={b.about_portrait}
            fallbackLabel={`${b.founder.name.split(' ')[0]} on location`}
            accent={accent}
            aspect="4/5"
            style={{ borderRadius: 16 }}
          />
          <div style={{
            position: 'absolute', bottom: 20, left: 20, right: 20,
            padding: 16,
            background: 'rgba(8,8,8,0.88)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            borderRadius: 10, fontSize: 13,
            fontFamily: 'Geist Mono, monospace', letterSpacing: '0.02em',
            border: '1px solid rgba(255,255,255,0.08)',
          }}>
            <div style={{
              color: accent, marginBottom: 4, fontWeight: 500,
              fontSize: 11, letterSpacing: '0.16em', textTransform: 'uppercase',
            }}>
              On location
            </div>
            <div style={{ opacity: 0.85 }}>{b.about_portrait.caption}</div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Gallery — mosaic tuned for portrait phone media, with lightbox ─────────
//
// Row 1: feature image (span 7, 16/11) + portrait video (span 5, 9/16).
// Row 2: three portrait cells (span 4 each, 4/5).
// Below 800px: every cell collapses to span 12. Click any cell to open the
// fullscreen Lightbox; arrows / Esc navigate.

function Gallery({ b, accent }) {
  const [ref, v] = useReveal();
  const [lbIdx, setLbIdx] = React.useState(null);

  const layout = [
    { col: 'span 7', aspect: '16/11' }, // 0 — feature image
    { col: 'span 5', aspect: '9/16'  }, // 1 — portrait video
    { col: 'span 4', aspect: '4/5'   }, // 2
    { col: 'span 4', aspect: '4/5'   }, // 3 — portrait video
    { col: 'span 4', aspect: '4/5'   }, // 4
  ];

  return (
    <section id="gallery" ref={ref} style={{
      padding: 'clamp(80px, 12vw, 160px) clamp(20px, 4vw, 40px)',
      background: 'rgba(255,255,255,0.022)',
      opacity: v ? 1 : 0,
      transform: v ? 'translateY(0)' : 'translateY(30px)',
      transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1)',
      scrollMarginTop: 80,
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div className="eyebrow-mark" style={{
          fontSize: 12, color: accent, fontWeight: 600,
          letterSpacing: '0.15em', textTransform: 'uppercase',
          marginBottom: 16, fontFamily: 'Geist, system-ui, sans-serif',
        }}>
          Inside the dome
        </div>
        <h2 style={{
          fontFamily: 'Fraunces, Georgia, serif', fontWeight: 300,
          fontSize: 'clamp(30px, 4.5vw, 56px)',
          lineHeight: 1, letterSpacing: '-0.025em',
          marginBottom: 'clamp(36px, 5vw, 56px)',
        }}>
          What you{' '}
          <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.92)' }}>actually</span>{' '}
          get on the day.
        </h2>

        <div className="gallery-grid">
          {layout.map((g, i) => {
            const item = b.gallery[i];
            if (!item) return null;
            const wrapperStyle = { gridColumn: g.col, cursor: 'pointer' };
            const itemStyle = { borderRadius: 8 };
            return (
              <div
                key={i}
                className={`gallery-item gallery-item-${i}`}
                style={{
                  ...wrapperStyle,
                  opacity: v ? 1 : 0,
                  transform: v ? 'translateY(0)' : 'translateY(24px)',
                  transition: `opacity 700ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 90}ms, transform 700ms cubic-bezier(0.16, 1, 0.3, 1) ${i * 90}ms`,
                }}
                onClick={() => setLbIdx(i)}
              >
                {item.type === 'video' ? (
                  <BusinessVideo
                    video={{ ...item, videoUrl: null }} // tile shows poster + play overlay; lightbox plays the real video
                    accent={accent} aspect={g.aspect}
                    label={item.label} style={itemStyle}
                  />
                ) : (
                  <BusinessImage
                    image={item} fallbackLabel="Inside the dome"
                    accent={accent} aspect={g.aspect} style={itemStyle}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <Lightbox
        items={b.gallery}
        openIndex={lbIdx}
        onClose={() => setLbIdx(null)}
      />
    </section>
  );
}

// ── Where we go (mobile-zones variant of Location) ────────────────────────

function WhereWeGo({ b, accent }) {
  const [ref, v] = useReveal();
  return (
    <section ref={ref} style={{
      padding: 'clamp(80px, 12vw, 160px) clamp(20px, 4vw, 40px)',
      opacity: v ? 1 : 0,
      transform: v ? 'translateY(0)' : 'translateY(30px)',
      transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1)',
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 'clamp(40px, 6vw, 64px)', maxWidth: 800 }}>
          <div className="eyebrow-mark" style={{
            fontSize: 12, color: accent, fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: 16, fontFamily: 'Geist, system-ui, sans-serif',
          }}>
            Where we go
          </div>
          <h2 style={{
            fontFamily: 'Fraunces, Georgia, serif', fontWeight: 300,
            fontSize: 'clamp(32px, 5vw, 64px)',
            lineHeight: 1, letterSpacing: '-0.03em',
            marginBottom: 16,
          }}>
            We come to{' '}
            <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.92)' }}>you</span>,
            {' '}anywhere in Munster.
          </h2>
          <p style={{ fontSize: 17, opacity: 0.86, lineHeight: 1.65, letterSpacing: '-0.002em' }}>
            The dome packs into a van. We bring everything: screen, projector, mats,
            clubs if you need them. You bring the venue and the guest list.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
          gap: 14,
        }}>
          <div
            className="hover-card"
            style={{
            padding: 32, borderRadius: 16,
            background: `${accent}08`,
            border: `1px solid ${accent}30`,
            cursor: 'default',
            '--hover-accent': `${accent}80`,
          }}>
            <div style={{
              fontSize: 11, color: accent, marginBottom: 16,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              fontFamily: 'Geist Mono, monospace', fontWeight: 600,
            }}>
              Zone 1 · No travel fee
            </div>
            <div style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: 26, lineHeight: 1.2, marginBottom: 12,
            }}>
              {b.travel.primary_zone}
            </div>
            <div style={{ fontSize: 15, opacity: 0.86, lineHeight: 1.6 }}>
              {b.travel.description}
            </div>
          </div>
          <div
            className="hover-card"
            style={{
            padding: 32, borderRadius: 16,
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
            cursor: 'default',
            '--hover-accent': `${accent}50`,
          }}>
            <div style={{
              fontSize: 11, opacity: 0.5, marginBottom: 16,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              fontFamily: 'Geist Mono, monospace',
            }}>
              Zone 2 · Small supplement
            </div>
            <div style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: 26, lineHeight: 1.2, marginBottom: 12,
            }}>
              {b.travel.secondary_zone}
            </div>
            <div style={{ fontSize: 15, opacity: 0.86, lineHeight: 1.6 }}>
              {b.travel.secondary_description}
            </div>
          </div>
          <div
            className="hover-card"
            style={{
            padding: 32, borderRadius: 16,
            background: 'rgba(255,255,255,0.025)',
            border: '1px solid rgba(255,255,255,0.06)',
            cursor: 'default',
            '--hover-accent': `${accent}50`,
          }}>
            <div style={{
              fontSize: 11, opacity: 0.5, marginBottom: 16,
              letterSpacing: '0.16em', textTransform: 'uppercase',
              fontFamily: 'Geist Mono, monospace',
            }}>
              Anywhere else
            </div>
            <div style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontSize: 26, lineHeight: 1.2, marginBottom: 12,
            }}>
              Rest of Ireland
            </div>
            <div style={{ fontSize: 15, opacity: 0.86, lineHeight: 1.6 }}>
              {b.travel.further}
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 14, padding: 32, borderRadius: 16,
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{
            fontSize: 11, opacity: 0.5, marginBottom: 20,
            letterSpacing: '0.16em', textTransform: 'uppercase',
            fontFamily: 'Geist Mono, monospace',
          }}>
            Venue requirements
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))',
            gap: 24,
          }}>
            {b.venue_requirements.map((r, i) => (
              <div key={i}>
                <div style={{
                  fontFamily: 'Fraunces, Georgia, serif', fontWeight: 400,
                  fontSize: 24, color: accent, lineHeight: 1.1,
                  marginBottom: 6, letterSpacing: '-0.01em',
                }}>
                  {r.stat}
                </div>
                <div style={{ fontSize: 13, opacity: 0.7 }}>{r.label}</div>
              </div>
            ))}
          </div>
          <div style={{
            fontSize: 13, opacity: 0.55, marginTop: 20, fontStyle: 'italic',
            fontFamily: 'Fraunces, Georgia, serif',
          }}>
            Not sure if your venue works? Send a photo and we'll confirm in under 24 hours.
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Press + testimonial ────────────────────────────────────────────────────

function Press({ b, accent }) {
  const [ref, v] = useReveal();
  return (
    <section id="press" ref={ref} style={{
      padding: 'clamp(80px, 12vw, 160px) clamp(20px, 4vw, 40px)',
      background: 'rgba(255,255,255,0.028)',
      opacity: v ? 1 : 0,
      transform: v ? 'translateY(0)' : 'translateY(30px)',
      transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1)',
      scrollMarginTop: 80,
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(40px, 5vw, 56px)' }}>
          <div className="eyebrow-mark" style={{
            fontSize: 12, color: accent, fontWeight: 600,
            letterSpacing: '0.15em', textTransform: 'uppercase',
            marginBottom: 16, fontFamily: 'Geist, system-ui, sans-serif',
            justifyContent: 'center',
          }}>
            In the press
          </div>
          <h2 style={{
            fontFamily: 'Fraunces, Georgia, serif', fontWeight: 300,
            fontSize: 'clamp(30px, 4.5vw, 56px)',
            lineHeight: 1, letterSpacing: '-0.025em',
            maxWidth: '22ch', margin: '0 auto',
          }}>
            Something Cork hasn't seen before.
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))',
          gap: 14, marginBottom: 40,
        }}>
          {b.press_mentions.map((p, i) => (
            <div key={i}
              className="hover-card"
              style={{
              padding: 28, borderRadius: 12,
              background: '#0c0c0c', border: '1px solid rgba(255,255,255,0.06)',
              display: 'flex', flexDirection: 'column', gap: 14,
              cursor: 'default',
              '--hover-accent': `${accent}40`,
            }}>
              <div style={{
                fontFamily: 'Geist Mono, monospace', fontSize: 10,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                color: accent, fontWeight: 600,
              }}>
                {p.outlet}
              </div>
              <div style={{
                fontFamily: 'Fraunces, Georgia, serif',
                fontSize: 19, lineHeight: 1.35, letterSpacing: '-0.005em',
              }}>
                "{p.title}"
              </div>
              <div style={{
                fontSize: 12, opacity: 0.5,
                fontFamily: 'Geist Mono, monospace', letterSpacing: '0.04em',
                marginTop: 'auto',
              }}>
                {p.date}
              </div>
            </div>
          ))}
        </div>

        {b.testimonials && b.testimonials.length > 0 && (
          <div style={{
            padding: 'clamp(32px, 4vw, 48px)',
            background: `linear-gradient(135deg, ${accent}10 0%, ${accent}02 100%)`,
            border: `1px solid ${accent}25`,
            borderRadius: 16,
            maxWidth: 900, margin: '0 auto', textAlign: 'center',
          }}>
            <div style={{
              fontFamily: 'Fraunces, Georgia, serif',
              fontWeight: 300, fontStyle: 'italic',
              fontSize: 'clamp(20px, 2.5vw, 30px)',
              lineHeight: 1.4, letterSpacing: '-0.01em',
              marginBottom: 24,
            }}>
              "{b.testimonials[0].quote}"
            </div>
            <div style={{
              paddingTop: 16, borderTop: '1px solid rgba(255,255,255,0.08)',
              display: 'inline-block',
            }}>
              <div style={{ fontSize: 14, fontWeight: 500 }}>— {b.testimonials[0].author}</div>
              <div style={{ fontSize: 12, opacity: 0.6, marginTop: 2 }}>
                {b.testimonials[0].role} · {b.testimonials[0].context}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ── Contact ────────────────────────────────────────────────────────────────

function Contact({ b, accent }) {
  const [ref, v] = useReveal();
  return (
    <section id="contact" ref={ref} style={{
      padding: 'clamp(80px, 12vw, 160px) clamp(20px, 4vw, 40px)',
      opacity: v ? 1 : 0,
      transform: v ? 'translateY(0)' : 'translateY(30px)',
      transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1)',
      scrollMarginTop: 80,
    }}>
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{
          padding: 'clamp(48px, 6vw, 80px) clamp(32px, 5vw, 64px)',
          background: `linear-gradient(135deg, ${accent}15 0%, ${accent}05 100%)`,
          border: `1px solid ${accent}30`,
          borderRadius: 24,
        }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <h2 style={{
              fontFamily: 'Fraunces, Georgia, serif', fontWeight: 300,
              fontSize: 'clamp(32px, 5vw, 64px)',
              lineHeight: 1, letterSpacing: '-0.03em',
              maxWidth: '20ch', margin: '0 auto 16px',
            }}>
              Have a date in{' '}
              <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.92)' }}>mind?</span>
            </h2>
            <p style={{
              fontSize: 17, opacity: 0.86, lineHeight: 1.5, maxWidth: 540,
              margin: '0 auto',
            }}>
              Tell us when and where. We'll come back within 24 hours with
              availability and a quote.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))',
            gap: 14, marginBottom: 32,
          }}>
            <ContactMethod
              kind="Call" value={b.phone}
              href={`tel:${b.phone.replace(/\s/g, '')}`}
              accent={accent} largeSize
            />
            <ContactMethod
              kind="Email" value={b.email}
              href={`mailto:${b.email}`}
              accent={accent}
            />
            <ContactMethod
              kind="Instagram" value={b.instagram}
              href={b.instagram_url || '#'}
              accent={accent} largeSize
            />
          </div>

          <div style={{ textAlign: 'center' }}>
            <button
              className="cta-primary"
              onClick={() => window.location.href = `mailto:${b.email}`}
              style={{
                background: accent, color: '#080808', border: 'none',
                padding: '18px 36px', borderRadius: 12,
                fontFamily: 'Geist, system-ui, sans-serif',
                fontSize: 15, fontWeight: 600,
                cursor: 'pointer', minHeight: 56,
                boxShadow: 'var(--shadow-lg), var(--inset-highlight)',
                display: 'inline-flex', alignItems: 'center', gap: 10,
              }}
            >
              Get a quote in 24 hrs →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactMethod({ kind, value, href, accent, largeSize }) {
  return (
    <a
      href={href} target={kind === 'Instagram' ? '_blank' : undefined} rel="noopener"
      className="hover-card"
      style={{
        padding: 24, borderRadius: 14,
        background: 'rgba(8,8,8,0.4)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)',
        textDecoration: 'none', color: 'inherit',
        display: 'flex', flexDirection: 'column', gap: 8,
        '--hover-accent': `${accent}80`,
      }}
    >
      <div style={{
        fontSize: 11, opacity: 0.5,
        letterSpacing: '0.16em', textTransform: 'uppercase',
        fontFamily: 'Geist Mono, monospace',
      }}>
        {kind}
      </div>
      <div style={{
        fontFamily: 'Geist Mono, monospace',
        fontSize: largeSize ? 18 : 14,
        color: '#fafafa', fontWeight: 500, wordBreak: 'break-all',
      }}>
        {value}
      </div>
    </a>
  );
}

// ── Footer ─────────────────────────────────────────────────────────────────

function Footer({ b, accent }) {
  return (
    <footer style={{
      padding: 'clamp(80px, 10vw, 140px) clamp(20px, 4vw, 40px) 110px',
      background: 'rgba(255,255,255,0.022)',
      textAlign: 'center',
    }}>
      {/* Reset moment — centred name + tagline. Italic, intimate. */}
      <div style={{
        maxWidth: 720, margin: '0 auto clamp(48px, 6vw, 72px)',
      }}>
        <div style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontWeight: 300, fontStyle: 'italic',
          fontSize: 'clamp(36px, 5.5vw, 64px)',
          letterSpacing: '-0.03em',
          lineHeight: 1.05,
          marginBottom: 18,
          color: '#fafafa',
        }}>
          {b.name}.
        </div>
        <div style={{
          fontFamily: 'Fraunces, Georgia, serif',
          fontStyle: 'italic', fontWeight: 300,
          fontSize: 'clamp(17px, 1.8vw, 22px)',
          color: 'rgba(255,255,255,0.55)',
          letterSpacing: '-0.005em',
        }}>
          {b.tagline}
        </div>
      </div>

      {/* Meta row — logo is the literal centre, flanked by OpenBook (left)
          and copyright (right). The logo carries the glow + hover spin. */}
      <div className="footer-meta" style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        gap: 'clamp(24px, 4vw, 64px)', alignItems: 'center',
      }}>
        <div className="footer-meta-left" style={{ justifySelf: 'start' }}>
          <OpenBookBadge size="md" />
        </div>

        <a
          href="#"
          onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          aria-label={`${b.name} — back to top`}
          className="footer-logo"
          style={{ '--logo-glow': `${accent}55`, textDecoration: 'none', justifySelf: 'center' }}
        >
          <img
            src={b.logo} alt={b.name}
            width={140} height={140}
          />
        </a>

        <div className="footer-meta-right" style={{
          justifySelf: 'end', textAlign: 'right',
        }}>
          <div style={{
            fontFamily: 'Geist Mono, monospace',
            letterSpacing: '0.16em', textTransform: 'uppercase', fontSize: 10,
            color: 'rgba(255,255,255,0.45)', marginBottom: 6,
          }}>
            © 2026
          </div>
          <div style={{
            fontFamily: 'Geist, system-ui, sans-serif',
            fontSize: 13, fontWeight: 500,
            color: 'rgba(255,255,255,0.75)',
            letterSpacing: '0.01em',
          }}>
            {b.name}
          </div>
          <div style={{
            fontFamily: 'Geist Mono, monospace',
            fontSize: 10, color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.1em', marginTop: 6,
          }}>
            Cork, Ireland
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 720px) {
          .footer-meta {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          .footer-meta-left,
          .footer-meta-right {
            justify-self: center !important;
            text-align: center !important;
          }
          /* Reorder: logo first, badge second, copyright third on mobile. */
          .footer-meta > a.footer-logo { order: -1; }
        }
      `}</style>
    </footer>
  );
}

Object.assign(window, {
  Hero, StatsBar, Mission, Events, About, Gallery, WhereWeGo, Press, Contact, Footer,
});
