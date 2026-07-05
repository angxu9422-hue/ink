'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '@/lib/theme'

export function ThemeToggle() {
  const { theme, toggle } = useTheme()

  return (
    <button
      onClick={toggle}
      className="theme-toggle-btn fixed top-4 right-4 z-50 w-10 h-10 rounded-full
                 bg-ink-card border border-ink-input-border
                 flex items-center justify-center backdrop-blur-sm"
      title={theme === 'dark' ? '切换宣纸模式' : '切换夜墨模式'}
    >
      <AnimatePresence mode="wait">
        {theme === 'dark' ? (
          <motion.span
            key="moon"
            initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="text-base select-none"
          >
            🌙
          </motion.span>
        ) : (
          <motion.span
            key="sun"
            initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
            animate={{ rotate: 0, opacity: 1, scale: 1 }}
            exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="text-base select-none"
          >
            ☀️
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  )
}
