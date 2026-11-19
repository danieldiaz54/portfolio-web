/** @type {import('next').NextConfig} */
const isStaticExport = process.env.STATIC_EXPORT === "1";
const rawBasePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const basePath =
  rawBasePath && rawBasePath.startsWith("/") ? rawBasePath.replace(/\/$/, "") : "";

const nextConfig = {
  output: isStaticExport ? "export" : "standalone",
  reactStrictMode: true,
  poweredByHeader: false,
  ...(isStaticExport
    ? {
        trailingSlash: true,
        images: { unoptimized: true },
        ...(basePath ? { basePath, assetPrefix: basePath } : {}),
      }
    : {}),
};

export default nextConfig;
