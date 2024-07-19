import { getPermalink } from '@/utils'

const testCases = ['/example', 'example', '/example/', 'example/']

testCases.forEach((testCase) => {
  console.log(`${testCase} -> ${getPermalink(testCase)}`)
})
