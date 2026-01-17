import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { Mermaid } from '../mermaid'
import { Smiles } from '../smiles'
import { CodeBlock as CodeBlockComponent } from './CodeBlock'
import lowlight from './lowlight'

export const CodeBlock = CodeBlockLowlight.configure({
  lowlight,
  defaultLanguage: 'plaintext',
}).extend({
  addNodeView() {
    return (props) => {
      const { node } = props
      const language = node.attrs.language

      switch (language) {
        case 'mermaid':
          return ReactNodeViewRenderer(Mermaid, {
            contentDOMElementTag: 'code',
          })(props)
        case 'smiles':
          return ReactNodeViewRenderer(Smiles, {
            contentDOMElementTag: 'code',
          })(props)
        default:
          return ReactNodeViewRenderer(CodeBlockComponent, {
            contentDOMElementTag: 'code',
          })(props)
      }
    }
  },
})
