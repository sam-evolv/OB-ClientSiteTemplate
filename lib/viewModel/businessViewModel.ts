/**
 * The business view-model — the exact shape the ported reference components
 * consume (handoff/reference/sections.jsx + chrome.jsx read a single `business`
 * object). Keeping this shape identical to the reference's `data.jsx` object is
 * what lets the components be a near-verbatim port: they read `b.hero_image.url`,
 * `b.service_groups[].services[]`, `b.stats`, `b.travel`, etc.
 *
 * Two things produce this shape:
 *   - lib/data/simplyGolf.ts — the canonical content (mirrors data.jsx 1:1).
 *   - toBusinessViewModel() below — maps the Supabase rows (BusinessForMarketing)
 *     onto the same shape at request time.
 *
 * Both feed the same components, so the design renders identically whether the
 * data comes from the DB or from the canonical module.
 */

import type {
  BusinessForMarketing,
  BusinessRow,
  ServiceRow,
  BusinessMedia,
  BusinessHour
} from '@/lib/schemas/business';

export type HeroVariant = 'photo' | 'split' | 'type';

export type MediaImage = {
  url: string;
  alt?: string;
  caption?: string;
  /** When present, the photo hero plays this muted/looping video over the image. */
  videoUrl?: string | null;
};

export type GalleryItem =
  | { type: 'image'; url: string; alt?: string; caption?: string }
  | {
      type: 'video';
      videoUrl?: string | null;
      posterUrl: string;
      label?: string;
      alt?: string;
      caption?: string;
    };

export type Stat = { value: string; prefix?: string; suffix?: string; label: string };

export type ServiceVM = {
  name: string;
  duration: string;
  price: number | null;
  description: string;
  popular: boolean;
};

export type ServiceGroupVM = {
  id: string;
  title: string;
  blurb: string;
  services: ServiceVM[];
};

export type TrustSignalVM = { label: string };
export type PressMentionVM = { outlet: string; title: string; date: string };
export type TestimonialVM = { quote: string; author: string; role: string; context: string };
export type VenueRequirementVM = { stat: string; label: string };
export type SectionLink = { id: string; label: string };

export type TravelVM = {
  primary_zone: string;
  description: string;
  secondary_zone: string;
  secondary_description: string;
  further: string;
} | null;

/**
 * Fixed-location address, for place-based businesses (salons, gyms, physios).
 * Null when the business is mobile (uses TravelVM instead). A business has
 * EITHER an address (fixed) OR travel_zones (mobile).
 */
export type LocationVM = {
  address: string;
  address_line: string;
  city: string;
} | null;

/**
 * One day of opening hours, pre-formatted for display. `open` is the
 * authoritative flag (mirrors how the OpenBook booking app reads
 * business_hours.is_open): a day is open only when is_open === true. `display`
 * holds the formatted range ("6am – 8pm") when open and is empty when closed,
 * so the component renders "Closed". `opens`/`closes` keep the raw 24h "HH:MM"
 * times for schema.org openingHoursSpecification (empty when closed).
 */
export type HoursDayVM = {
  label: string;
  open: boolean;
  display: string;
  opens: string;
  closes: string;
};

export type BusinessVM = {
  name: string;
  slug: string;
  /** The tenant's canonical custom domain (e.g. "simplygolf365.ie"), or null. */
  custom_domain: string | null;
  /** Google Search Console verification token (raw meta content value), or null. */
  gsc_verification: string | null;
  category: string;
  founded: number | null;
  primary_colour: string;
  tagline: string;
  hero_headline_1: string;
  hero_headline_2: string;
  hero_subhead: string;
  hero_variant: HeroVariant;
  about: { headline: string; body: string };
  founder: { name: string; role: string; bio: string };
  mission_statement: string;
  mission_highlight_word: string;
  travel: TravelVM;
  location: LocationVM;
  hours: HoursDayVM[];
  venue_requirements: VenueRequirementVM[];
  phone: string;
  email: string;
  instagram: string;
  instagram_url: string;
  logo: string;
  hero_image: MediaImage;
  about_portrait: { url: string; alt?: string; caption?: string };
  gallery: GalleryItem[];
  trust_signals: TrustSignalVM[];
  stats: Stat[];
  service_groups: ServiceGroupVM[];
  press_mentions: PressMentionVM[];
  testimonials: TestimonialVM[];
  sections: SectionLink[];
};

