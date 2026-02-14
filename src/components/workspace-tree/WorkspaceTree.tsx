import { DropOptions, NodeModel } from '@minoru/react-dnd-treeview'
import { useParams } from '@tanstack/react-router'
import { ChevronDown, ChevronRight, FileText } from 'lucide-react'
import { FILE_EXTENSION } from '@/config/constants'
import { useWorkspaceActions } from '@/hooks/use-workspace-actions'
import { getNoteIdFromPath } from '@/lib/notes'
import { EditableFilename } from '../EditableFilename'
import { Tree } from '../ui/tree'
import { DropTargetPlaceholder } from './DropTargetPlaceholder'
import { TreeContextMenu } from './TreeContextMenu'
import { TreeNode } from './TreeNode'

interface Props {
  tree: NodeModel[]
  root: string
  workspace: string
}

export const WorkspaceTree = ({ tree, root, workspace }: Props) => {
  const { noteId: currentNoteId } = useParams({ strict: false })
  const { moveNote, moveFolder, refreshWorkspace, navigateToNote } =
    useWorkspaceActions({ workspace })

  const handleDrop = async (
    _tree: NodeModel[],
    options: DropOptions<unknown>,
  ) => {
    const { dragSource, dropTargetId } = options
    if (!dragSource) return

    const sourceId = getNoteIdFromPath(dragSource.id.toString())
    const targetId = dropTargetId
      ? getNoteIdFromPath(dropTargetId.toString())
      : ''

    if (dragSource.droppable) {
      const newFolderId = await moveFolder(sourceId, targetId)
      refreshWorkspace()
      if (newFolderId && currentNoteId?.startsWith(`${sourceId}/`)) {
        const updatedNoteId = currentNoteId.replace(sourceId, newFolderId)
        navigateToNote(updatedNoteId)
      }
    } else {
      const newNoteId = await moveNote(sourceId, targetId)
      refreshWorkspace()
      if (newNoteId && currentNoteId === sourceId) {
        navigateToNote(newNoteId)
      }
    }
  }

  return (
    <TreeContextMenu workspace={workspace}>
      <Tree
        tree={tree}
        rootId={`${root}/${workspace}`}
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
            workspace={workspace}
            note={getNoteIdFromPath(node.id.toString())}
            onToggle={onToggle}
          >
            {node.droppable ? (
              <>{isOpen ? <ChevronDown /> : <ChevronRight />}</>
            ) : (
              <FileText />
            )}
            <EditableFilename
              display={node.text.replace(FILE_EXTENSION, '')}
              path={node.id.toString()}
              suffix={node.droppable ? undefined : FILE_EXTENSION}
              className="p-0"
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
