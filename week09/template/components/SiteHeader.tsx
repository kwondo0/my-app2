import Link from "next/link";
import { auth } from "@/auth";
import { logoutAction } from "@/lib/actions";

// 여러 페이지에서 공통으로 쓰는 상단 내비게이션입니다.
// app/layout.tsx에 한 번만 넣어두면 모든 페이지에 자동으로 보입니다 —
// "재사용 가능한 컴포넌트"의 가장 기본적인 예시입니다.
//
// 7주차부터 async Server Component가 되었습니다: auth()로 현재 세션을
// 직접 읽어서, 로그인 상태에 따라 다른 버튼을 보여줍니다. 클라이언트
// 자바스크립트 없이도(useState 없이도) 이게 가능하다는 점이 핵심입니다.
// 9주차부터는 role도 함께 보여줍니다 — 실제 권한 검사는 middleware.ts와
// lib/actions.ts에서 이뤄지고, 여기서는 그 결과를 사용자에게 보여줄 뿐입니다.
export async function SiteHeader() {
  const session = await auth();

  return (
    <header className="border-b border-black/[.08] dark:border-white/[.145]">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-8 py-4">
        <Link href="/" className="text-sm font-semibold text-black dark:text-zinc-50">
          웹서버보안프로그래밍
        </Link>
        <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-400">
          <Link href="/products" className="hover:text-black dark:hover:text-zinc-50">
            상품
          </Link>
          <Link href="/notices" className="hover:text-black dark:hover:text-zinc-50">
            공지사항
          </Link>
          <Link
            href="/notices/new"
            className="rounded-md border border-black/[.08] px-3 py-1.5 hover:bg-black/[.03] dark:border-white/[.145] dark:hover:bg-white/[.05]"
          >
            글쓰기
          </Link>
          {session?.user ? (
            <div className="flex items-center gap-3">
              <span className="text-zinc-500 dark:text-zinc-400">
                {session.user.name}님
                {session.user.role === "admin" && (
                  <span className="ml-1.5 rounded bg-black/[.06] px-1.5 py-0.5 text-xs font-medium text-zinc-600 dark:bg-white/[.08] dark:text-zinc-300">
                    관리자
                  </span>
                )}
              </span>
              <form action={logoutAction}>
                <button
                  type="submit"
                  className="rounded-md border border-black/[.08] px-3 py-1.5 hover:bg-black/[.03] dark:border-white/[.145] dark:hover:bg-white/[.05]"
                >
                  로그아웃
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-md border border-black/[.08] px-3 py-1.5 hover:bg-black/[.03] dark:border-white/[.145] dark:hover:bg-white/[.05]"
            >
              로그인
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
