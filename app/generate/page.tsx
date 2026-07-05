'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import CalligraphyText, { type LayoutMode } from '@/components/CalligraphyText'
import PoemExplanation from '@/components/PoemExplanation'
import SealStamp from '@/components/SealStamp'
import { savePoem, isSaved, generateId } from '@/lib/storage'

interface PoemData {
  id?: string
  title: string
  dynasty_style: string
  poem_lines: string[]
  tags: string[]
  theme: string
  poemType: string
  categoryTags?: { genre: string[]; emotion: string[]; style: string[] }
  imageUrl?: string
  timestamp: number
}

export default function GeneratePage() {
  const [poemData, setPoemData] = useState<PoemData | null>(null)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [imageLoading, setImageLoading] = useState(true)
  const [showExplanation, setShowExplanation] = useState(false)
  const [saved, setSaved] = useState(false)
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('vertical')
  const router = useRouter()

  useEffect(() => {
    const data = sessionStorage.getItem('current_poem')
    if (!data) { router.push('/'); return }

    const poem = JSON.parse(data)
    setPoemData(poem)
    if (poem.id && isSaved(poem.id)) setSaved(true)
    generateImage(poem)
  }, [])

  async function generateImage(poem: PoemData) {
    try {
      const prompt = `Traditional Chinese ink wash painting, 
 ${poem.theme}, 
 minimalist vertical composition, black ink on rice paper, 
 elegant brushwork, serene atmosphere, negative space, 
 inspired by the mood of the poem, 
 no text, no characters, no signature`

      const res = await fetch('/api/image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      })
      const data = await res.json()
      if (data.imageUrl) setImageUrl(data.imageUrl)
    } catch { /* 静默降级，不影响诗词展示 */ }
    finally { setImageLoading(false) }
  }

  function handleSave() {
    if (!poemData) return
    const id = poemData.id || generateId()
    savePoem({ ...poemData, id, imageUrl })
    setSaved(true)
  }

  function handleNewPoem() {
    sessionStorage.removeItem('current_poem')
    router.push('/')
  }

  if (!poemData) return null

  return (
    <main className="relative min-h-screen">
      {/* ======== 水墨画背景（懒加载 + 布局稳定） ======== */}
      <div className="fixed inset-0 z-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt=""
            loading="lazy"
            className="w-full h-full object-cover opacity-20 dark:opacity-15"
          />
        ) : (
          <div className="w-full h-full img-placeholder opacity-10" />
        )}
        {/* 水墨遮罩层 */}
        <div className="absolute inset-0 bg-ink-bg/85" />
      </div>

      {/* ======== 内容层 ======== */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-6 py-12 md:py-16">

        {/* ---- 诗题区 ---- */}
        <header className="text-center mb-10 md:mb-14">
          <h2
            className="text-3xl md:text-5xl font-bold text-ink-title mb-3 tracking-wider brush-stroke"
            style={{ fontFamily: 'Georgia, SimSun, serif' }}
          >
            {poemData.title}
          </h2>
          <p className="text-sm text-ink-sub/70 tracking-wide">{poemData.dynasty_style}</p>
          <div className="mt-5 flex justify-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-ink-card text-ink-brown text-xs rounded-full border border-ink-input-border">
              {poemData.poemType}
            </span>
            {poemData.tags?.map((tag, idx) => (
              <span key={idx} className="px-3 py-1 bg-ink-card text-ink-sub/70 text-xs rounded-full border border-ink-input-border">
                {tag}
              </span>
            ))}
          </div>
        </header>

        {/* ---- 布局切换 ---- */}
        <nav className="mb-6 flex justify-center">
          <div className="inline-flex bg-ink-card rounded-full border border-ink-input-border p-1 backdrop-blur-sm">
            {(['vertical', 'horizontal'] as LayoutMode[]).map(mode => (
              <button
                key={mode}
                onClick={() => setLayoutMode(mode)}
                className={`px-5 py-1.5 rounded-full text-sm tracking-wider transition-all ${
                  layoutMode === mode
                    ? 'bg-ink-tag-on text-ink-tag-on-text shadow-sm'
                    : 'text-ink-sub/70 hover:text-ink-body'
                }`}
              >
                {mode === 'vertical' ? '竖排' : '横排'}
              </button>
            ))}
          </div>
        </nav>

        {/* ---- 诗词展示（卷轴卡片） ---- */}
        <section className="mb-10 w-full max-w-2xl mx-auto">
          <div className="ink-scroll-card p-8 md:p-12 backdrop-blur-sm">
            <CalligraphyText
              lines={poemData.poem_lines}
              layout={layoutMode}
            />
          </div>
        </section>

        {/* ---- 操作栏 ---- */}
        <div className="flex flex-wrap gap-3 justify-center mb-8">
          <button
            onClick={() => setShowExplanation(true)}
            className="ink-btn px-6 py-2.5 bg-ink-card text-ink-body rounded-full
                     border border-ink-input-border text-sm tracking-wider"
          >
            诗意解读
          </button>

          <button
            onClick={handleSave}
            disabled={saved}
            className={`px-6 py-2.5 rounded-full text-sm tracking-wider transition-all ${
              saved
                ? 'bg-ink-tag-off text-ink-sub/50 cursor-not-allowed'
                : 'bg-ink-red text-white dark:text-ink-bg hover:opacity-90 shadow-sm'
            }`}
          >
            {saved ? '已收藏' : '收藏'}
          </button>

          <button
            onClick={handleNewPoem}
            className="ink-btn px-6 py-2.5 bg-ink-card text-ink-body rounded-full
                     border border-ink-input-border text-sm tracking-wider"
          >
            再作一首
          </button>
        </div>

        {/* ---- 底部 ---- */}
        <div className="text-center space-y-3">
          <Link
            href="/gallery"
            className="text-xs text-ink-brown/60 hover:text-ink-red tracking-wider transition-colors"
          >
            查看收藏馆
          </Link>
          {imageLoading && (
            <p className="text-xs text-ink-sub/50 animate-pulse tracking-wider">泼墨作画中...</p>
          )}
        </div>
      </div>

      {/* 印章 */}
      <div className="fixed bottom-6 right-6 z-20">
        <SealStamp />
      </div>

      {/* 解读弹窗 */}
      {showExplanation && (
        <PoemExplanation
          poem={poemData.poem_lines.join('\n')}
          onClose={() => setShowExplanation(false)}
        />
      )}
    </main>
  )
}