/**
 * Price formatter — matches data.jsx: null → "On enquiry", otherwise the euro
 * amount with a leading € and no decimals (e.g. 650 → "€650").
 */
export const formatPrice = (n: number | null): string => (n === null ? 'On enquiry' : `€${n}`);

// -----------------------------------------------------------------------------
// Supabase rows → BusinessVM
// -----------------------------------------------------------------------------

function asArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

/** Build the instagram profile URL from a handle when an explicit url is absent. */
function instagramUrlFrom(handle: string | null, explicit: string | null): string {
  if (explicit) return explicit;
  if (!handle) return '';
  return `https://instagram.com/${handle.replace(/^@/, '')}`;
}

/**
 * Groups services into the tabbed view-model. Order of groups follows first
 * appearance in the (already sort_order-ordered) services array, so the seed's
 * sort_order controls both tab order and card order.
 */
function toServiceGroups(services: ServiceRow[]): ServiceGroupVM[] {
  const groups: ServiceGroupVM[] = [];
  const byName = new Map<string, ServiceGroupVM>();
  for (const s of services) {
    const title = s.group_name ?? 'Services';
    let group = byName.get(title);
    if (!group) {
      group = {
        id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
        title,
        blurb: s.group_blurb ?? '',
        services: []
      };
      byName.set(title, group);
      groups.push(group);
    }
    if (!group.blurb && s.group_blurb) group.blurb = s.group_blurb;
    group.services.push({
      name: s.name,
      duration: s.duration_label ?? '',
      // services.price_cents is NOT NULL on the shared booking table, so the
      // "On enquiry" card (§5: null price) is seeded as 0 and read back as null
      // here. No real service is €0, so 0 is a safe on-enquiry sentinel.
      price: s.price_cents === null || s.price_cents === 0 ? null : Math.round(s.price_cents / 100),
      description: s.description ?? '',
      popular: Boolean(s.is_popular)
    });
  }
  return groups;
}

function pickMedia(media: BusinessMedia[], kind: string): BusinessMedia | undefined {
  return media.find((m) => m.kind === kind);
}

function toGallery(media: BusinessMedia[]): GalleryItem[] {
  return media
    .filter((m) => m.kind === 'gallery')
    .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
    .map((m): GalleryItem => {
      if (m.media_type === 'video') {
        return {
          type: 'video',
          videoUrl: m.video_url ?? null,
          posterUrl: m.url,
          label: m.label ?? undefined,
          alt: m.alt ?? undefined,
          caption: m.caption ?? undefined
        };
      }
      return {
        type: 'image',
        url: m.url,
        alt: m.alt ?? undefined,
        caption: m.caption ?? undefined
      };
    });
}

/** Fixed-location address from the business row, or null when mobile. */
function toLocation(b: BusinessRow): LocationVM {
  const address = (b.address ?? '').trim();
  if (!address) return null;
  return {
    address,
    address_line: (b.address_line ?? '').trim(),
    city: (b.city ?? '').trim()
  };
}

const WEEKDAY_NAMES = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

// Display order is Monday-first. business_hours.day_of_week follows the
// Postgres/JS convention (0 = Sunday … 6 = Saturday), confirmed against the
// OpenBook booking app, which labels day_of_week 1 as Monday.
const WEEK_DISPLAY_ORDER = [1, 2, 3, 4, 5, 6, 0];

/** "06:00:00" -> "6am", "20:00:00" -> "8pm", "09:30:00" -> "9:30am". */
function formatTime(value: string | null): string {
  if (!value) return '';
  const [hStr, mStr] = value.split(':');
  const h = Number(hStr);
  const m = Number(mStr ?? '0');
  if (Number.isNaN(h)) return '';
  const suffix = h < 12 ? 'am' : 'pm';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m ? `${hour12}:${String(m).padStart(2, '0')}${suffix}` : `${hour12}${suffix}`;
}

function formatRange(open: string | null, close: string | null): string {
  const o = formatTime(open);
  const c = formatTime(close);
  if (o && c) return `${o} – ${c}`;
  return o || c || '';
}

