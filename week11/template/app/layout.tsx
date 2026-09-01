import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono } from "next/font/google";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "웹서버보안프로그래밍 — 11주차 고급 예제 I 완성: 주문",
  description: "Next.js 16 App Router 실습 — 장바구니 → 주문 생성 + 소유권 기반 주문 조회 (11주차)",
};

// app/layout.tsx는 모든 페이지를 감싸는 "루트 레이아웃"입니다.
// <html>, <body> 태그는 반드시 이 파일에만 있어야 하며,
// 하위 폴더(app/about 등)에 layout.tsx를 추가하면 그 경로에만
// 적용되는 레이아웃을 중첩해서 만들 수 있습니다.
//
// children 타입은 Next.js가 `next dev`/`next build` 때 자동 생성하는
// LayoutProps<"/">로도 쓸 수 있지만, 그러면 한 번 빌드하기 전까지는
// 타입 에러가 납니다. 수업에서는 무엇이 들어오는지 바로 알 수 있도록
// React.ReactNode로 명시합니다.
export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
