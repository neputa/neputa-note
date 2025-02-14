import { describe, it, expect } from 'vitest'
import { mdxToHtml } from '../src/utils/mdxUtils'

// テスト用のMDXコンテンツ
const mdxContent = `
import TestComponent from '@/components/TestComponent'
import { TestFunction } from 'test-module'

# Test Heading

Some content here.

\`\`\`typescript
import { someFunction } from 'some-module'
const a = someFunction();
\`\`\`

\`\`\`html
<div>
  some contents
</div>
\`\`\`

<Youtube id='xxxxxxx' />
More content here.

> this is a blockquote<cite>-- 本書より引用</cite>

<div class='not-prose'>
	<div data-vc_mylinkbox_id='886764731'></div>
</div>
`

describe('MDX Utils Tests', () => {
  it('removeInitialImports関数のテスト', async () => {
    const cleanedMdxContent = await mdxToHtml(mdxContent)
    const result = mdxContent !== cleanedMdxContent
    expect(result).toBe(true)
  })
})
