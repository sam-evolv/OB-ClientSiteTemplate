'use client';

import { useReveal } from '@/lib/hooks';
import { FONT_SERIF, FONT_SANS, FONT_MONO } from '@/lib/ui/fonts';
import type { CSSProperties } from 'react';
import type { BusinessVM } from '@/lib/viewModel/businessViewModel';

/**
 * LocationHours — the fixed-location variant of the "where" section, for
 * place-based businesses (salons, gyms, barbers, physios). It is the static
 * counterpart to WhereWeGo (mobile travel zones): a business has EITHER an
 * address (this section) OR travel_zones (WhereWeGo), so the two never both
 * show. Gated on b.location in MarketingPage, so it auto-hides for mobile
 * businesses and renders nothing extra for SIMply Golf.
 *
 * Renders the address (accent-tinted card, matching WhereWeGo's Zone 1) with a
 * keyless "Get directions" link to Google Maps, and a clean Monday-first weekly
 * hours list with closed days marked. A Maps embed iframe renders only when a
 * NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY is already configured; there is no hard
 * dependency on a Maps API key.
 */
export function LocationHours({ b, accent }: { b: BusinessVM; accent: string }) {
  const [ref, v] = useReveal();
  if (!b.location?.address) return null;

  const { address, address_line, city } = b.location;
  const directionsQuery = [address, address_line, city].filter(Boolean).join(', ');
  const directionsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    directionsQuery
  )}`;

  // Map embed: prefer the official key-gated Maps Embed API when configured;
  // otherwise fall back to the keyless google.com/maps iframe so every
  // fixed-location tenant gets a visible map at no extra cost. The directions
  // link above stays the canonical "open in Google Maps" affordance either way.
  const mapsEmbedKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_KEY;
  const mapsEmbedSrc = mapsEmbedKey
    ? `https://www.google.com/maps/embed/v1/place?key=${mapsEmbedKey}&q=${encodeURIComponent(
        directionsQuery
      )}`
    : `https://maps.google.com/maps?q=${encodeURIComponent(directionsQuery)}&output=embed`;

  const showHours = b.hours.length > 0;

  return (
    <section
      id="location"
      ref={ref as React.RefObject<HTMLElement>}
      style={{
        padding: 'clamp(80px, 12vw, 160px) clamp(20px, 4vw, 40px)',
        opacity: v ? 1 : 0,
        transform: v ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 900ms cubic-bezier(0.16, 1, 0.3, 1)',
        scrollMarginTop: 80
      }}
    >
      <div style={{ maxWidth: 1400, margin: '0 auto' }}>
        <div style={{ marginBottom: 'clamp(40px, 6vw, 64px)', maxWidth: 800 }}>
          <div
            className="eyebrow-mark"
            style={{
              fontSize: 12,
              color: accent,
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: 16,
              fontFamily: FONT_SANS
            }}
          >
            Where to find us
          </div>
          <h2
            style={{
              fontFamily: FONT_SERIF,
              fontWeight: 300,
              fontSize: 'clamp(32px, 5vw, 64px)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
              marginBottom: 16
            }}
          >
            {city ? (
              <>
                Find us in{' '}
                <span style={{ fontStyle: 'italic', color: 'rgba(255,255,255,0.92)' }}>{city}</span>.
              </>
            ) : (
              'Visit us.'
            )}
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))',
            gap: 14
          }}
        >
          {/* Address — accent-tinted, mirrors WhereWeGo's Zone 1 card. */}
          <div
            className="hover-card"
            style={
              {
                padding: 32,
                borderRadius: 16,
                background: `${accent}08`,
                border: `1px solid ${accent}30`,
                cursor: 'default',
                display: 'flex',
                flexDirection: 'column',
                '--hover-accent': `${accent}80`
              } as CSSProperties
            }
          >
            <div
              style={{
                fontSize: 11,
                color: accent,
                marginBottom: 16,
                letterSpacing: '0.16em',
                textTransform: 'uppercase',
                fontFamily: FONT_MONO,
                fontWeight: 600
              }}
            >
              Address
            </div>
            <div style={{ fontFamily: FONT_SERIF, fontSize: 26, lineHeight: 1.25, marginBottom: 4 }}>
              {address}
            </div>
            {address_line ? (
              <div style={{ fontSize: 15, opacity: 0.86, lineHeight: 1.6 }}>{address_line}</div>
            ) : null}
            {city ? (
              <div style={{ fontSize: 15, opacity: 0.86, lineHeight: 1.6 }}>{city}</div>
            ) : null}
            <a
              href={directionsHref}
              target="_blank"
              rel="noopener"
              style={{
                marginTop: 24,
                alignSelf: 'flex-start',
                color: accent,
                textDecoration: 'none',
                fontFamily: FONT_SANS,
                fontSize: 14,
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8
              }}
            >
              Get directions →
            </a>
          </div>

          {/* Opening hours — neutral card, Monday-first weekly list. */}
          {showHours ? (
            <div
              className="hover-card"
              style={
                {
                  padding: 32,
                  borderRadius: 16,
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'default',
                  '--hover-accent': `${accent}50`
                } as CSSProperties
              }
            >
              <div
                style={{
                  fontSize: 11,
                  opacity: 0.5,
                  marginBottom: 20,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  fontFamily: FONT_MONO
                }}
              >
                Opening hours
              </div>
              <dl style={{ margin: 0 }}>
                {b.hours.map((day, i) => (
                  <div
                    key={day.label}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      gap: 16,
                      padding: '10px 0',
                      borderBottom:
                        i < b.hours.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none'
                    }}
                  >
                    <dt
                      style={{
                        fontFamily: FONT_SERIF,
                        fontSize: 16,
                        opacity: day.open ? 0.92 : 0.45
                      }}
                    >
                      {day.label}
                    </dt>
                    <dd
                      style={{
                        margin: 0,
                        fontFamily: FONT_MONO,
                        fontSize: 13,
                        letterSpacing: '0.02em',
                        opacity: day.open ? 0.86 : 0.45,
                        color: day.open ? '#fafafa' : 'inherit'
                      }}
                    >
                      {day.open ? day.display : 'Closed'}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          ) : null}
        </div>

        {mapsEmbedSrc ? (
          <iframe
            title={`Map to ${b.name}`}
            src={mapsEmbedSrc}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
            style={{
              width: '100%',
              height: 360,
              border: 0,
              borderRadius: 16,
              marginTop: 14,
              filter: 'grayscale(0.25) contrast(1.05)'
            }}
          />
        ) : null}
      </div>
    </section>
  );
}
