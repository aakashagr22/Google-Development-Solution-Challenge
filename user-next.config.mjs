/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['storage.googleapis.com'],
  },
  // Remove direct reference to the API key
  // Transpile specific modules that might cause issues
  transpilePackages: [
    '@googlemaps/js-api-loader',
    'recharts',
    'react-day-picker',
  ],
};

export default nextConfig;

