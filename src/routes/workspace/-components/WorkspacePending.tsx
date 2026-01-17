import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export const WorkspacePending = () => {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 px-10 py-32">
      <div className="max-w-2xl">
        <Skeleton className="mb-6 h-7 w-48" />
        <Skeleton className="mb-3 h-4 w-80" />
        <Skeleton className="h-4 w-40" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 3 }).map((_, index) => (
          <Card key={index} className="h-full">
            <CardHeader>
              <Skeleton className="mb-3 h-5 w-40" />
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardFooter>
              <Skeleton className="h-4 w-28" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
