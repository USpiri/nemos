import { Skeleton } from '@/components/ui/skeleton'

export const WorkspacePending = () => {
  return (
    <div className="mx-auto flex h-full w-full max-w-4xl flex-col gap-6 px-8 py-16">
      <div className="flex items-center gap-3">
        <Skeleton className="size-10 rounded-lg" />
        <div className="space-y-1">
          <Skeleton className="h-7 w-52" />
          <Skeleton className="h-4 w-36" />
        </div>
      </div>
      <div className="flex flex-row gap-2">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-8 w-24" />
      </div>
    </div>
  )
}
