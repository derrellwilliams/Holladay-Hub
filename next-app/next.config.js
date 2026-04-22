const path = require('path');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin workspace root to avoid false detection from parent lockfiles
  outputFileTracingRoot: path.join(__dirname, '..'),
  // Allow better-sqlite3 (native module) to be used server-side
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = [...(config.externals || []), 'better-sqlite3'];
    }
    return config;
  },
};

module.exports = nextConfig;
