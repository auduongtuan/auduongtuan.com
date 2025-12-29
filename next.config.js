/** @type {import('next').NextConfig} */
module.exports = {
  images: {
    qualities: [25, 50, 75, 100],
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
        hostname: "*.youtube.com",
      },
      {
        protocol: "https",
        hostname: "*.spotifycdn.com",
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
    localPatterns: [
      {
        pathname: "/api/**",
      },
      {
        pathname: "/about/**",
      },
      {
        pathname: "/uploads/**",
      },
    ],
  },
  reactStrictMode: false,
};
