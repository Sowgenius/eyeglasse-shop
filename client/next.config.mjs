/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Exclude test files from production build
  onDemandEntries: {
    // Exclude test pages
    exclude: [/\/(__tests__|test)/],
  },
};

export default nextConfig;
