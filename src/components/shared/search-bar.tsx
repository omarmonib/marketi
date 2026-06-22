'use client'

import { useState, useRef, useEffect } from 'react'
import { MagnifyingGlass, X } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function SearchBar() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (open) inputRef.current?.focus()
  }, [open])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setOpen(false)
      setQuery('')
    }
  }

  return (
    <div className="relative">
      {open ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products..."
            className="bg-background focus:ring-primary w-48 rounded-md border px-3 py-1.5 text-sm focus:ring-2 focus:outline-none"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => {
              setOpen(false)
              setQuery('')
            }}
          >
            <X size={16} />
          </Button>
        </form>
      ) : (
        <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
          <MagnifyingGlass size={20} />
        </Button>
      )}
    </div>
  )
}
