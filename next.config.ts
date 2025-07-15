import { env } from "@/lib/env";
import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "api.el-salam.net",
        port: "",
        pathname: "/**",
      },
    ],
  },
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/api/:path((?!invalidate-cache).*)", // exclude `invalidate-cache`
        destination: `${env.NEXT_PUBLIC_API_URL}/:path`,
      },
    ];
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
