import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { getDocumentHeadings } from '../link/get-document-headings'
import { slugifyHeadings } from '../link/slug'

/**
 * Stamps each heading's GFM slug onto its rendered DOM element as an `id`
 * attribute, purely for `scrollIntoView` targeting (same-document Heading
 * Anchor clicks, and post-navigation scroll for a Note+Anchor link). Never
 * persisted into the Note's saved markdown (ADR-0011) — this is
 * presentation-only, recomputed from heading text on every render.
 */
export const HeadingAnchors = Extension.create({
  name: 'headingAnchors',

  addProseMirrorPlugins() {
    return [
      new Plugin({
        key: new PluginKey('headingAnchors'),
        props: {
          decorations(state) {
            const headings = getDocumentHeadings(state.doc)
            const slugs = slugifyHeadings(headings.map((h) => h.text))

            return DecorationSet.create(
              state.doc,
              headings.map((heading, index) =>
                Decoration.node(heading.pos, heading.pos + heading.nodeSize, {
                  id: slugs[index],
                }),
              ),
            )
          },
        },
      }),
    ]
  },
})
