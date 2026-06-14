/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  // 部署到 langhua98.github.io/superadmin-ai 时取消下面注释
  // basePath: "/superadmin-ai",
  images: {
    unoptimized: true, // 静态导出不支持 Next.js 图片优化
  },
};

export default nextConfig;
