// next.config.js
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: { unoptimized: true },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
