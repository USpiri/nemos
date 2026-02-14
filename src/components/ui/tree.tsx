import {
  Classes,
  DropOptions,
  getBackendOptions,
  MultiBackend,
  NodeModel,
  NodeRender,
  PlaceholderRender,
  Tree as TreeView,
} from '@minoru/react-dnd-treeview'
import { useCallback, useState } from 'react'
import { DndProvider } from 'react-dnd'

interface TreeProps {
  tree: NodeModel[]
  rootId: string
  onDrop: (tree: NodeModel<unknown>[], options: DropOptions<unknown>) => void
  render: NodeRender<unknown>
  placeholderRender: PlaceholderRender<unknown>
  classes?: Classes
}

export const Tree = ({
  tree,
  rootId,
  onDrop,
  render,
  classes,
  placeholderRender,
}: TreeProps) => {
  const [contextElement, setContextElement] = useState<HTMLDivElement | null>(
    null,
  )
  const contextRef = useCallback(
    (node: HTMLDivElement | null) => setContextElement(node),
    [],
  )

  return (
    <div ref={contextRef}>
      {contextElement && (
        <DndProvider
          backend={MultiBackend}
          options={getBackendOptions()}
          context={contextElement}
        >
          <TreeView
            tree={tree}
            rootId={rootId}
            render={render}
            onDrop={onDrop}
            classes={classes}
            dropTargetOffset={5}
            placeholderRender={placeholderRender}
          />
        </DndProvider>
      )}
    </div>
  )
}
