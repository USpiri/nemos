import { Skeleton } from '@/components/ui/skeleton'

export const NotePending = () => {
  return (
    <main className="mx-auto w-full max-w-3xl px-10 py-32">
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </main>
  )
}
