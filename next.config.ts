import type { NextConfig } from "next";
import { dirname } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(fileURLToPath(import.meta.url));

const isDevelopment = process.env.NODE_ENV === "development";
const highLevelWidgetOrigin = "https://widgets.leadconnectorhq.com";
const highLevelApiOrigin = "https://services.leadconnectorhq.com";
const highLevelRealtimeOrigin = "wss://services.leadconnectorhq.com";
const highLevelStaticOrigin = "https://stcdn.leadconnectorhq.com";
const highLevelMediaOrigin = "https://assets.cdn.filesafe.space";
const cloudinaryMediaOrigin = "https://res.cloudinary.com";
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline' ${highLevelWidgetOrigin} ${highLevelApiOrigin} ${highLevelStaticOrigin}${isDevelopment ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  `img-src 'self' data: blob: ${highLevelWidgetOrigin} ${highLevelMediaOrigin}`,
  "font-src 'self' data: https://fonts.gstatic.com",
  `media-src 'self' ${cloudinaryMediaOrigin}`,
  `connect-src 'self' ${cloudinaryMediaOrigin} ${highLevelApiOrigin} ${highLevelRealtimeOrigin} ${highLevelWidgetOrigin} ${highLevelStaticOrigin}${isDevelopment ? " ws: wss:" : ""}`,
  `frame-src ${highLevelWidgetOrigin}`,
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
].join("; ");

const nextConfig: NextConfig = {
  turbopack: { root: projectRoot },
  allowedDevOrigins: ["127.0.0.1"],
  async headers() {
    return [
      {
        source: "/api/:path*",
        headers: [
          { key: "Cache-Control", value: "private, no-store, max-age=0" },
          { key: "X-Robots-Tag", value: "noindex, nofollow, noarchive" },
        ],
      },
      {
        source: "/:path*",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), payment=()" },
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
        ],
      },
    ];
  },
};

export default nextConfig;
