import type { CSSProperties } from 'react';
import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import rehypeSanitize from 'rehype-sanitize';
import { ClientEffects } from '../client-effects';
import { getAllBusinessSlugs, getBusinessBySlug } from '../../lib/business';
import { firstSentence, formatDuration, formatPrice, mapsUrl, titleCase } from '../../lib/format';
import { getAccentTheme } from '../../lib/theme';
import type { Business, Service } from '../../lib/types';

export const revalidate = 60;

type PageProps = { params: { slug: string } };

export async function generateStaticParams() {
  const slugs = await getAllBusinessSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const business = await getBusinessBySlug(params.slug);
  if (!business) return {};

  const title = `${business.name} | Book online`;
  const description = business.tagline || `${titleCase(business.category)} in ${business.city || 'Ireland'}, bookable through OpenBook.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: business.hero_image_url ? [{ url: business.hero_image_url }] : undefined,
      type: 'website'
    }
  };
}

export default async function BusinessSitePage({ params }: PageProps) {
  const business = await getBusinessBySlug(params.slug);
  if (!business) notFound();

  const bookingHref = `/book`;
  const hasHeroPhoto = Boolean(business.hero_image_url);
  const headline = business.website_headline || buildHeadline(business);
  const gallery = (business.gallery_urls || []).filter(Boolean).slice(0, 8);
  const testimonials = (business.testimonials || []).filter((item) => item.quote && item.author);
  const hasLocation = Boolean(business.address_line || business.city || business.phone || business.email);

  return (
    <main className="site-shell" style={getAccentTheme(business.primary_colour) as CSSProperties}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(getLocalBusinessJsonLd(business)) }} />
      <Hero business={business} headline={headline} hasHeroPhoto={hasHeroPhoto} bookingHref={bookingHref} />
      <About business={business} />
      <Services business={business} bookingHref={bookingHref} />
      {gallery.length > 0 ? <Gallery business={business} gallery={gallery} /> : null}
      {testimonials.length > 0 ? <Testimonials testimonials={testimonials} /> : null}
      {hasLocation ? <FindUs business={business} /> : null}
      <Footer business={business} />
      <ClientEffects bookingHref={bookingHref} />
    </main>
  );
}

function Hero({ business, headline, hasHeroPhoto, bookingHref }: { business: Business; headline: string; hasHeroPhoto: boolean; bookingHref: string }) {
  const location = [business.address_line, business.city].filter(Boolean).join(', ');

  return (
    <section className={`hero ${hasHeroPhoto ? 'hero-photo' : 'hero-type'}`} data-hero>
      {business.hero_image_url ? (
        <Image className="hero-image" src={business.hero_image_url} alt="" fill priority sizes="100vw" />
      ) : (
        <div className="hero-mark" aria-hidden="true">
          {business.logo_url ? <Image src={business.logo_url} alt="" width={112} height={112} /> : initials(business.name)}
        </div>
      )}
      <div className="hero-grain" aria-hidden="true" />
      <div className="hero-content">
        <p className="eyebrow">{titleCase(business.category)}{business.city ? ` in ${business.city}` : ''}</p>
        <h1>{headline}</h1>
        {business.tagline ? <p className="hero-tagline">{business.tagline}</p> : null}
        <div className="hero-actions">
          <a className="primary-cta" href={bookingHref}>Book now</a>
          {location ? <span className="hero-location">{location}</span> : null}
        </div>
      </div>
      <div className="ai-badge">Bookable through AI assistants</div>
    </section>
  );
}

function About({ business }: { business: Business }) {
  if (!business.about_long && !business.founder_name) return null;

  return (
    <section className="section about-section" data-reveal>
      <div className="section-kicker">The place</div>
      {business.about_long ? <p className="pull-quote">{firstSentence(business.about_long)}</p> : null}
      <div className="about-grid">
        {(business.founder_photo_url || business.founder_name) ? (
          <aside className="founder-panel">
            {business.founder_photo_url ? <Image src={business.founder_photo_url} alt={business.founder_name || business.name} width={320} height={420} /> : <div className="founder-initials">{initials(business.founder_name || business.name)}</div>}
            <div>
              {business.founder_name ? <strong>{business.founder_name}</strong> : null}
              {business.year_founded ? <span>Est. {business.year_founded}</span> : null}
            </div>
          </aside>
        ) : null}
        {business.about_long ? (
          <div className="prose">
            <ReactMarkdown rehypePlugins={[rehypeSanitize]} allowedElements={['p', 'em', 'strong', 'a', 'ul', 'ol', 'li']}>{business.about_long}</ReactMarkdown>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function Services({ business, bookingHref }: { business: Business; bookingHref: string }) {
  if (!business.services?.length) return null;
  const groups = groupServices(business.services);

  return (
    <section className="section services-section" data-reveal>
      <div className="section-heading">
        <span className="section-kicker">Book</span>
        <h2>Choose your session.</h2>
      </div>
      <div className="service-groups">
        {groups.map(([category, services]) => (
          <div className="service-group" key={category}>
            {groups.length > 1 ? <h3>{category}</h3> : null}
            <div className="service-list">
              {services.map((service) => (
                <a className="service-row" href={`${bookingHref}/${service.id}`} key={service.id}>
                  <span>
                    <strong>{service.name}</strong>
                    {service.description ? <small>{service.description}</small> : null}
                  </span>
                  <span className="service-duration">{formatDuration(service.duration)}</span>
                  <span className="service-price">{formatPrice(service.price)}</span>
                  <span className="service-book">Book</span>
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Gallery({ business, gallery }: { business: Business; gallery: string[] }) {
  return (
    <section className="section gallery-section" data-reveal>
      <div className="section-heading compact">
        <span className="section-kicker">Inside</span>
        <h2>A closer look.</h2>
      </div>
      <div className="gallery-mosaic">
        {gallery.map((url, index) => (
          <a className={`gallery-item item-${index + 1}`} href={url} key={url}>
            <Image src={url} alt={`${business.name} photo ${index + 1}`} fill sizes="(max-width: 768px) 100vw, 50vw" />
          </a>
        ))}
      </div>
      {business.instagram_handle ? <a className="instagram-link" href={`https://instagram.com/${business.instagram_handle.replace('@', '')}`}>More on Instagram</a> : null}
    </section>
  );
}

