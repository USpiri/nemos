import { Extension } from '@tiptap/react'
import { createTableHandlePlugin, TableHandleState } from './handle-plugin'

declare module '@tiptap/react' {
  interface EditorEvents {
    tableHandleState: TableHandleState
  }
}

/**
 * Tracks mouse position over a Table to reveal its Row/Column handles.
 * Deliberately separate from the Table node's own view — how a table
 * renders and how its handles are shown stay independent.
 */
export const TableHandle = Extension.create({
  name: 'tableHandle',

  addProseMirrorPlugins() {
    const { editor } = this

    return [
      createTableHandlePlugin(editor, state => {
        editor.emit('tableHandleState', state)
      }),
    ]
  },
})
