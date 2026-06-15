import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Newsreader } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

const newsreader = Newsreader({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "SuperAdmin AI",
  description: "Claude 风格的 AI 聊天界面",
};

/** 禁用用户缩放，保持 1:1 缩放 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        {/* iOS 10+ 忽略 viewport user-scalable=no，必须用 JS 拦截多点触控事件才能真正禁缩放 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
(function(){
  // 禁止双指捏合缩放
  document.addEventListener('touchmove', function(e){
    if(e.touches && e.touches.length > 1){ e.preventDefault(); }
  }, { passive: false });
  // 禁止双击缩放
  var last = 0;
  document.addEventListener('touchend', function(e){
    var now = Date.now();
    if(now - last < 300){ e.preventDefault(); }
    last = now;
  }, false);
  // 禁止手势事件（Safari 私有）
  document.addEventListener('gesturestart', function(e){ e.preventDefault(); }, false);
  document.addEventListener('gesturechange', function(e){ e.preventDefault(); }, false);
})();
`.trim(),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} font-sans antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
