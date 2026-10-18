import Link from "next/link";
import { Counter } from "@/components/Counter";

// app/page.tsx는 "/" 경로를 담당합니다 (File-based Routing).
// 이 파일은 별도로 "use client"를 선언하지 않았으므로 기본값인
// Server Component입니다 — 서버에서만 실행되고, 브라우저로는
// 완성된 HTML만 전달됩니다.
export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-2xl flex-col items-center justify-center gap-8 py-24 px-8 text-center">
        <span className="rounded-full bg-red-600/10 px-3 py-1 text-xs font-medium tracking-wide text-red-600">
          ⚠ 교육용 취약 버전 (before) — 배포 금지
        </span>

        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          웹서버보안프로그래밍 — 12주차
        </h1>
        <p className="max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-400">
          11주차까지 만든 쇼핑몰에 저장형 XSS와 시크릿 노출을 일부러 남겨뒀습니다.
          &ldquo;공지사항&rdquo;과 &ldquo;/api/debug/env&rdquo;에서 직접 확인해보세요.
          13~14주차에 이 취약점들을 직접 찾아 고칩니다.
        </p>

        {/* Counter는 useState를 쓰는 Client Component 입니다. */}
        <Counter />

        <div className="flex flex-col gap-2 text-sm">
          <Link
            href="/notices"
            className="font-medium text-red-600 underline underline-offset-4"
          >
            /notices — 🚨 저장형 XSS: 글 내용이 이스케이프 없이 HTML로 렌더링됨 →
          </Link>
          <Link
            href="/api/debug/env"
            className="font-medium text-red-600 underline underline-offset-4"
          >
            /api/debug/env — 🚨 시크릿 노출: 인증 없이 환경변수를 그대로 반환 →
          </Link>
          <Link
            href="/products"
            className="font-medium text-zinc-950 underline underline-offset-4 dark:text-zinc-50"
          >
            /products — 쇼핑몰 코스 프로젝트: 상품 카탈로그 →
          </Link>
          <Link
            href="/cart"
            className="font-medium text-zinc-950 underline underline-offset-4 dark:text-zinc-50"
          >
            /cart — 장바구니 (로그인하면 결제 가능) →
          </Link>
          <Link
            href="/orders"
            className="font-medium text-zinc-950 underline underline-offset-4 dark:text-zinc-50"
          >
            /orders — 내 주문 내역 (로그인 필요) →
          </Link>
          <Link
            href="/register"
            className="font-medium text-zinc-950 underline underline-offset-4 dark:text-zinc-50"
          >
            /register — Auth.js 회원가입 (비밀번호 해싱) →
          </Link>
          <Link
            href="/about"
            className="font-medium text-zinc-950 underline underline-offset-4 dark:text-zinc-50"
          >
            /about — File-based Routing 확인 →
          </Link>
          <Link
            href="/api/hello"
            className="font-medium text-zinc-950 underline underline-offset-4 dark:text-zinc-50"
          >
            /api/hello — Route Handler가 응답하는 JSON 확인 →
          </Link>
        </div>
      </main>
    </div>
  );
}
