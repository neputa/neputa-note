import sanitizeHtml from 'sanitize-html'
import MarkdownIt from 'markdown-it'
const parser = new MarkdownIt({ html: true })

/* Sanitize Options
 * imgタグとalt属性、aタグのhrf属性を有効
 */
const sanitizeOptions = {
  allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']),
  allowedAttributes: {
    ...sanitizeHtml.defaults.allowedAttributes,
    img: ['alt'],
    a: ['href']
  }
}

/**
 * Description:
 * MDX本文テキストをHTMLに変換する
 * markdownパース、htmlのsanitizeを行う
 * @param {string} mdxContent
 * @returns {string}
 */
export function mdxToHtml(mdxContent: string): string {
  // import文を削除
  const importRemoved = removeInitialImports(mdxContent)

  // 1. componentをターゲットにsanitizeHtml
  // 2. 残ったHTMLパース済みのタグをreplaceで戻す
  // 3. textlintのignore文をreplaceで削除
  const initialSanitizedHtml = sanitizeHtml(importRemoved.toString(), sanitizeOptions)
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replaceAll('{/* textlint-disable */}', '')

  // HTMLへ変換
  const htmlContent = parser.render(initialSanitizedHtml)

  // 最終的なsanitize処理
  return sanitizeHtml(htmlContent, sanitizeOptions)
}

/**
 * Description MDX本文テキストの最初（frontmatter直後）のimport文を削除する
 * @param {string} content - MDX本文テキスト
 * @returns {string}
 */
export function removeInitialImports(content: string): string {
  const lines = content.split('\n')

  // 2行目がimport文でない場合、処理を行わない
  if (!lines[1].trim().startsWith('import')) {
    console.log('No imports to remove.')
    return content
  }

  let i = 1
  while (i < lines.length) {
    const line = lines[i].trim()

    // import文ではない行が現れたらbreak
    if (line.startsWith('import')) {
      lines.splice(i, 1)
    } else {
      break
    }
  }

  // 改行文字で再結合
  const modifiedContent = lines.join('\n')

  return modifiedContent
}
