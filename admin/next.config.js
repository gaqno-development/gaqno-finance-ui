/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // Enable standalone output for Docker
  transpilePackages: ["@gaqno-dev/ui", "@gaqno-dev/core"],
  assetPrefix: "/admin",
}

module.exports = nextConfig

