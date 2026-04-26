/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: '.next-dev',
  allowedDevOrigins: ['*.spock.replit.dev', '*.replit.dev'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
