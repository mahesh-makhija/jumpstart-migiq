/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { bodySizeLimit: "2mb" } },
  serverExternalPackages: ["jsdom", "@mozilla/readability"],
  env: {
    // Vercel's stable URL for the current branch (does not change between
    // deploys). The client uses this to auto-redirect off any per-deploy
    // throwaway URL the user may have landed on.
    NEXT_PUBLIC_CANONICAL_HOST:
      process.env.VERCEL_BRANCH_URL || process.env.VERCEL_PROJECT_PRODUCTION_URL || "",
  },
};

module.exports = nextConfig;
