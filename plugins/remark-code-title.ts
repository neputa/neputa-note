import type { Code, Paragraph } from 'mdast'
import type { Plugin } from 'unified'
import type { Node } from 'unist'
import { visit, type Visitor } from 'unist-util-visit'

const remarkCodeBlock: Plugin = () => {
  return (tree: Node) => {
    const visitor: Visitor<Code> = (node, index, parent) => {
      if (!parent || index === undefined) {
        return
      }

      const { lang, meta, value } = node
      const title = meta

      parent.children.splice(index, 1, {
        type: 'paragraph',
        data: {
          hName: 'code-block',
          hProperties: {
            // Workaround for preventing loss of line breaks in code blocks.
            // Need to decode the value in the code block component.
            code: encodeURIComponent(value),
            ...(lang ? { lang } : {}),
            ...(title ? { title } : {})
          }
        },
        children: []
      } as Paragraph)
    }
    visit(tree, 'code', visitor)
  }
}

export default remarkCodeBlock
