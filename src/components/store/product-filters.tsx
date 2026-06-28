'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { Button } from '@/components/ui/button'

type Category = { id: string; name: string; slug: string }

type Props = {
  categories: Category[]
}

const SORT_OPTIONS = [
  { label: 'Newest', value: 'newest' },
  { label: 'Price: Low to High', value: 'price_asc' },
  { label: 'Price: High to Low', value: 'price_desc' },
  { label: 'Name: A to Z', value: 'name_asc' },
]

const PRICE_RANGES = [
  { label: 'All prices', value: '' },
  { label: 'Under $25', value: '0-25' },
  { label: '$25 – $50', value: '25-50' },
  { label: '$50 – $100', value: '50-100' },
  { label: 'Over $100', value: '100-999999' },
]

export default function ProductFilters({ categories }: Props) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const currentSort = searchParams.get('sort') ?? 'newest'
  const currentCategory = searchParams.get('category') ?? ''
  const currentPrice = searchParams.get('price') ?? ''

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('page') // reset to page 1 on filter change
      router.push(`${pathname}?${params.toString()}`)
    },
    [router, pathname, searchParams]
  )

  function clearAll() {
    router.push(pathname)
  }

  const hasFilters = currentCategory || currentPrice || currentSort !== 'newest'

  return (
    <div className="space-y-6">
      {/* Sort */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Sort By
        </p>
        <div className="space-y-1">
          {SORT_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => updateParam('sort', option.value)}
              className={`w-full rounded px-3 py-1.5 text-left text-sm transition-colors ${
                currentSort === option.value
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price range */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Price Range
        </p>
        <div className="space-y-1">
          {PRICE_RANGES.map((range) => (
            <button
              key={range.value}
              onClick={() => updateParam('price', range.value)}
              className={`w-full rounded px-3 py-1.5 text-left text-sm transition-colors ${
                currentPrice === range.value
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-medium tracking-wider uppercase">
          Category
        </p>
        <div className="space-y-1">
          <button
            onClick={() => updateParam('category', '')}
            className={`w-full rounded px-3 py-1.5 text-left text-sm transition-colors ${
              currentCategory === ''
                ? 'bg-primary text-primary-foreground'
                : 'hover:bg-muted'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => updateParam('category', cat.slug)}
              className={`w-full rounded px-3 py-1.5 text-left text-sm transition-colors ${
                currentCategory === cat.slug
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Clear all */}
      {hasFilters && (
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={clearAll}
        >
          Clear All Filters
        </Button>
      )}
    </div>
  )
}
