import Link from 'next/link'
import { getProducts } from '@/lib/products'

export default async function ProductsPage() {
  const products = await getProducts()

  return (
    <div className="mx-auto max-w-2xl flex-1 px-8 py-16">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black dark:text-zinc-50">
          상품 목록
        </h1>
      </div>

      <ul className="flex flex-col gap-4">
        {products.map((product) => (
          <li key={product.id}>
            <Link
              href={`/products/${product.id}`}
              className="block rounded-lg border border-black/8 px-5 py-4 transition-colors hover:bg-black/3 dark:border-white/15 dark:hover:bg-white/5"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-black dark:text-zinc-50">
                    {product.name}
                  </p>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    {product.description}
                  </p>
                </div>
                <span className="text-sm text-zinc-500 dark:text-zinc-400">
                  ❤️ {product.likes}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
