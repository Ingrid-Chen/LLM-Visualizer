/** @type {import('next').NextConfig} */
const nextConfig = {
  // 纯静态导出（CLAUDE.md 设计原则 2：无后端、无运行时 API 调用）
  output: 'export',
  images: { unoptimized: true },
  trailingSlash: true,
};

module.exports = nextConfig;
