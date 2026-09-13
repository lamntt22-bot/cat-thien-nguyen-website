import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

// Ảnh/video bài viết upload lên Supabase Storage được hiển thị/tải thẳng từ
// domain Supabase (không qua server của mình) — CSP phải cho phép domain này.
const supabaseOrigin =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://asjnvumrzqkjjhxnshvq.supabase.co";

// Widget "Quan tâm Zalo OA" (vòng quay may mắn) tải script từ sp.zalo.me và render
// trong iframe cùng domain — CSP phải cho phép cả script-src lẫn frame-src cho domain này.
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      `script-src 'self' 'unsafe-inline' https://sp.zalo.me https://za.zdn.vn${isDev ? " 'unsafe-eval'" : ""}`,
      "style-src 'self' 'unsafe-inline'",
      `img-src 'self' blob: data: ${supabaseOrigin} https://sp.zalo.me`,
      `media-src 'self' blob: ${supabaseOrigin}`,
      "font-src 'self'",
      `connect-src 'self' ${supabaseOrigin} https://sp.zalo.me`,
      "frame-src https://www.youtube-nocookie.com https://sp.zalo.me https://button-follow.zalo.me",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
      "upgrade-insecure-requests",
    ].join("; "),
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: new URL(supabaseOrigin).hostname,
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
