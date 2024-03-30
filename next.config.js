/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      {
        protocol: "https",
        hostname: "*.scdn.co",
      },
      {
        protocol: "https",
        hostname: "*.spotify.com",
      },
      {
        protocol: "https",
        hostname: "*.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "*.cloudinary.com",
      },
    ],
  },
  reactStrictMode: false,
};
