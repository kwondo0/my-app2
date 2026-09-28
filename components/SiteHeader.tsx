import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="border-b border-zinc-200 bg-white/80 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="text-sm font-semibold tracking-wide text-zinc-900 dark:text-zinc-50"
        >
          웹서버보안프로그래밍
        </Link>

        <nav className="flex items-center gap-4 text-sm text-zinc-600 dark:text-zinc-300">
          <Link
            href="/"
            className="transition hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            홈
          </Link>
          <Link
            href="/notices"
            className="transition hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            공지사항
          </Link>
          <Link
            href="/products"
            className="transition hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            상품
          </Link>
          <Link
            href="/about"
            className="transition hover:text-zinc-900 dark:hover:text-zinc-50"
          >
            소개
          </Link>
        </nav>
      </div>
    </header>
  )
}
