'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { InkAnimation, type InkStage } from '@/components/LoadingInk'

interface StreamingPoemProps {
  theme: string
  poemType: string
  categoryTags: { genre: string[]; emotion: string[]; style: string[] }
  onComplete: (poemData: Record<string, unknown>) => void
  onError: (error: string) => void
}

export default function StreamingPoem({ theme, poemType, categoryTags, onComplete, onError }: StreamingPoemProps) {
  const [stage, setStage] = useState<InkStage>('ink')
  const [stageText, setStageText] = useState('研墨中...')

  const startSSE = useCallback(() => {
    const controller = new AbortController()

    fetch('/api/poem/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme, poemType, categoryTags }),
      signal: controller.signal,
    }).then(async (response) => {
      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        onError(data.error || '研墨失败')
        return
      }

      const reader = response.body?.getReader()
      if (!reader) {
        onError('无法建立流式连接')
        return
      }

      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        const parts = buffer.split('\n\n')
        buffer = parts.pop() || ''

        for (const part of parts) {
          const eventLines = part.split('\n')
          let eventType = ''
          let dataStr = ''

          for (const line of eventLines) {
            if (line.startsWith('event: ')) {
              eventType = line.slice(7).trim()
            } else if (line.startsWith('data: ')) {
              dataStr = line.slice(6).trim()
            }
          }

          if (!dataStr) continue

          try {
            const data = JSON.parse(dataStr)

            switch (eventType) {
              case 'stage':
                setStage(data.stage)
                setStageText(data.text)
                break

              case 'done':
                onComplete(data)
                return

              case 'error':
                onError(data.error || '研墨失败')
                return
            }
          } catch {
            // 忽略解析错误
          }
        }
      }
    }).catch((err) => {
      if (err.name !== 'AbortError') {
        onError(err.message || '连接中断')
      }
    })

    return controller
  }, [theme, poemType, categoryTags, onComplete, onError])

  useEffect(() => {
    const ctrl = startSSE()
    return () => { ctrl?.abort() }
  }, [startSSE])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-ink-paper/95">
      <div className="relative w-64 h-48 flex items-center justify-center">
        <InkAnimation stage={stage} size="lg" />
      </div>

      <motion.p
        key={stage}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 text-ink-gray/70 text-sm"
        style={{ fontFamily: 'Georgia, SimSun, serif' }}
      >
        {stageText}
      </motion.p>
    </div>
  )
}
