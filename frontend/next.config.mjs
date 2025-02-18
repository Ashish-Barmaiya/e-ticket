/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // Rewrrite for user routes
      {
        source: "/api/user/:path*", // Match /api/user/ and any subpaths
        destination: "http://eticketapp.test/user/:path*", // Forward to backend /user/:path*
      },
      // Rewrrite for host routes
      {
        source: "/api/host/:path*",
        destination: "http://eticketapp.test/host/:path*", // Forward to backend /host/:path*
      },
      // Rewrite for all other routes
      {
        source: "/api/:path*",
        destination: "http://eticketapp.test/:path*",
      },
    ];
  },
};

export default nextConfig;
