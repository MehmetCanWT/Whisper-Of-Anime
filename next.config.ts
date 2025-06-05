// next.config.js (veya next.config.mjs)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true, // Bu satır projenizde zaten olabilir
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
        port: '',
        pathname: '/images/anime/**', // Veya daha genel bir yol: '/images/**'
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com', // For YouTube thumbnails if used
        port: '',
        pathname: '/vi/**',
      }
      // Gerekirse diğer domainleri buraya ekleyebilirsiniz
    ],
  },
  // Diğer Next.js yapılandırmalarınız buraya gelebilir
};

module.exports = nextConfig;

// Eğer next.config.ts kullanıyorsanız:
// import type { NextConfig } from 'next';
// const nextConfig: NextConfig = { ... yukarıdaki gibi ... };
// export default nextConfig;
