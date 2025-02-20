module.exports = {
  // ...existing code...
  plugins: [
    // ...existing code...
    'markdown'
  ],
  overrides: [
    {
      files: ['**/*.md'],
      processor: 'markdown/markdown'
    }
    // ...existing code...
  ]
  // ...existing code...
}
