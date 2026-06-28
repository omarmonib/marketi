'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { CaretLeft, CaretRight } from '@phosphor-icons/react'

type Props = {
  totalPages: number
  currentPage: number
}

export default function Pagination({ totalPages, currentPage }: Props) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  if (totalPages <= 1) return null

  function buildUrl(page: number) {
    const params = new URLSearchParams(searchParams.toString())
    params.set('page', String(page))
    return `${pathname}?${params.toString()}`
  }

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  // Show max 5 page numbers around current page
  const visiblePages = pages.filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1
  )

  return (
    <div className="flex items-center justify-center gap-1">
      <Button
        variant="outline"
        size="icon-sm"
        asChild
        disabled={currentPage === 1}
      >
        <Link href={buildUrl(currentPage - 1)}>
          <CaretLeft size={14} />
        </Link>
      </Button>

      {visiblePages.map((page, i) => {
        const prev = visiblePages[i - 1]
        const showEllipsis = prev && page - prev > 1

        return (
          <span key={page} className="flex items-center gap-1">
            {showEllipsis && (
              <span className="text-muted-foreground px-1 text-xs">...</span>
            )}
            <Button
              variant={page === currentPage ? 'default' : 'outline'}
              size="icon-sm"
              asChild
            >
              <Link href={buildUrl(page)}>{page}</Link>
            </Button>
          </span>
        )
      })}

      <Button
        variant="outline"
        size="icon-sm"
        asChild
        disabled={currentPage === totalPages}
      >
        <Link href={buildUrl(currentPage + 1)}>
          <CaretRight size={14} />
        </Link>
      </Button>
    </div>
  )
}
