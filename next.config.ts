import type { NextConfig } from "next";
import { createProxyMiddleware } from "http-proxy-middleware";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/shipengine/:path*",
        destination: "https://api.shipengine.com/v1/:path*", // Proxy to ShipEngine API
      },
    ];
  },
  webpackDevMiddleware: (devServer) => {
    if (!devServer) {
      return devServer;
    }

    devServer.app.use(
      "/api/shipengine",
      createProxyMiddleware({
        target: "https://api.shipengine.com",
        changeOrigin: true,
        secure: false,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "API-Key": process.env.NEXT_PUBLIC_SHIPENGINE_API_KEY! || "",
        },
        pathRewrite: { "^/api/shipengine": "" },
      })
    );

    return devServer;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
