import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'bg-primary': 'var(--bg-primary)',
        'bg-surface': 'var(--bg-surface)',
        'bg-card': 'var(--bg-card)',
        'accent-green': 'var(--accent-green)',
        'accent-dim': 'var(--accent-dim)',
        'accent-olive': 'var(--accent-olive)',
        'accent-blue': 'var(--accent-blue)',
        'accent-purple': 'var(--accent-purple)',
        danger: 'var(--danger)',
        'text-primary': 'var(--text-primary)',
        'text-muted': 'var(--text-muted)',
        'text-dim': 'var(--text-dim)',
      },
      borderRadius: {
        card: 'var(--radius-card)',
        btn: 'var(--radius-btn)',
      },
      fontFamily: {
        display: ['var(--font-barlow)', 'sans-serif'],
        body: ['var(--font-dm-sans)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
