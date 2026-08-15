import type { Editor } from '@tiptap/react'
import { useEffect, useState } from 'react'
import type { TableHandleState } from './handle-plugin'

/** Subscribes to the table handle plugin's hover state. */
export function useTableHandleState(editor: Editor | null): TableHandleState {
  const [state, setState] = useState<TableHandleState>(null)

  useEffect(() => {
    if (!editor) {
      setState(null)
      return
    }

    editor.on('tableHandleState', setState)
    return () => {
      editor.off('tableHandleState', setState)
    }
  }, [editor])

  return state
}