/** "06:00:00" -> "06:00" (24h HH:MM for schema.org). Empty when absent. */
function hhmm(value: string | null): string {
  if (!value) return '';
  const [h, m] = value.split(':');
  if (h === undefined) return '';
  return `${h.padStart(2, '0')}:${(m ?? '00').padStart(2, '0')}`;
}

/**
 * The week's opening hours, Monday-first, each day pre-formatted. A day is open
 * only when business_hours.is_open === true; closed days (including days with
 * no row) get open: false and an empty display, which the component renders as
 * "Closed". This matches how the OpenBook booking app interprets the rows.
 */
function toHours(hours: BusinessHour[]): HoursDayVM[] {
  const byDay = new Map<number, BusinessHour>();
  for (const h of hours) byDay.set(h.day_of_week, h);
  return WEEK_DISPLAY_ORDER.map((dow) => {
    const row = byDay.get(dow);
    const open = row?.is_open === true;
    return {
      label: WEEKDAY_NAMES[dow],
      open,
      display: open ? formatRange(row?.open_time ?? null, row?.close_time ?? null) : '',
      opens: open ? hhmm(row?.open_time ?? null) : '',
      closes: open ? hhmm(row?.close_time ?? null) : ''
    };
  });
}

const DEFAULT_SECTIONS: SectionLink[] = [
  { id: 'mission', label: 'Mission' },
  { id: 'events', label: 'Events' },
  { id: 'coaching', label: 'Coaching' },
  { id: 'about', label: 'About' },
  { id: 'gallery', label: 'Inside the dome' },
  { id: 'press', label: 'Press' },
  { id: 'contact', label: 'Contact' }
];

export function toBusinessViewModel(
  data: BusinessForMarketing,
  accentHex: string
): BusinessVM {
  const b: BusinessRow = data.business;
  const heroMedia = pickMedia(data.media, 'hero');
  const aboutMedia = pickMedia(data.media, 'about');
  const logoMedia = pickMedia(data.media, 'logo');

  const travel = (b.travel_zones as BusinessVM['travel']) ?? null;
  const logo = b.slug === 'empire-gym'
    ? '/media/empiregym-logo.svg'
    : logoMedia?.url ?? b.logo_url ?? '';

  return {
    name: b.name,
    slug: b.slug,
    custom_domain: b.website_custom_domain ?? null,
    gsc_verification: b.website_gsc_verification ?? null,
    category: b.category,
    founded: b.year_founded ?? null,
    primary_colour: accentHex,
    tagline: b.tagline ?? '',
    hero_headline_1: b.website_hero_headline_1 ?? b.name,
    hero_headline_2: b.website_hero_headline_2 ?? '',
    hero_subhead: b.website_hero_subhead ?? '',
    hero_variant: (b.website_hero_variant as HeroVariant) ?? 'photo',
    about: {
      headline: b.website_about_headline ?? '',
      body: b.website_about_body ?? b.about_long ?? ''
    },
    founder: {
      name: b.founder_name ?? '',
      role: b.founder_role ?? '',
      bio: b.founder_bio ?? ''
    },
    mission_statement: b.mission_statement ?? '',
    mission_highlight_word: b.mission_highlight_word ?? '',
    travel,
    location: toLocation(b),
    hours: toHours(data.hours),
    venue_requirements: asArray<VenueRequirementVM>(b.venue_requirements),
    phone: b.phone ?? '',
    email: b.email ?? '',
    instagram: b.instagram_handle ?? '',
    instagram_url: instagramUrlFrom(b.instagram_handle, b.instagram_url ?? null),
    logo,
    hero_image: {
      url: heroMedia?.url ?? b.website_hero_image_url ?? '',
      alt: heroMedia?.alt ?? undefined,
      videoUrl: heroMedia?.video_url ?? null
    },
    about_portrait: {
      url: aboutMedia?.url ?? b.founder_photo_url ?? '',
      alt: aboutMedia?.alt ?? undefined,
      caption: aboutMedia?.caption ?? undefined
    },
    gallery: toGallery(data.media),
    trust_signals: asArray<TrustSignalVM>(b.trust_signals),
    stats: asArray<Stat>(b.website_stats),
    service_groups: toServiceGroups(data.services),
    press_mentions: asArray<PressMentionVM>(b.press_mentions),
    testimonials: asArray<TestimonialVM>(b.testimonials),
    sections: DEFAULT_SECTIONS
  };
}
