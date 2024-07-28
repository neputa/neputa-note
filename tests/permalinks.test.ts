import { getPermalink, htmlEscape } from '../src/utils/permalinks'

test('getPermalink正常系テスト', () => {
  const testCases = ['/example', 'example', '/example/', 'example/']

  testCases.forEach((testCase) => {
    const result = getPermalink(testCase)
    console.log(`${testCase} -> ${result}`)
    expect(result.slice(-2)).toBe('e/')
  })
})

test('htmlEscape正常系テスト', () => {
  const testCase = '&<>"\''
  const result = htmlEscape(testCase)

  console.log(`${testCase} -> ${result}`)
  expect(result).toBe('&amp;&lt;&gt;&quot;&#039;')
})
