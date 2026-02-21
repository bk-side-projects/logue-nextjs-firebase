/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Add this line
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
  },
};

export default nextConfig;
