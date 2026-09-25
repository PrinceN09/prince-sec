import type { NextConfig } from "next";
import { staticSecurityHeaders } from "./src/config/security-headers";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Do not advertise the framework in a response header.
  poweredByHeader: false,
  // Do not let `next dev` write AI-agent instruction files into the repository.
  agentRules: false,
  async headers() {
    return [{ source: "/:path*", headers: staticSecurityHeaders }];
  },
};

export default nextConfig;
