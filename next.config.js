/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "60e830e8446bb64f54e43b7c0613a05d.r2.cloudflarestorage.com",
        pathname: "/myecom2025/**"
      }
    ]
  },
};

module.exports = nextConfig;
