'use client'

import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { X } from '@phosphor-icons/react'

export default function ActiveFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const sort = searchParams.get('sort')
  const category = searchParams.get('category')
  const price = searchParams.get('price')

  const filters = [
    sort &&
      sort !== 'newest' && {
        key: 'sort',
        label: `Sort: ${sort.replace('_', ' ')}`,
      },
    category && { key: 'category', label: `Category: ${category}` },
    price && { key: 'price', label: `Price: $${price.replace('-', ' – $')}` },
  ].filter(Boolean) as { key: string; label: string }[]

  if (filters.length === 0) return null

  function removeFilter(key: string) {
    const params = new URLSearchParams(searchParams.toString())
    params.delete(key)
    params.delete('page')
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <span
          key={filter.key}
          className="bg-muted flex items-center gap-1 rounded-full border px-3 py-1 text-xs"
        >
          {filter.label}
          <button
            onClick={() => removeFilter(filter.key)}
            className="text-muted-foreground hover:text-foreground ml-1"
          >
            <X size={12} />
          </button>
        </span>
      ))}
    </div>
  )
}
