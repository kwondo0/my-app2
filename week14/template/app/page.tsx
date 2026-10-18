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
        <span className="rounded-full bg-green-600/10 px-3 py-1 text-xs font-medium tracking-wide text-green-700">
          ✅ 5종 취약점 방어 완료 — Rate Limiting + 보안 헤더 추가
        </span>

        <h1 className="text-3xl font-semibold tracking-tight text-black dark:text-zinc-50">
          웹서버보안프로그래밍 — 14주차
        </h1>
        <p className="max-w-md text-base leading-7 text-zinc-600 dark:text-zinc-400">
          로그인 폼에 시도 횟수 제한(Rate Limiting)을 추가했고, 모든 응답에
          보안 헤더를 붙였습니다. 12~14주차에 걸쳐 XSS·시크릿 노출·NoSQL
          Injection·IDOR·Rate Limiting까지 5종 취약점을 모두 다뤘습니다.
        </p>

        {/* Counter는 useState를 쓰는 Client Component 입니다. */}
        <Counter />

        <div className="flex flex-col gap-2 text-sm">
          <Link
            href="/login"
            className="font-medium text-zinc-950 underline underline-offset-4 dark:text-zinc-50"
          >
            /login — 🆕 Rate Limiting: 1분에 5번 넘게 틀리면 잠깁니다 →
          </Link>
          <Link
            href="/notices"
            className="font-medium text-zinc-950 underline underline-offset-4 dark:text-zinc-50"
          >
            /notices — ✅ XSS 수정: dangerouslySetInnerHTML 제거 →
          </Link>
          <Link
            href="/products"
            className="font-medium text-zinc-950 underline underline-offset-4 dark:text-zinc-50"
          >
            /products — 🆕 안전한 검색 추가 (lib/products.ts의 escapeRegExp 참고) →
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
