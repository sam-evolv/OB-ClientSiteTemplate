import { BusinessSchema, type Business } from '@/lib/schemas/business';
import { MediaSchema, type Media } from '@/lib/schemas/media';

/**
 * SIMply Golf 365 mock business, validated against BusinessSchema at module
 * load. This is the canonical test for the schema: if the data does not
 * fit, the schema is wrong, not the data.
 *
 * All the data here is hoisted from reference/simply_golf_v9.jsx into the
 * sections architecture from the brief, Part 2. The hardcoded strings
 * called out in Part 9 (mission statement, mobile-location headline,
 * portrait caption, CTA labels, gallery eyebrow, press headline, contact
 * headline) are now content fields on their respective sections.
 *
 * Media is stored separately and referenced from section content by
 * media_id. The page loader will eventually join media into the render
 * pipeline; for the foundation commit the placeholder components do not
 * consume media yet.
 */

// UUIDs in this file are valid v4 (version nibble 4, variant nibble 8) so they
// pass Zod 4's strict UUID validation. Easy to read, not real entropy.
const BUSINESS_ID = 'b1b1b1b1-b1b1-41b1-8b1b-b1b1b1b1b1b1';

// -----------------------------------------------------------------------------
// Media
// -----------------------------------------------------------------------------

const MEDIA = {
  logo: '11111111-1111-4111-8111-111111111111',
  hero: '22222222-2222-4222-8222-222222222222',
  about_portrait: '33333333-3333-4333-8333-333333333333',
  gallery_1: '44444441-4444-4444-8444-444444444444',
  gallery_2: '44444442-4444-4444-8444-444444444444',
  gallery_3: '44444443-4444-4444-8444-444444444444',
  gallery_4: '44444444-4444-4444-8444-444444444444',
  gallery_5: '44444445-4444-4444-8444-444444444444'
};

const rawMedia: Media[] = [
  {
    id: MEDIA.logo,
    business_id: BUSINESS_ID,
    storage_path: 'reference/v9-extracted/logo.jpg',
    url: '/reference/v9-extracted/logo.jpg',
    alt: 'SIMply Golf 365 logo',
    type: 'image'
  },
  {
    id: MEDIA.hero,
    business_id: BUSINESS_ID,
    storage_path: 'reference/v9-extracted/hero.jpg',
    url: '/reference/v9-extracted/hero.jpg',
    alt: 'Inside the dome, coach and customer at the simulator',
    type: 'image'
  },
  {
    id: MEDIA.about_portrait,
    business_id: BUSINESS_ID,
    storage_path: 'reference/v9-extracted/about-portrait.jpg',
    url: '/reference/v9-extracted/about-portrait.jpg',
    alt: 'Jack Howard with a young customer at a SIMply Golf 365 pop-up',
    type: 'image'
  },
  {
    id: MEDIA.gallery_1,
    business_id: BUSINESS_ID,
    storage_path: 'reference/v9-extracted/gallery-1.jpg',
    url: '/reference/v9-extracted/gallery-1.jpg',
    alt: 'Mid-swing on the Foresight simulator',
    type: 'image'
  },
  {
    id: MEDIA.gallery_2,
    business_id: BUSINESS_ID,
    storage_path: 'reference/v9-extracted/gallery-2.jpg',
    url: '/reference/v9-extracted/gallery-2.jpg',
    alt: 'The dome interior at a corporate event',
    type: 'image'
  },
  {
    id: MEDIA.gallery_3,
    business_id: BUSINESS_ID,
    storage_path: 'reference/v9-extracted/gallery-3.jpg',
    url: '/reference/v9-extracted/gallery-3.jpg',
    alt: 'Player at the tee inside the dome',
    type: 'image'
  },
  {
    id: MEDIA.gallery_4,
    business_id: BUSINESS_ID,
    storage_path: 'reference/v9-extracted/gallery-4.jpg',
    url: '/reference/v9-extracted/gallery-4.jpg',
    alt: 'Customer playing inside the dome',
    type: 'image'
  },
  {
    id: MEDIA.gallery_5,
    business_id: BUSINESS_ID,
    storage_path: 'reference/v9-extracted/gallery-5.jpg',
    url: '/reference/v9-extracted/gallery-5.jpg',
    alt: 'Setup time-lapse poster frame',
    type: 'image'
  }
];

export const simplyGolf365Media: Media[] = rawMedia.map((m) => MediaSchema.parse(m));

// -----------------------------------------------------------------------------
// Business and sections
// -----------------------------------------------------------------------------

const SECTION_IDS = {
  hero: 'aaaaaa01-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  trust: 'aaaaaa02-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  mission: 'aaaaaa03-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  services: 'aaaaaa04-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  about: 'aaaaaa05-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  gallery: 'aaaaaa06-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  location: 'aaaaaa07-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  press: 'aaaaaa08-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  reviews: 'aaaaaa09-aaaa-4aaa-8aaa-aaaaaaaaaaaa',
  contact: 'aaaaaa10-aaaa-4aaa-8aaa-aaaaaaaaaaaa'
};

