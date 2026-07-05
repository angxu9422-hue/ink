/** @type {import('tailwindcss').Config} */
export default {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          /* 向后兼容别名 */
          black: 'var(--ink-body)',
          gray: 'var(--ink-sub)',
          /* 语义化名称 */
          paper: 'var(--ink-paper)',
          title: 'var(--ink-title)',
          body: 'var(--ink-body)',
          sub: 'var(--ink-sub)',
          placeholder: 'var(--ink-placeholder)',
          muted: 'var(--ink-muted)',
          red: 'var(--ink-red)',
          brown: 'var(--ink-brown)',
          bg: 'var(--ink-bg)',
          card: 'var(--ink-card)',
          'card-hover': 'var(--ink-card-hover)',
          overlay: 'var(--ink-overlay)',
          input: 'var(--ink-input)',
          'input-border': 'var(--ink-input-border)',
          'tag-on': 'var(--ink-tag-on)',
          'tag-on-text': 'var(--ink-tag-on-text)',
          'tag-on-ring': 'var(--ink-tag-on-ring)',
          'tag-off': 'var(--ink-tag-off)',
          'tag-off-text': 'var(--ink-tag-off-text)',
          'tag-off-border': 'var(--ink-tag-off-border)',
        },
        gold: 'var(--gold)',
      },
      fontFamily: { serif: ['Georgia', 'SimSun', 'serif'] },
    },
  },
  plugins: [],
}
