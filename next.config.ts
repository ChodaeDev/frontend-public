import type { NextConfig } from 'next';

const backendUrl = process.env.BACKEND_URL ?? 'http://localhost:8080';

const nextConfig: NextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/swagger-ui/:path*',
        destination: `${ backendUrl }/swagger-ui/:path*`,
      },
      {
        source: '/swagger-ui.html',
        destination: `${ backendUrl }/swagger-ui.html`,
      },
      {
        source: '/v3/api-docs',
        destination: `${ backendUrl }/v3/api-docs`,
      },
      {
        source: '/v3/api-docs/:path*',
        destination: `${ backendUrl }/v3/api-docs/:path*`,
      },
    ];
  },
};

export default nextConfig;
