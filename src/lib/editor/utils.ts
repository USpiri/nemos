import { CSSProperties } from 'react'

export const isInsideNode = (
  from: number,
  to: number,
  pos: number,
  nodeSize: number,
) => from > pos && to < pos + nodeSize + 1

export const isNode = (
  from: number,
  to: number,
  pos: number,
  nodeSize: number,
) => {
  return from === pos && to === pos + nodeSize
}

export const hiddenStyle = {
  opacity: 0,
  overflow: 'hidden',
  position: 'absolute',
  width: '0px',
  height: '0px',
} as CSSProperties
