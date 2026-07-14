'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'

export default function LanguageSwitcher() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()

  function switchLanguage(locale: string) {
    startTransition(() => {
      document.cookie = `locale=${locale};path=/;max-age=31536000`
      router.refresh()
    })
  }

  return (
    <div className="flex items-center gap-1 rounded-md border p-0.5 text-xs">
      <button
        onClick={() => switchLanguage('en')}
        disabled={isPending}
        className="hover:bg-muted rounded px-2 py-1 font-medium transition-colors"
      >
        EN
      </button>
      <button
        onClick={() => switchLanguage('ar')}
        disabled={isPending}
        className="hover:bg-muted rounded px-2 py-1 font-medium transition-colors"
      >
        عر
      </button>
    </div>
  )
}
