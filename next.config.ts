// next.config.js (veya next.config.mjs)

/** @type {import('next').NextConfig} */
const nextConfig = {
  
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
        port: '',
        pathname: '/images/**', // Bu, /images/ altındaki tüm yolları kapsar
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
        port: '',
        pathname: '/vi/**', // YouTube küçük resimleri için
      }
      // Gerekirse başka domainleri de buraya ekleyebilirsiniz
    ],
  },
  // Diğer Next.js yapılandırmalarınız buraya gelebilir
};

module.exports = nextConfig;

// Eğer next.config.ts kullanıyorsanız:
// import type { NextConfig } from 'next';
// const nextConfig: NextConfig = {
//   reactStrictMode: true,
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'cdn.myanimelist.net',
//         port: '',
//         pathname: '/images/**',
//       },
//       {
//         protocol: 'https',
//         hostname: 'img.youtube.com',
//         port: '',
//         pathname: '/vi/**',
//       }
//     ],
//   },
// };
// export default nextConfig;

