import { MarkViewContent, type MarkViewProps } from '@tiptap/react'

export const LinkView = ({ mark }: MarkViewProps) => {
  const { href, target, rel, class: className, title } = mark.attrs

  return (
    <MarkViewContent
      as="a"
      href={href}
      target={target ?? undefined}
      rel={rel ?? undefined}
      title={title ?? undefined}
      className={className ?? undefined}
    />
  )
}
