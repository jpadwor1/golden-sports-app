/** @type {import('next').NextConfig} */
// const { createProxyMiddleware } = require('http-proxy-middleware');
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  // async rewrites() {
  //   return [
  //     {
  //       source: '/api/:path*', // This is the local endpoint prefix to proxy
  //       destination: 'https://goldensports.kinde.com/api/:path*', // The external API endpoint
  //     },
  //   ];
  // },
};

module.exports = nextConfig;
