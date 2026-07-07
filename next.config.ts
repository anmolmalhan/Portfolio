import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    viewTransition: true,
  },
  // Playwright hits 127.0.0.1 rather than localhost; whitelist it so the
  // dev-server doesn't spam a cross-origin warning during E2E runs.
  allowedDevOrigins: ["127.0.0.1"],
  async redirects() {
    return [
      // The Client Work OS case study was rebranded to Swift Digital Seva;
      // keep links shared under the old slug working.
      {
        source: "/projects/client-work-os",
        destination: "/projects/swift-digital-seva",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
