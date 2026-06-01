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
  // The /reference and /handoff trees are for humans, not for the app.
  outputFileTracingExcludes: {
    '*': ['./reference/**/*', './handoff/**/*']
  }
};

export default nextConfig;
