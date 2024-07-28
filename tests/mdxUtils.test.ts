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

// テスト実行
test('removeInitialImports関数のテスト', async () => {
  console.log('# Original:\n', mdxContent)
  const cleanedMdxContent = await mdxToHtml(mdxContent)
  console.log('# Cleaned:\n', cleanedMdxContent)
  const result = mdxContent !== cleanedMdxContent
  expect(result).toBe(true)
})
