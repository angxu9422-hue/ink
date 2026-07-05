'use client'

import { motion } from 'framer-motion'

export type LayoutMode = 'vertical' | 'horizontal'

interface CalligraphyTextProps {
  lines: string[]
  layout?: LayoutMode
  onCharClick?: (lineIdx: number, charIdx: number) => void
}

/* ============================================================
   竖排布局 — 自上而下，列从左到右
   ============================================================ */
function VerticalLayout({ lines, onCharClick }: Omit<CalligraphyTextProps, 'layout'>) {
  return (
    <div className="relative flex flex-row justify-center gap-3 md:gap-5">
      {/* 墨雾光晕背景 */}
      <div className="absolute inset-0 -z-0 pointer-events-none opacity-30
                      bg-[radial-gradient(ellipse_at_center,rgba(43,43,43,0.04)_0%,transparent_65%)]
                      dark:bg-[radial-gradient(ellipse_at_center,rgba(212,184,122,0.05)_0%,transparent_65%)]" />

      {lines.map((line, lineIdx) => (
        <div key={lineIdx} className="relative z-[1] flex flex-col items-center">
          {line.split('').map((char, charIdx) => (
            <motion.span
              key={`v-${lineIdx}-${charIdx}`}
              initial={{ opacity: 0, y: 14, filter: 'blur(2.5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                delay: (lineIdx * (line.length || 5) + charIdx) * 0.1,
                duration: 0.5,
                ease: [0.22, 0.08, 0.22, 1],
              }}
              className="calligraphy-char text-2xl sm:text-3xl md:text-4xl lg:text-5xl
                         hover:text-ink-red transition-colors cursor-pointer py-0.5
                         select-none"
              onClick={() => onCharClick?.(lineIdx, charIdx)}
              style={{ fontFamily: 'Georgia, SimSun, serif' }}
            >
              {char}
            </motion.span>
          ))}
        </div>
      ))}
    </div>
  )
}

/* ============================================================
   横排布局 — 从左到右逐行
   ============================================================ */
function HorizontalLayout({ lines, onCharClick }: Omit<CalligraphyTextProps, 'layout'>) {
  return (
    <div className="flex flex-col items-center gap-4 md:gap-6">
      {lines.map((line, lineIdx) => (
        <motion.div
          key={`h-${lineIdx}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: lineIdx * 0.15, duration: 0.5, ease: 'easeOut' }}
          className="flex justify-center gap-1.5 md:gap-2 flex-wrap"
        >
          {line.split('').map((char, charIdx) => (
            <motion.span
              key={`h-${lineIdx}-${charIdx}`}
              initial={{ opacity: 0, y: 8, filter: 'blur(1.5px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                delay: lineIdx * 0.15 + charIdx * 0.04,
                duration: 0.4,
                ease: 'easeOut',
              }}
              className="calligraphy-char text-2xl sm:text-3xl md:text-4xl lg:text-5xl
                         hover:text-ink-red transition-colors cursor-pointer select-none"
              onClick={() => onCharClick?.(lineIdx, charIdx)}
              style={{ fontFamily: 'Georgia, SimSun, serif' }}
            >
              {char}
            </motion.span>
          ))}
        </motion.div>
      ))}
    </div>
  )
}

export default function CalligraphyText({ lines, layout = 'vertical', onCharClick }: CalligraphyTextProps) {
  if (layout === 'horizontal') {
    return <HorizontalLayout lines={lines} onCharClick={onCharClick} />
  }
  return <VerticalLayout lines={lines} onCharClick={onCharClick} />
}
