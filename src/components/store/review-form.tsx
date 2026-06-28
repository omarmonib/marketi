'use client'

import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createReview } from '@/actions/reviews'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import StarRating from '@/components/shared/star-rating'

const FormSchema = z.object({
  rating: z.number().min(1, 'Please select a rating'),
  title: z.string().min(3, 'Title must be at least 3 characters'),
  body: z.string().min(10, 'Review must be at least 10 characters'),
})

type FormValues = z.infer<typeof FormSchema>

export default function ReviewForm({ productId }: { productId: string }) {
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: { rating: 0, title: '', body: '' },
  })

  function onSubmit(values: FormValues) {
    setError(null)
    setSuccess(null)
    startTransition(async () => {
      const result = await createReview(productId, values)
      if (result?.error) setError(result.error)
      if (result?.success) {
        setSuccess(result.success)
        form.reset()
      }
    })
  }

  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="mb-4 font-bold">Write a Review</h3>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rating</FormLabel>
                <FormControl>
                  <StarRating value={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Great product!" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Review</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Share your experience..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {error && <p className="text-destructive text-sm">{error}</p>}
          {success && <p className="text-sm text-green-600">{success}</p>}

          <Button type="submit" disabled={isPending}>
            {isPending ? 'Submitting...' : 'Submit Review'}
          </Button>
        </form>
      </Form>
    </div>
  )
}
