/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'accent1': 'var(--primary)',
        'accent2': 'var(--secondary)',
        'accent3': 'var(--tertiary)',
        'accent4': 'var(--quaternary)',
        'main': 'var(--text-primary)',
        'sub': 'var(--text-secondary)',
        'inverse': 'var(--text-inverse)',
        'background': 'var(--background)',
        'background-secondary': 'var(--background-secondary)',
        'foreground': 'var(--foreground)',
        'foreground-secondary': 'var(--foreground-secondary)',
        'gray0': 'var(--gray-0)',
        'gray1': 'var(--gray-1)',
        'gray2': 'var(--gray-2)',
        'gray3': 'var(--gray-3)',
        'gray4': 'var(--gray-4)',
        'gray5': 'var(--gray-5)',
        'gray6': 'var(--gray-6)',
        'gray7': 'var(--gray-7)',
        'gray8': 'var(--gray-8)',
        'gray9': 'var(--gray-9)',
        'edge': 'var(--edge)',
        'normal': 'var(--normal)',
        'warning': 'var(--warning)',
        'error': 'var(--error)',
      },
    },
  },
  plugins: [],
};

