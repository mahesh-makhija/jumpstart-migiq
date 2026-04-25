/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: { serverActions: { bodySizeLimit: "2mb" } },
  serverExternalPackages: ["jsdom", "@mozilla/readability"],
};

module.exports = nextConfig;
