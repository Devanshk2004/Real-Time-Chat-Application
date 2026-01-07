/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",      // Exports static HTML/CSS/JS
  distDir: "dist",       // Changes output folder from .next to dist
  images: {
    unoptimized: true,   // Required for static export
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;