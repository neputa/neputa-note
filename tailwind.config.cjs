import { nodeModuleNameResolver } from 'typescript'

/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{astro,html,js,md,mdx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#F4F4F4',
        black: '#181818',
        primary: {
          400: '#FFB8B4',
          500: '#EE8A85',
          600: '#D05A54',
          700: '#BD3A34',
          900: '#A1241D'
        },
        secondary: '#BCABAE',
        tertiary: '#393C3C',
        github: '#1E1E1E'
      },
      fontFamily: {
        body: [
          'Avenir',
          'Helvetica Neue',
          'Helvetica',
          'Arial',
          'Hiragino Sans',
          'ヒラギノ角ゴシック',
          'YuGothic',
          'Yu Gothic',
          'メイリオ',
          'Meiryo',
          'ＭＳ Ｐゴシック',
          'MS PGothic',
          'sans-serif'
        ]
      },
      fontSize: {
        xxs: ['10px', { lineHeight: '.5rem' }]
      },
      gridTemplateColumns: {
        list: 'repeat(auto-fill, minmax(400px, max-content))'
      },
      listStyleType: {
        square: 'square'
      },
      typography: {
        quoteless: {
          css: {
            blockquote: { quotes: 'none' }
          }
        },
        DEFAULT: {
          css: {}
        }
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}
