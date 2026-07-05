'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import TagSelector from '@/components/TagSelector'
import { TAG_CATEGORIES } from '@/lib/tags'
import { getCollection, deletePoem, type SavedPoem } from '@/lib/storage'
import SealStamp from '@/components/SealStamp'

export default function GalleryPage() {
  const [poems, setPoems] = useState<SavedPoem[]>([])
  const [selectedTags, setSelectedTags] = useState<{
    genre: string[]; emotion: string[]; style: string[]
  }>({ genre: [], emotion: [], style: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const collection = getCollection()
    setPoems(collection)
    setLoading(false)
  }, [])

  function toggleTag(categoryKey: string, tag: string) {
    setSelectedTags(prev => {
      const key = categoryKey as keyof typeof prev
      const list = prev[key]
      return {
        ...prev,
        [key]: list.includes(tag)
          ? list.filter(t => t !== tag)
          : [...list, tag]
      }
    })
  }

  // 筛选逻辑：跨分类 AND（诗词须同时满足所有选中分类维度）
  const filteredPoems = useMemo(() => {
    const { genre, emotion, style } = selectedTags
    const hasGenreFilter = genre.length > 0
    const hasEmotionFilter = emotion.length > 0
    const hasStyleFilter = style.length > 0

    if (!hasGenreFilter && !hasEmotionFilter && !hasStyleFilter) {
      return poems
    }

    return poems.filter(poem => {
      const poemTags = poem.categoryTags
      if (!poemTags) return false

      if (hasGenreFilter) {
        const match = poemTags.genre.some(t => genre.includes(t))
        if (!match) return false
      }
      if (hasEmotionFilter) {
        const match = poemTags.emotion.some(t => emotion.includes(t))
        if (!match) return false
      }
      if (hasStyleFilter) {
        const match = poemTags.style.some(t => style.includes(t))
        if (!match) return false
      }
      return true
    })
  }, [poems, selectedTags])

  function handleDelete(id: string) {
    deletePoem(id)
    setPoems(getCollection())
  }

  function clearFilters() {
    setSelectedTags({ genre: [], emotion: [], style: [] })
  }

  if (loading) {
    return (
      <main className="relative min-h-screen rice-paper-bg flex items-center justify-center">
        <p className="text-ink-gray">加载中...</p>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen rice-paper-bg">
      <InkBackground />

      <div className="relative z-10 max-w-5xl mx-auto p-6 md:p-12">
        {/* 顶部导航 */}
        <div className="flex justify-between items-center mb-8">
          <Link href="/" className="text-ink-black hover:text-ink-red transition-colors">
            ← 返回首页
          </Link>
          <h1 className="text-2xl font-bold text-ink-black" style={{ fontFamily: 'Georgia, SimSun, serif' }}>
            作品收藏馆
          </h1>
          <div className="w-20" />
        </div>

        {/* 标签筛选区 */}
        <div className="mb-8 p-4 bg-ink-card backdrop-blur-sm rounded-xl border border-ink-brown/20">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-ink-gray">按标签筛选收藏作品</p>
            {(selectedTags.genre.length > 0 || selectedTags.emotion.length > 0 || selectedTags.style.length > 0) && (
              <button
                onClick={clearFilters}
                className="text-xs text-ink-red hover:underline"
              >
                清除筛选
              </button>
            )}
          </div>
          {TAG_CATEGORIES.map((cat) => (
            <TagSelector
              key={cat.key}
              categoryKey={cat.key}
              selectedTags={selectedTags[cat.key as keyof typeof selectedTags]}
              onToggle={toggleTag}
            />
          ))}
        </div>

        {/* 诗词列表 */}
        {filteredPoems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-ink-gray text-lg mb-4">
              {poems.length === 0 ? '暂无收藏，去创作第一首吧' : '没有匹配的作品'}
            </p>
            {poems.length === 0 && (
              <Link
                href="/"
                className="inline-block px-6 py-2.5 bg-ink-red text-white dark:text-ink-bg rounded-full hover:bg-ink-red/90 transition-all"
              >
                去创作
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="text-sm text-ink-gray mb-4">
              共 {filteredPoems.length} 首作品
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPoems.map((poem) => (
                <PoemCard
                  key={poem.id}
                  poem={poem}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="fixed bottom-6 right-6 z-20">
        <SealStamp />
      </div>
    </main>
  )
}

function PoemCard({ poem, onDelete }: { poem: SavedPoem; onDelete: (id: string) => void }) {
  return (
    <div className="bg-ink-card backdrop-blur-sm rounded-xl p-5 border border-ink-brown/20 hover:shadow-md transition-all">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-bold text-ink-black" style={{ fontFamily: 'Georgia, SimSun, serif' }}>
          {poem.title}
        </h3>
        <button
          onClick={() => onDelete(poem.id)}
          className="text-ink-gray hover:text-red-500 transition-colors text-sm"
          title="删除"
        >
          ✕
        </button>
      </div>

      <p className="text-xs text-ink-gray mb-3">{poem.poemType} · {poem.dynasty_style}</p>

      <div className="mb-3 space-y-0.5">
        {poem.poem_lines.slice(0, 2).map((line, idx) => (
          <p key={idx} className="text-ink-black text-sm leading-relaxed">{line}</p>
        ))}
        {poem.poem_lines.length > 2 && (
          <p className="text-ink-gray text-xs">...</p>
        )}
      </div>

      {poem.categoryTags && (
        <div className="flex flex-wrap gap-1 mb-3">
          {[...poem.categoryTags.genre, ...poem.categoryTags.emotion, ...poem.categoryTags.style].slice(0, 5).map((tag, idx) => (
            <span key={idx} className="px-2 py-0.5 bg-ink-paper text-ink-brown rounded-full text-xs">
              {tag}
            </span>
          ))}
        </div>
      )}

      <p className="text-xs text-ink-gray/70">
        {new Date(poem.timestamp).toLocaleDateString('zh-CN')}
      </p>
    </div>
  )
}

function InkBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <svg className="w-full h-full" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">
        <defs>
          <filter id="ink-wash-gallery">
            <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="4" seed="42" />
            <feDisplacementMap in="SourceGraphic" scale="30" />
          </filter>
        </defs>
        <ellipse cx="30%" cy="20%" rx="300" ry="200" fill="rgba(43,43,43,0.04)" filter="url(#ink-wash-gallery)">
          <animate attributeName="rx" values="300;320;300" dur="8s" repeatCount="indefinite" />
        </ellipse>
        <ellipse cx="70%" cy="60%" rx="250" ry="180" fill="rgba(43,43,43,0.03)" filter="url(#ink-wash-gallery)">
          <animate attributeName="ry" values="180;200;180" dur="10s" repeatCount="indefinite" />
        </ellipse>
      </svg>
    </div>
  )
}
