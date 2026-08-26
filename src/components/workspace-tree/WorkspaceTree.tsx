import { DropOptions, NodeModel } from '@minoru/react-dnd-treeview'
import { useParams } from '@tanstack/react-router'
import { ChevronDown, ChevronRight, FileText } from 'lucide-react'
import { EXTENSION } from '@/config/constants'
import { useRootActions } from '@/hooks/use-root-actions'
import { getBaseName, toRelativePath } from '@/lib/paths'
import { EditableFilename } from '../EditableFilename'
import { Tree } from '../ui/tree'
import { DropTargetPlaceholder } from './DropTargetPlaceholder'
import { TreeContextMenu } from './TreeContextMenu'
import { TreeNode } from './TreeNode'

interface Props {
  tree: NodeModel[]
  rootPath: string
}

export const WorkspaceTree = ({ tree, rootPath }: Props) => {
  const { noteId: currentNoteId } = useParams({ strict: false })
  const { moveNote, moveFolder, refreshRoot, navigateToNote } = useRootActions()

  const handleDrop = async (
    _tree: NodeModel[],
    options: DropOptions<unknown>,
  ) => {
    const { dragSource, dropTargetId } = options
    if (!dragSource) return

    const sourceId = toRelativePath(dragSource.id.toString(), rootPath)
    const targetId = dropTargetId
      ? toRelativePath(dropTargetId.toString(), rootPath)
      : ''

    if (dragSource.droppable) {
      const newFolderId = await moveFolder(sourceId, targetId)
      refreshRoot()
      if (newFolderId && currentNoteId?.startsWith(`${sourceId}/`)) {
        const updatedNoteId = currentNoteId.replace(sourceId, newFolderId)
        navigateToNote(updatedNoteId)
      }
    } else {
      const newNoteId = await moveNote(sourceId, targetId)
      refreshRoot()
      if (newNoteId && currentNoteId === sourceId) {
        navigateToNote(newNoteId)
      }
    }
  }

  return (
    <TreeContextMenu>
      <Tree
        tree={tree}
        rootId={rootPath}
        render={(
          node,
          { depth, isOpen, onToggle, isDragging, isDropTarget },
        ) => (
          <TreeNode
            depth={depth}
            isOpen={isOpen}
            isDroppable={!!node.droppable}
            isDragging={isDragging}
            isDropTarget={isDropTarget}
            note={toRelativePath(node.id.toString(), rootPath)}
            onToggle={onToggle}
          >
            {node.droppable ? (
              <>{isOpen ? <ChevronDown /> : <ChevronRight />}</>
            ) : (
              <FileText />
            )}
            <EditableFilename
              display={getBaseName(node.text)}
              path={node.id.toString()}
              suffix={node.droppable ? undefined : `.${EXTENSION}`}
              className="truncate p-0"
              isFolder={!!node.droppable}
            />
          </TreeNode>
        )}
        onDrop={handleDrop}
        placeholderRender={({ text, droppable }, { depth }) => (
          <DropTargetPlaceholder
            text={text}
            droppable={!!droppable}
            depth={depth}
          />
        )}
        classes={{
          container: 'h-full',
        }}
      />
    </TreeContextMenu>
  )
}
