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
        <span className="rounded-full bg-black/[.06] px-3 py-1 text-xs font-medium tracking-wide text-zinc-600 dark:bg-white/[.08] dark:text-zinc-300">
          Server Component
        </span>

        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          웹서버보안프로그래밍 — 11주차
        </h1>
        <p className="max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-400">
          장바구니가 이제 진짜 주문(Order)으로 이어집니다. 로그인 후 &ldquo;결제하기&rdquo;를
          눌러보고, 본인 주문만 보이는지 &ldquo;주문내역&rdquo;에서 확인해보세요.
        </p>

        {/* Counter는 useState를 쓰는 Client Component 입니다. */}
        <Counter />

        <div className="flex flex-col gap-2 text-sm">
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
            /orders — 11주차 신규: 내 주문 내역 (로그인 필요) →
          </Link>
          <Link
            href="/notices"
            className="font-medium text-zinc-950 underline underline-offset-4 dark:text-zinc-50"
          >
            /notices — 9주차까지의 코스 프로젝트: 공지사항 게시판 →
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
