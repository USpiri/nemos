import { DropOptions, NodeModel } from '@minoru/react-dnd-treeview'
import { ChevronDown, ChevronRight, FileText } from 'lucide-react'
import { FILE_EXTENSION } from '@/config/constants'
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
  const handleDrop = (tree: NodeModel[], options: DropOptions<unknown>) => {
    console.log(tree, options)
  }

  return (
    <TreeContextMenu workspace={workspace}>
      <Tree
        tree={tree}
        rootId={`${root}/${workspace}`}
        render={(node, { depth, isOpen, onToggle }) => (
          <TreeNode
            depth={depth}
            isOpen={isOpen}
            isDroppable={!!node.droppable}
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
      />
    </TreeContextMenu>
  )
}
