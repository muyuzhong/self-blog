/** @type {import('next').NextConfig} */
const { registerSeoBuildArtifacts } = require('./scripts/seo-assets.cjs')

registerSeoBuildArtifacts()

const nextConfig = {
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  compress: true,
  poweredByHeader: false,
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
}

module.exports = nextConfig
