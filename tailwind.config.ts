import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        verde: {
          DEFAULT: '#1B3A28',
          claro:   '#2D6A4A',
          suave:   '#4A7C59',
          fondo:   '#E8EDE9',
        },
        crema: {
          DEFAULT: '#F5F1EB',
          oscuro:  '#EAE4DC',
        },
        dorado: '#C8972C',
      },
      fontFamily: {
        sans: ['system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config
