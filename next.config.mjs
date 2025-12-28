/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    // Warning: Ini membolehkan deploy meski ada error ESLint
    ignoreDuringBuilds: true,
  },
  reactCompiler: true,
};

export default nextConfig;
