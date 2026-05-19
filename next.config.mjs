/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: '**.supabase.in' },
      { protocol: 'https', hostname: 'api.mapbox.com' }
    ]
  },
  // Keep design reference files out of the build trace and the runtime bundle.
  // The /reference tree is for humans, not for the app.
  outputFileTracingExcludes: {
    '*': ['./reference/**/*']
  }
};

export default nextConfig;
