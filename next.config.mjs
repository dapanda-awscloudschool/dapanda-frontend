/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  logging: {
    fetches: {
      fullUrl: true,
    },
    eslint: {
      ignoreDuringBuilds: true,
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
      },
      {
        protocol: "https",
        hostname: "static.wixstatic.com",
      },
      {
        protocol: "https",
        hostname: "dapanda-files-test.s3.ap-northeast-2.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "d3jzg5ylljnsnd.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
