'use client'

import { useState } from 'react'

export function LikeButton({
  id,
  initialLikes,
}: {
  id: string
  initialLikes: number
}) {
  const [likes, setLikes] = useState(initialLikes)

  return (
    <button
      type="button"
      onClick={() => setLikes((prev) => prev + 1)}
      className="inline-flex w-fit items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm font-medium text-zinc-800 shadow-sm transition hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
      aria-label={`${id} 상품 좋아요 ${likes}개`}
    >
      <span aria-hidden="true">👍</span>
      좋아요 {likes}
    </button>
  )
}