function Testimonials({ testimonials }: { testimonials: NonNullable<Business['testimonials']> }) {
  if (testimonials.length < 3) {
    const quote = testimonials[0];
    return (
      <section className="section single-testimonial" data-reveal>
        <blockquote>“{quote.quote}”</blockquote>
        <cite>{quote.author}{quote.role ? `, ${quote.role}` : ''}</cite>
      </section>
    );
  }

  return (
    <section className="section testimonials-section" data-reveal>
      <div className="section-heading compact">
        <span className="section-kicker">Proof</span>
        <h2>People come back for a reason.</h2>
      </div>
      <div className="testimonial-grid">
        {testimonials.slice(0, 6).map((item) => (
          <figure className="testimonial-card" key={`${item.author}-${item.quote}`}>
            <blockquote>“{item.quote}”</blockquote>
            <figcaption>
              <strong>{item.author}</strong>
              {item.role ? <span>{item.role}</span> : null}
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  );
}

function FindUs({ business }: { business: Business }) {
  const directions = mapsUrl([business.address_line, business.city, business.eircode]);
  const mapboxToken = process.env.MAPBOX_TOKEN;
  const mapQuery = [business.address_line, business.city, business.eircode].filter(Boolean).join(', ');
  const mapUrl = mapboxToken && mapQuery ? `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/pin-s+${business.primary_colour.replace('#', '')}(${encodeURIComponent(mapQuery)})/auto/1200x520@2x?access_token=${mapboxToken}` : null;
  const gettingHere = [business.parking_info, business.nearest_landmark, business.public_transport_info].filter(Boolean);

  return (
    <section className="section find-section" data-reveal>
      <div className="section-heading compact">
        <span className="section-kicker">Find us</span>
        <h2>Arrive ready.</h2>
      </div>
      <div className="find-grid">
        <div>
          <h3>Address</h3>
          {business.address_line ? <p className="address-line">{business.address_line}</p> : null}
          {business.city || business.eircode ? <p>{[business.city, business.eircode].filter(Boolean).join(' ')}</p> : null}
          {(business.address_line || business.city) ? <a href={directions}>Get directions</a> : null}
        </div>
        <div>
          <h3>Hours</h3>
          <HoursList hours={business.business_hours} />
        </div>
        <div>
          <h3>Contact</h3>
          {business.phone ? <a href={`tel:${business.phone.replace(/\s/g, '')}`}>{business.phone}</a> : null}
          {business.email ? <a href={`mailto:${business.email}`}>{business.email}</a> : null}
          <Socials business={business} />
        </div>
      </div>
      {mapUrl ? <Image className="map-image" src={mapUrl} alt={`Map for ${business.name}`} width={1200} height={520} /> : null}
      {gettingHere.length > 0 ? (
        <div className="getting-here">
          {gettingHere.map((item) => <p key={item}>{item}</p>)}
        </div>
      ) : null}
    </section>
  );
}

function HoursList({ hours }: { hours: Business['business_hours'] }) {
  if (!hours?.length) return <p>Hours available when booking.</p>;
  const today = new Intl.DateTimeFormat('en-IE', { weekday: 'long', timeZone: 'Europe/Dublin' }).format(new Date());

  return (
    <ul className="hours-list">
      {hours.map((row) => {
        const isToday = row.day.toLowerCase() === today.toLowerCase();
        return (
          <li className={isToday ? 'today' : ''} key={row.day}>
            <span>{row.day}</span>
            <span>{row.is_closed ? 'Closed' : [row.opens_at, row.closes_at].filter(Boolean).join(' - ')}</span>
          </li>
        );
      })}
    </ul>
  );
}

function Socials({ business }: { business: Business }) {
  const socials = business.socials ? Object.entries(business.socials).filter(([, url]) => Boolean(url)) : [];
  if (!socials.length) return null;

  return (
    <div className="socials">
      {socials.map(([label, url]) => <a href={url as string} key={label}>{titleCase(label)}</a>)}
    </div>
  );
}

function Footer({ business }: { business: Business }) {
  return (
    <footer className="footer">
      <div>
        <strong>{business.name}</strong>
        <span>{new Date().getFullYear()}</span>
      </div>
      <Socials business={business} />
      <a className="powered" href="https://openbook.ie">Powered by OpenBook</a>
    </footer>
  );
}

function groupServices(services: Service[]) {
  const hasCategories = services.some((service) => service.category);
  if (!hasCategories) return [['Services', services]] as Array<[string, Service[]]>;

  const groups = new Map<string, Service[]>();
  services.forEach((service) => {
    const category = service.category || 'Services';
    groups.set(category, [...(groups.get(category) || []), service]);
  });
  return Array.from(groups.entries());
}

function buildHeadline(business: Business) {
  const place = business.city ? ` in ${business.city}` : '';
  return `${titleCase(business.category)}${place}, booked beautifully.`;
}

function initials(name: string) {
  return name.split(' ').filter(Boolean).slice(0, 2).map((part) => part[0]).join('').toUpperCase();
}

function getLocalBusinessJsonLd(business: Business) {
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: business.name,
    url: `https://${business.slug}.openbook.ie`,
    image: business.hero_image_url || business.logo_url || undefined,
    telephone: business.phone || undefined,
    email: business.email || undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: business.address_line || undefined,
      addressLocality: business.city || undefined,
      postalCode: business.eircode || undefined,
      addressCountry: 'IE'
    },
    priceRange: business.services?.some((service) => service.price) ? '€€' : undefined,
    sameAs: business.socials ? Object.values(business.socials).filter(Boolean) : undefined
  };
}
