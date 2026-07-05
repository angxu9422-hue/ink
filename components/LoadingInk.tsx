'use client'

import { motion, AnimatePresence } from 'framer-motion'

type InkStage = 'ink' | 'brush' | 'seal'

interface LoadingInkProps {
  stage?: InkStage
  stageText?: string
}

/** 在外部组件内使用，作为全屏覆盖层 */
export default function FullScreenLoading({ stage = 'ink', stageText }: LoadingInkProps) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink-paper/95">
      <InkAnimation stage={stage} />
      <motion.p
        key={stage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 text-ink-gray/70 text-sm"
        style={{ fontFamily: 'Georgia, SimSun, serif' }}
      >
        {stageText || stageLabel(stage)}
      </motion.p>
    </div>
  )
}

/** 嵌入式加载动画，不含全屏覆盖 */
export function InkAnimation({ stage, size = 'lg' }: { stage?: InkStage; size?: 'sm' | 'lg' }) {
  const dim = size === 'sm' ? 'w-12 h-12' : 'w-48 h-48'
  const innerDim = size === 'sm' ? 'w-8 h-8' : 'w-16 h-16'

  return (
    <div className={`relative ${dim} mx-auto`}>
      <AnimatePresence mode="wait">
        {stage === 'ink' && <InkGrinding key="ink" />}
        {stage === 'brush' && <BrushWriting key="brush" />}
        {stage === 'seal' && <SealStamping key="seal" />}
      </AnimatePresence>
    </div>
  )
}

function InkGrinding() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 墨滴扩散 */}
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-ink-black"
          initial={{ width: 8, height: 8, opacity: 0.3 }}
          animate={{
            width: [8, 180, 8],
            height: [8, 180, 8],
            opacity: [0.3, 0.05, 0.3],
          }}
          transition={{
            duration: 2.4,
            repeat: Infinity,
            delay: i * 0.8,
            ease: 'easeInOut',
          }}
        />
      ))}
      {/* 墨砚 */}
      <div
        className="relative w-20 h-20 rounded-full border-2 border-ink-black/20 flex items-center justify-center"
      >
        <div className="w-3 h-3 rounded-full bg-ink-black animate-pulse" />
      </div>
    </motion.div>
  )
}

function BrushWriting() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 毛笔笔触 */}
      <motion.div
        className="w-1.5 bg-ink-black rounded-full"
        initial={{ height: 0 }}
        animate={{ height: [0, 160, 0] }}
        transition={{
          duration: 1.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ originY: 0 }}
      />
      {/* 墨点飞溅 */}
      {[0, 60, 120].map((angle) => (
        <motion.div
          key={angle}
          className="absolute w-2 h-2 rounded-full bg-ink-black/30"
          initial={{ opacity: 0, x: 0, y: 0 }}
          animate={{
            opacity: [0, 0.6, 0],
            x: [0, Math.cos((angle * Math.PI) / 180) * 40],
            y: [0, Math.sin((angle * Math.PI) / 180) * 40 + 60],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: angle / 120,
            ease: 'easeOut',
          }}
        />
      ))}
    </motion.div>
  )
}

function SealStamping() {
  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* 印章 */}
      <motion.div
        className="w-16 h-16 bg-ink-red flex items-center justify-center rotate-[-5deg]"
        initial={{ scale: 2, opacity: 0, rotate: -15 }}
        animate={{ scale: 1, opacity: 1, rotate: -5 }}
        transition={{
          type: 'spring',
          stiffness: 200,
          damping: 12,
        }}
      >
        <span className="text-white dark:text-ink-bg text-xs font-bold" style={{ fontFamily: 'Georgia, serif' }}>
          印
        </span>
      </motion.div>
      {/* 震感波纹 */}
      <motion.div
        className="absolute w-24 h-24 rounded-full border border-ink-red/20"
        initial={{ scale: 0.6, opacity: 0.5 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'easeOut' }}
      />
    </motion.div>
  )
}

function stageLabel(stage: InkStage): string {
  switch (stage) {
    case 'ink': return '研墨中...'
    case 'brush': return '挥毫间...'
    case 'seal': return '待落款...'
    default: return ''
  }
}
