'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TagSelector from './TagSelector'
import StreamingPoem from './StreamingPoem'
import { TAG_CATEGORIES, type CategoryTags } from '@/lib/tags'

const POEM_TYPES = ['七言绝句', '五言律诗', '词']

export default function ThemeInput() {
  const [theme, setTheme] = useState('')
  const [poemType, setPoemType] = useState(POEM_TYPES[0])
  const [loading, setLoading] = useState(false)
  const [streaming, setStreaming] = useState(false)
  const [error, setError] = useState('')
  const [selectedTags, setSelectedTags] = useState<CategoryTags>({
    genre: [], emotion: [], style: [],
  })
  const router = useRouter()

  const disabledGenreTags: string[] = (poemType === '七言绝句' || poemType === '五言律诗')
    ? ['小令', '中调', '长调']
    : ['古体诗', '近体诗']

  function handlePoemTypeChange(newType: string) {
    setPoemType(newType)
    setSelectedTags(prev => ({
      ...prev,
      genre: prev.genre.filter(t =>
        newType === '词' ? !['古体诗', '近体诗'].includes(t) : !['小令', '中调', '长调'].includes(t)
      )
    }))
  }

  function toggleTag(categoryKey: string, tag: string) {
    setSelectedTags(prev => {
      if (categoryKey !== 'genre') {
        const key = categoryKey as Exclude<keyof CategoryTags, 'genre'>
        const list = prev[key]
        return { ...prev, [key]: list.includes(tag) ? list.filter(t => t !== tag) : [...list, tag] }
      }
      const current = prev.genre
      if (current.includes(tag)) return { ...prev, genre: current.filter(t => t !== tag) }
      if (tag === '古体诗' || tag === '近体诗')
        return { ...prev, genre: [...current.filter(t => t !== '古体诗' && t !== '近体诗'), tag] }
      if (['小令', '中调', '长调'].includes(tag))
        return { ...prev, genre: [...current.filter(t => !['小令', '中调', '长调'].includes(t)), tag] }
      return { ...prev, genre: [...current, tag] }
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!theme.trim()) { setError('请输入主题或心境'); return }
    setStreaming(true)
    setLoading(true)
    setError('')
  }

  function handleStreamComplete(poemData: Record<string, unknown>) {
    sessionStorage.setItem('current_poem', JSON.stringify(poemData))
    setStreaming(false); setLoading(false)
    router.push('/generate')
  }

  function handleStreamError(errMsg: string) {
    setStreaming(false); setLoading(false)
    setError(errMsg)
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="w-full space-y-6">

        {/* 主题输入 */}
        <div>
          <label className="block text-sm text-ink-sub mb-2 tracking-wider">
            意 在 笔 先
          </label>
          <textarea
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            placeholder="秋日独坐，思念远方的故人..."
            className="ink-field w-full h-28 p-4 backdrop-blur-sm
                     text-ink-body text-sm leading-relaxed tracking-wide resize-none"
            disabled={loading}
          />
        </div>

        {/* 诗体选择 */}
        <div>
          <label className="block text-sm text-ink-sub mb-2 tracking-wider">
            诗 体
          </label>
          <div className="flex gap-2">
            {POEM_TYPES.map(type => (
              <button
                key={type}
                type="button"
                onClick={() => handlePoemTypeChange(type)}
                className={`px-5 py-2 rounded-full text-sm tracking-wider transition-all ${
                  poemType === type
                    ? 'ink-poem-sel bg-ink-tag-on text-ink-tag-on-text ring-2 ring-ink-tag-on-ring ring-offset-2 ring-offset-ink-bg shadow-md font-semibold scale-[1.04]'
                    : 'bg-ink-tag-off text-ink-tag-off-text border border-ink-tag-off-border tag-ink'
                }`}
                disabled={loading}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* 分类标签 */}
        <div className="p-4 bg-ink-card rounded-xl border border-ink-input-border backdrop-blur-sm">
          <p className="text-xs text-ink-sub mb-3 tracking-wider">分 类 标 签</p>
          {TAG_CATEGORIES.map(cat => (
            <TagSelector
              key={cat.key}
              categoryKey={cat.key}
              selectedTags={selectedTags[cat.key as keyof CategoryTags]}
              disabledTags={cat.key === 'genre' ? disabledGenreTags : undefined}
              onToggle={toggleTag}
            />
          ))}
        </div>

        {/* 错误提示 */}
        {error && (
          <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/25 text-red-600 dark:text-red-300 text-xs tracking-wide">
            {error}
          </div>
        )}

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={loading}
          className="ink-btn w-full py-3 rounded-xl bg-ink-red text-white dark:text-ink-bg
                   font-medium text-sm tracking-[0.3em]
                   hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed
                   shadow-sm"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white dark:border-ink-bg/30 dark:border-t-ink-bg rounded-full animate-spin" />
              研 墨 中
            </span>
          ) : (
            '研 墨 成 诗'
          )}
        </button>
      </form>

      {/* 流式生成覆盖层 */}
      {streaming && (
        <StreamingPoem
          theme={theme}
          poemType={poemType}
          categoryTags={selectedTags}
          onComplete={handleStreamComplete}
          onError={handleStreamError}
        />
      )}
    </>
  )
}
