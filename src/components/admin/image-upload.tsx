'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CloudArrowUp, X, SpinnerGap } from '@phosphor-icons/react'

type Props = {
  value: string
  onChange: (url: string) => void
}

export default function ImageUpload({ value, onChange }: Props) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  async function handleFile(file: File) {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be under 5MB')
      return
    }

    setError(null)
    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error ?? 'Upload failed')
        return
      }

      onChange(data.url)
    } catch {
      setError('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-3">
      {value ? (
        <div className="relative w-full max-w-sm">
          <div className="bg-muted relative aspect-square overflow-hidden rounded-lg border">
            <Image
              src={value}
              alt="Product image"
              fill
              className="object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            className="absolute -top-2 -right-2"
            onClick={() => onChange('')}
          >
            <X size={14} />
          </Button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => inputRef.current?.click()}
          className="border-input hover:border-ring flex aspect-square w-full max-w-sm cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed transition-colors"
        >
          {uploading ? (
            <>
              <SpinnerGap
                size={32}
                className="text-muted-foreground animate-spin"
              />
              <p className="text-muted-foreground text-sm">Uploading...</p>
            </>
          ) : (
            <>
              <CloudArrowUp size={32} className="text-muted-foreground" />
              <div className="text-center">
                <p className="text-sm font-medium">Click or drag to upload</p>
                <p className="text-muted-foreground text-xs">
                  PNG, JPG, WEBP up to 5MB
                </p>
              </div>
            </>
          )}
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
        }}
      />

      {/* Keep manual URL input as fallback */}
      <div className="space-y-1">
        <p className="text-muted-foreground text-xs">Or paste an image URL</p>
        <Input
          placeholder="https://images.unsplash.com/..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>

      {error && <p className="text-destructive text-xs">{error}</p>}
    </div>
  )
}
