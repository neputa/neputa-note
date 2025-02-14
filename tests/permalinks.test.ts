import { describe, it, expect } from 'vitest'
import { getPermalink, htmlEscape } from '../src/utils/permalinks'

describe('Permalinks Utils Tests', () => {
  it('getPermalink正常系テスト', () => {
    const testCases = ['/example', 'example', '/example/', 'example/']

    testCases.forEach((testCase) => {
      const result = getPermalink(testCase)
      expect(result.slice(-2)).toBe('e/')
    })
  })

  it('htmlEscape正常系テスト', () => {
    const testCase = '&<>"\''
    const result = htmlEscape(testCase)
    expect(result).toBe('&amp;&lt;&gt;&quot;&#039;')
  })
})
