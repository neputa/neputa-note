import defaultTheme from 'tailwindcss/defaultTheme'
import typographyPlugin from '@tailwindcss/typography'

module.exports = {
  content: ['./src/**/*.{astro,html,tsx}'],
  theme: {
    extend: {
      colors: {
        white: '#F4F4F4',
        black: '#181818',
        primary: {
          400: '#aab7f3',
          500: '#5f75d6',
          600: '#2541b1',
          700: '#1c3290',
          900: '#14236d'
        },
        secondary: '#BCABAE',
        tertiary: '#393C3C',
        github: '#1E1E1E'
      },
      fontFamily: {
        body: [
          ...defaultTheme.fontFamily.sans,
          'Roboto',
          'Yu Gothic',
          'YuGothic',
          'ヒラギノ角ゴシックPro',
          'HiraginoKakuGothicPro',
          'メイリオ',
          'Meiryo',
          'Osaka',
          'ＭＳＰゴシック'
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
  plugins: [typographyPlugin],
  darkMode: 'class'
}
