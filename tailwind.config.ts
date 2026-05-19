import type { Config } from 'tailwindcss';

/**
 * Tailwind configuration. The colours and fonts here are thin aliases over the
 * CSS custom properties defined in app/globals.css, so the source of truth for
 * the design tokens stays in one place.
 */
const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-geist)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'ui-monospace', 'monospace']
      },
      colors: {
        bg: 'var(--bg)',
        'bg-elevated-1': 'var(--bg-elevated-1)',
        'bg-elevated-2': 'var(--bg-elevated-2)',
        'bg-elevated-3': 'var(--bg-elevated-3)',
        accent: 'var(--accent)'
      },
      boxShadow: {
        sm: 'var(--shadow-sm)',
        md: 'var(--shadow-md)',
        lg: 'var(--shadow-lg)',
        xl: 'var(--shadow-xl)'
      },
      transitionTimingFunction: {
        'out-expo': 'var(--ease-out-expo)'
      }
    }
  },
  plugins: []
};

export default config;
