import type { Business } from './types';

export const demoBusiness: Business = {
  name: 'Evolv Performance',
  slug: 'evolv-performance',
  category: 'golf simulator',
  primary_colour: '#D4AF37',
  tagline: 'Private golf simulator sessions, coaching and club practice in the heart of Cork.',
  website_headline: 'Sharper golf, booked in seconds.',
  about_long:
    'Evolv Performance is built for golfers who want serious practice without the theatre. Step into a private simulator bay, get precise feedback, and leave with a clearer swing than the one you arrived with.\n\nFounded for players who care about progress, the studio pairs premium launch monitor technology with calm, focused coaching. Whether you are chasing a lower handicap or just want a warm place to play nine holes after work, every session is designed to feel considered.',
  hero_image_url: null,
  cover_image_url: null,
  logo_url: null,
  gallery_urls: [],
  address_line: 'Unit 4, Marina Commercial Park',
  city: 'Cork',
  eircode: 'T12 A1B2',
  latitude: 51.8998,
  longitude: -8.4527,
  phone: '+353 87 123 4567',
  email: 'hello@evolvperformance.ie',
  socials: {
    instagram: 'https://instagram.com/evolvperformance'
  },
  founder_name: 'Stephen O\'Mahony',
  founder_photo_url: null,
  year_founded: 2024,
  amenities: ['Private bays', 'TrackMan data', 'Club storage', 'Changing area'],
  parking_info: 'Free parking directly outside the studio.',
  nearest_landmark: 'Two minutes from Pairc Ui Chaoimh.',
  public_transport_info: 'Served by the 202 and 212 bus routes.',
  instagram_handle: 'evolvperformance',
  testimonials: [
    {
      quote: 'The first session gave me more useful feedback than six months of guessing at the range.',
      author: 'Mark Buckley',
      role: 'Member since 2025'
    },
    {
      quote: 'Private, calm, and properly premium. I booked my next slot before I left the bay.',
      author: 'Aoife Ryan',
      role: 'Cork golfer'
    },
    {
      quote: 'The data finally made my miss make sense. Stephen had me striking it cleaner inside half an hour.',
      author: 'Conor Walsh',
      role: '12 handicap'
    }
  ],
  services: [
    { id: 'sim-60', name: 'Simulator bay', duration: 60, price: 35, description: 'A private practice bay with full launch monitor data.', category: 'Practice' },
    { id: 'sim-90', name: 'Extended bay session', duration: 90, price: 50, description: 'More time for practice, gapping or a full virtual round.', category: 'Practice' },
    { id: 'coach-45', name: 'Swing coaching', duration: 45, price: 65, description: 'Focused one-to-one coaching with clear next steps.', category: 'Coaching' },
    { id: 'gap', name: 'Club gapping session', duration: 60, price: 55, description: 'Know every carry number in the bag before the next medal.', category: 'Coaching' }
  ],
  business_hours: [
    { day: 'Monday', opens_at: '07:00', closes_at: '21:00' },
    { day: 'Tuesday', opens_at: '07:00', closes_at: '21:00' },
    { day: 'Wednesday', opens_at: '07:00', closes_at: '21:00' },
    { day: 'Thursday', opens_at: '07:00', closes_at: '21:00' },
    { day: 'Friday', opens_at: '07:00', closes_at: '20:00' },
    { day: 'Saturday', opens_at: '08:00', closes_at: '18:00' },
    { day: 'Sunday', opens_at: '09:00', closes_at: '16:00' }
  ]
};
