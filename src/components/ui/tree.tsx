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
import { useRef } from 'react'
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
  const contextRef = useRef(null)
  return (
    <div ref={contextRef}>
      <DndProvider
        backend={MultiBackend}
        options={getBackendOptions()}
        context={contextRef.current}
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
    </div>
  )
}
