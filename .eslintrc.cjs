/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ['plugin:astro/recommended'],
  plugins: ['markdown'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    tsconfigRootDir: __dirname,
    sourceType: 'module',
    ecmaVersion: 'latest'
  },
  overrides: [
    {
      files: ['*.astro', '**/*.mdx/*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro']
      },
      rules: {
        // override/add rules settings here, such as:
        'astro/no-set-html-directive': 'error',
        'tailwindcss/classnames-order': 'error'
      },
      plugins: ['tailwindcss']
    },
    {
      files: ['*.mdx'],
      extends: 'plugin:mdx/recommended'
    },
    {
      files: ['**/*.md'],
      processor: 'markdown/markdown'
    },
    {
      // 1. Target ```js code blocks in .md files.
      files: ['**/*.md/*.js'],
      rules: {
        // 2. Disable other rules.
        'no-console': 'off',
        'import/no-unresolved': 'off'
      }
    }
  ],
  settings: {
    'mdx/code-blocks': true,
    'mdx/language-mapper': {},
    'mdx/remark': true
  }
}
