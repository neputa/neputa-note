/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  modulePaths: ['./'],
  transform: {
    '^.+\\.ts?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: 'tsconfig.test.json'
      }
    ]
  }
}
