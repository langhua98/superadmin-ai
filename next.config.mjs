/**
 * GitHub Pages 项目页部署在 https://langhua98.github.io/superadmin-ai/ 子路径下，
 * 必须设置 basePath，否则 /_next 下的 CSS、JS、字体会按根路径请求而全部 404，
 * 导致页面无样式、无法交互。
 *
 * @type {import('next').NextConfig}
 */
const basePath = "/superadmin-ai";

const nextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath,
  images: {
    unoptimized: true, // 静态导出不支持 Next.js 图片优化
  },
  trailingSlash: true, // 子路径下静态托管更稳妥
};

export default nextConfig;
