'use client'

import Link from 'next/link'
import InkBackground from '@/components/InkBackground'
import ThemeInput from '@/components/ThemeInput'

export default function HomePage() {
  return (
    <main className="relative min-h-screen">
      <InkBackground />

      <div className="relative z-10 flex flex-col items-center min-h-screen">

        {/* ---- 标题区 ---- */}
        <header className="w-full pt-16 md:pt-24 pb-4 text-center px-6">
          {/* 印章 — 入场浮起 */}
          <div className="ink-rise inline-block mb-4">
            <span className="seal-stamp inline-flex items-center justify-center w-9 h-9 text-xs font-bold">
              韵
            </span>
          </div>

          <h1
            className="ink-rise ink-rise-delay-1 text-5xl md:text-7xl font-bold tracking-[0.2em] text-ink-title brush-stroke"
            style={{ fontFamily: 'Georgia, SimSun, serif' }}
          >
            墨<span className="mx-1">韵</span>诗<span className="mx-1">境</span>
          </h1>
          <p className="ink-rise ink-rise-delay-2 mt-4 text-sm md:text-base text-ink-sub/70 tracking-widest">
            意在笔先 · 诗成墨未干
          </p>
        </header>

        {/* ---- 留白 + 交互区 ---- */}
        <div className="ink-rise ink-rise-delay-3 flex-1 flex flex-col items-center justify-center w-full max-w-lg mx-auto px-6">
          <section className="w-full">
            <ThemeInput />
          </section>
        </div>

        {/* ---- 底部 ---- */}
        <footer className="w-full pb-10 pt-4 text-center text-xs md:text-sm text-ink-muted space-y-3 px-6">
          <div className="flex gap-8 justify-center">
            <Link href="/gallery" className="text-ink-brown/70 hover:text-ink-red transition-colors tracking-wider">
              作品收藏馆
            </Link>
            <span className="text-ink-brown/20">|</span>
            <Link href="/settings" className="text-ink-brown/70 hover:text-ink-red transition-colors tracking-wider">
              注入笔墨
            </Link>
          </div>
          <p className="tracking-widest text-[0.65rem]">墨尽笔枯时 · 诗意自心生</p>
        </footer>

      </div>
    </main>
  )
}
