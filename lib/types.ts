export type SocialLinks = Partial<Record<'instagram' | 'facebook' | 'tiktok' | 'x' | 'linkedin', string>>;

export type Service = {
  id: string;
  name: string;
  duration?: number | string | null;
  price?: number | string | null;
  description?: string | null;
  category?: string | null;
};

export type BusinessHour = {
  day: string;
  opens_at?: string | null;
  closes_at?: string | null;
  is_closed?: boolean | null;
};

export type Testimonial = {
  quote: string;
  author: string;
  role?: string | null;
  date?: string | null;
  photo_url?: string | null;
};

export type TeamMember = {
  name: string;
  role?: string | null;
  photo_url?: string | null;
};

export type Offer = {
  title: string;
  description?: string | null;
  expires_at?: string | null;
};

export type Business = {
  name: string;
  slug: string;
  category: string;
  primary_colour: string;
  tagline?: string | null;
  website_headline?: string | null;
  about_long?: string | null;
  hero_image_url?: string | null;
  cover_image_url?: string | null;
  logo_url?: string | null;
  gallery_urls?: string[] | null;
  address_line?: string | null;
  city?: string | null;
  eircode?: string | null;
  phone?: string | null;
  email?: string | null;
  socials?: SocialLinks | null;
  testimonials?: Testimonial[] | null;
  founder_name?: string | null;
  founder_photo_url?: string | null;
  year_founded?: number | string | null;
  amenities?: string[] | string | null;
  parking_info?: string | null;
  nearest_landmark?: string | null;
  public_transport_info?: string | null;
  instagram_handle?: string | null;
  services: Service[];
  business_hours: BusinessHour[];
};