const raw: Business = {
  id: BUSINESS_ID,
  slug: 'simplygolf365',
  name: 'SIMply Golf 365',
  tagline: 'Golf. Anywhere you want it.',
  primary_colour: '#F5F5F4',
  domain: 'simplygolf365.ie',
  phone: '087 409 1291',
  email: 'hello@simplygolf365.ie',
  instagram: '@simplygolf365',
  category: 'golf-simulator',
  founded_year: 2025,
  cta_primary_label: 'Book your event',
  cta_sticky_label: 'Get a quote',
  cta_final_label: 'Get a quote in 24 hrs',
  sections: [
    {
      id: SECTION_IDS.hero,
      type: 'hero_photo',
      display_order: 1,
      config: {},
      content: {
        headline_line_1: 'We bring',
        headline_line_2: 'the course to you.',
        italic_accent_phrase: 'the course to you.',
        subhead:
          'A 25-foot inflatable dome with a Foresight simulator inside. Built for events, workplaces and private gatherings, anywhere in Munster, rain or shine.',
        hero_image_id: MEDIA.hero,
        primary_cta: { label: 'Book your event', target_section: 'events' },
        secondary_cta: { label: 'Book a lesson', target_section: 'coaching' }
      }
    },
    {
      id: SECTION_IDS.trust,
      type: 'trust_bar',
      display_order: 2,
      config: {},
      content: {
        pills: [
          { label: 'PGA Professional' },
          { label: 'Foresight simulator' },
          { label: 'Munster and beyond' },
          { label: 'Bookable for any event' }
        ]
      }
    },
    {
      id: SECTION_IDS.mission,
      type: 'mission',
      display_order: 3,
      config: {},
      content: {
        statement:
          'Our mission is to make premium golf experiences accessible anywhere, anytime. Using cutting-edge Foresight technology, we bring the excitement of the course to events, workplaces, and private gatherings, rain or shine, season after season. We aim to create memorable, social, and inclusive golf experiences that elevate any occasion.',
        highlight_word: 'Foresight',
        signed_by: 'Jack Howard, Founder'
      }
    },
    {
      id: SECTION_IDS.services,
      type: 'services_tabbed',
      display_order: 4,
      config: { popular_tag_label: 'Most popular' },
      content: {
        intro_headline: 'Pick your event. We do the rest.',
        italic_accent_phrase: 'We do the rest.',
        intro_subhead:
          'All prices include VAT and setup. We arrive 2 hours before, run the day, and pack down after. Final invoicing on confirmed numbers.',
        groups: [
          {
            id: 'events',
            title: 'Events and corporate',
            blurb: 'We bring the dome to your venue and run the day. Up to 30 guests.',
            services: [
              { name: 'Half-Day Corporate', duration: '4 hours', price: 650, description: 'Up to 20 guests. Closest-to-pin, longest-drive, team leaderboard.', popular: false },
              { name: 'Full-Day Corporate', duration: '8 hours', price: 1200, description: 'Team-building format. Format brief, leaderboards, prizes, branded scorecards.', popular: true },
              { name: 'Stag / Hen Package', duration: '3 hours', price: 450, description: 'Group of 10 to 12. Food and drinks tie-ins available.', popular: false },
              { name: 'Christmas Office Party', duration: '4 hours', price: 750, description: 'Seasonal pricing. Mulled wine package optional.', popular: false }
            ]
          },
          {
            id: 'coaching',
            title: '1-to-1 Coaching',
            blurb: 'Pop-up coaching with PGA Professional Jack Howard. Full Foresight swing analysis.',
            services: [
              { name: '60-min Lesson', duration: '60 min', price: 65, description: 'Swing analysis, technical work, video to take home.', popular: false },
              { name: 'Lesson Block x 5', duration: '5 x 60 min', price: 280, description: 'Save 45. Structured progression plan with Foresight data.', popular: true },
              { name: 'Ladies Get Into Golf', duration: '60 min', price: 40, description: 'Introductory session for new and returning women golfers.', popular: false }
            ]
          },
          {
            id: 'private',
            title: 'Private gatherings',
            blurb: 'Birthday, anniversary, fundraiser, or just a few mates. Smaller groups, your venue.',
            services: [
              { name: 'Group of 4', duration: '2 hours', price: 220, description: 'Compact setup. Suits home garages and small venues.', popular: false },
              { name: 'Group of 8', duration: '3 hours', price: 380, description: 'The popular size. Full dome experience.', popular: true },
              { name: 'Custom event', duration: 'Bespoke', price: null, description: 'Tell us what you need. We will quote.', popular: false }
            ]
          }
        ]
      }
    },
    {
      id: SECTION_IDS.about,
      type: 'about',
      display_order: 5,
      config: {},
      content: {
        eyebrow: 'How it started',
        headline: 'Why this exists.',
        body:
          'The idea came over dinner in late 2024. Jack was working in golf at Fota and Old Head, weighing up a move abroad, and did not want it. He wanted to stay in Irish golf, but bring it somewhere new. So he built it: a dome that travels, a screen that does not care about the weather, a way for the people who would never set foot on a course to have a brilliant evening playing one.',
        founder: {
          name: 'Jack Howard',
          role: 'PGA Professional, Founder',
          bio: 'Jack worked at Fota Island and Old Head before launching SIMply Golf 365 with partner Tara Nolan. Recent winner of the Munster PGA Winter Series in Thurles.'
        },
        portrait_media_id: MEDIA.about_portrait,
        portrait_caption: 'Jack with a young customer inside the dome at a pop-up event.'
      }
    },
    {
      id: SECTION_IDS.gallery,
      type: 'gallery_mosaic',
      display_order: 6,
      config: {},
      content: {
        eyebrow: 'Inside the dome',
        intro_headline: 'What you actually get on the day.',
        italic_accent_phrase: 'actually',
        fallback_label: 'Inside the dome',
        items: [
          { type: 'image', media_id: MEDIA.gallery_1, caption: 'Mid-swing on the Foresight simulator' },
          { type: 'image', media_id: MEDIA.gallery_2, caption: 'Inside the dome at a corporate evening event' },
          {
            type: 'video',
            poster_media_id: MEDIA.gallery_5,
            video_url: null,
            label: 'Behind the scenes',
            caption: 'Setup. Two hours from van to first shot.'
          },
          { type: 'image', media_id: MEDIA.gallery_3, caption: 'Inside the dome, a player at the tee' },
          { type: 'image', media_id: MEDIA.gallery_4, caption: 'Memorable, social, inclusive, by design' }
        ]
      }
    },
    {
      id: SECTION_IDS.location,
      type: 'location_mobile',
      display_order: 7,
      config: {},
      content: {
        eyebrow: 'Where we go',
        headline: 'We come to you, anywhere in Munster.',
        italic_accent_phrase: 'you',
        subhead:
          'The dome packs into a van. We bring everything, screen, projector, mats, clubs if you need them. You bring the venue and the guest list.',
        zones: [
          { label: 'Zone 1, No travel fee', name: 'Cork and Munster', description: 'Cork city, county and surrounds, no travel fee.', is_primary: true },
          { label: 'Zone 2, Small supplement', name: 'Greater Munster', description: 'Limerick, Tipperary, Kerry, Waterford, small travel supplement.', is_primary: false },
          { label: 'Anywhere else', name: 'Rest of Ireland', description: 'Anywhere in Ireland, quote on enquiry.', is_primary: false }
        ],
        venue_requirements: {
          eyebrow: 'Venue requirements',
          items: [
            { stat: '8 x 8 m', label: 'Floor space' },
            { stat: '8 m', label: 'Ceiling height' },
            { stat: 'Indoor', label: 'Hall, marquee or warehouse' },
            { stat: 'Standard 13A', label: 'Power supply' }
          ],
          callout: 'Not sure if your venue works? Send a photo and we will confirm in under 24 hours.'
        }
      }
    },
    {
      id: SECTION_IDS.press,
      type: 'social_proof_press',
      display_order: 8,
      config: {},
      content: {
        eyebrow: 'In the press',
        headline: "Something Cork hasn't seen before.",
        press: [
          { outlet: 'Echo Live', title: "Cork's newest golf simulator experience", date: 'Nov 2025' },
          { outlet: 'Cork Golf News', title: 'Jack Howard launches Simply Golf 365', date: 'Nov 2025' },
          { outlet: 'Carrigdhoun', title: "Ireland's First Mobile Golf Simulator", date: 'Dec 2025' }
        ]
      }
    },
    {
      id: SECTION_IDS.reviews,
      type: 'social_proof_reviews',
      display_order: 9,
      config: {},
      content: {
        eyebrow: 'What customers say',
        headline: 'People come back for a reason.',
        reviews: [
          {
            quote:
              'Jack ran a half-day for our team, 16 of us, none of us proper golfers. The leaderboard was vicious and the craic was savage. Sorted.',
            author: 'Tech company team lead',
            role: 'Corporate half-day',
            context: 'Cork city, Nov 2025',
            date: '2025-11-14'
          }
        ]
      }
    },
    {
      id: SECTION_IDS.contact,
      type: 'contact',
      display_order: 10,
      config: {},
      content: {
        headline: 'Have a date in mind?',
        italic_accent_phrase: 'mind?',
        subhead:
          'Tell us when and where. We will come back within 24 hours with availability and a quote.',
        contact_methods: [
          { type: 'phone', value: '087 409 1291', label: 'Call' },
          { type: 'email', value: 'hello@simplygolf365.ie', label: 'Email' },
          { type: 'instagram', value: '@simplygolf365', label: 'Instagram' }
        ],
        cta_label: 'Get a quote in 24 hrs',
        cta_action: 'mailto'
      }
    }
  ]
};

export const simplyGolf365: Business = BusinessSchema.parse(raw);
