/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the tracing root to this project. Without it Next walks up and can pick
  // an unrelated lockfile (e.g. a stray ~/package-lock.json) as the workspace
  // root, which mis-scopes serverless bundles.
  outputFileTracingRoot: import.meta.dirname,
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
