import { Sparkles } from 'lucide-react'
import { H1, P } from '@/components/ui/typography'

type Props = {
  rootName: string
  count: number
}

export const RootHeader = ({ rootName, count }: Props) => {
  return (
    <header className="flex items-center gap-3">
      <div className="bg-primary/10 flex size-10 items-center justify-center rounded-lg">
        <Sparkles className="text-primary size-5" />
      </div>
      <div>
        <H1 size="sm">{rootName}</H1>
        <P variant="muted" size="sm" className="not-first:mt-0">
          {count === 0
            ? 'No notes yet'
            : `${count} ${count === 1 ? 'note' : 'notes'} created`}
        </P>
      </div>
    </header>
  )
}
