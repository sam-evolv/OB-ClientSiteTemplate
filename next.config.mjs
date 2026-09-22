/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Server Actions default to a 1MB body limit — far below a normal phone photo
  // (2-5MB). Real uploads were therefore rejected by the framework with a 500
  // BEFORE the upload action ran, so the owner saw the panel vanish with no
  // explanation and the friendly "that photo is too big" message never fired.
  // sharp downscales every upload anyway, so large originals are safe to accept.
  serverActions: {
    bodySizeLimit: '16mb'
  },
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
