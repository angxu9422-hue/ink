'use client'

import { useState, useEffect } from 'react'

interface Allusion {
  word: string
  explanation: string
}

interface Explanation {
  translation: string
  appreciation: string
  allusions: Allusion[]
  imagery: string[]
  emotion: string
}

interface PoemExplanationProps {
  poem: string
  onClose: () => void
}

export default function PoemExplanation({ poem, onClose }: PoemExplanationProps) {
  const [explanation, setExplanation] = useState<Explanation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // 组件加载时获取解读
  useEffect(() => {
    async function fetchExplanation() {
      try {
        const response = await fetch('/api/explain', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ poem }),
        })

        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || '解读失败')
        }

        setExplanation(data)
      } catch (err: any) {
        setError(err.message || '解读失败，请稍后再试')
      } finally {
        setLoading(false)
      }
    }

    fetchExplanation()
  }, [poem])

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-ink-card rounded-xl p-8 max-w-lg w-full mx-4">
          <p className="text-center text-ink-gray">正在解读诗意...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="bg-ink-card rounded-xl p-6 max-w-lg w-full mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-ink-black">诗意解读</h3>
          <button onClick={onClose} className="text-ink-gray hover:text-ink-black text-lg">
            ✕
          </button>
        </div>

        {error ? (
          <p className="text-red-500">{error}</p>
        ) : explanation ? (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm text-ink-gray mb-2">白话译文</h4>
              <p className="text-ink-black leading-relaxed">{explanation.translation}</p>
            </div>

            <div>
              <h4 className="text-sm text-ink-gray mb-2">赏析</h4>
              <p className="text-ink-black leading-relaxed">{explanation.appreciation}</p>
            </div>

            {explanation.allusions && explanation.allusions.length > 0 && (
              <div>
                <h4 className="text-sm text-ink-gray mb-2">典故解读</h4>
                <div className="space-y-2">
                  {explanation.allusions.map((item, idx) => (
                    <div key={idx} className="p-3 bg-ink-paper rounded-lg">
                      <span className="font-medium text-ink-red">{item.word}</span>
                      <span className="ml-2 text-ink-black">{item.explanation}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h4 className="text-sm text-ink-gray mb-2">核心意象</h4>
              <div className="flex flex-wrap gap-2">
                {explanation.imagery.map((item, idx) => (
                  <span key={idx} className="px-3 py-1 bg-ink-paper text-ink-brown rounded-full text-sm">
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-sm text-ink-gray mb-2">情感基调</h4>
              <p className="text-ink-black font-medium">{explanation.emotion}</p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
