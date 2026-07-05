'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import InkBackground from '@/components/InkBackground'

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('')
  const [balance, setBalance] = useState<number | null>(null)
  const [balanceLoading, setBalanceLoading] = useState(false)
  const [balanceError, setBalanceError] = useState('')
  const [saved, setSaved] = useState(false)

  // 页面加载时从 localStorage 读取已有 Key
  useEffect(() => {
    const stored = localStorage.getItem('user_api_key')
    if (stored) {
      setApiKey(stored)
      setSaved(true)
      fetchBalance()
    }
  }, [])

  const fetchBalance = useCallback(async () => {
    setBalanceLoading(true)
    setBalanceError('')
    try {
      const res = await fetch('/api/balance')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || '查询失败')
      setBalance(data.balance)
    } catch (e: any) {
      setBalanceError(e.message)
      setBalance(null)
    } finally {
      setBalanceLoading(false)
    }
  }, [])

  function handleSave() {
    if (!apiKey.trim()) return

    // 存储到 localStorage
    localStorage.setItem('user_api_key', apiKey.trim())
    // 同时写入 Cookie（让服务端也能读取）
    document.cookie = `user_api_key=${encodeURIComponent(apiKey.trim())}; path=/; max-age=31536000; SameSite=Lax`
    setSaved(true)

    // 刷新余额
    fetchBalance()
  }

  function handleClear() {
    localStorage.removeItem('user_api_key')
    document.cookie = 'user_api_key=; path=/; max-age=0'
    setApiKey('')
    setSaved(false)
    setBalance(null)
    setBalanceError('')
  }

  function maskKey(key: string) {
    if (key.length <= 8) return '****'
    return key.slice(0, 4) + '****' + key.slice(-4)
  }

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6">
      <InkBackground />

      <div className="relative z-10 w-full max-w-md">
        {/* 返回 */}
        <Link
          href="/"
          className="inline-block text-ink-brown hover:text-ink-red transition-colors mb-8"
        >
          ← 返回首页
        </Link>

        {/* 标题 */}
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold text-ink-black mb-2"
            style={{ fontFamily: 'Georgia, SimSun, serif' }}
          >
            注入笔墨
          </h1>
          <p className="text-sm text-ink-gray">
            设置 SiliconFlow API Key，为墨韵诗境注入灵感
          </p>
        </div>

        {/* 墨水余额卡片 */}
        <div className="mb-6 p-6 bg-ink-card backdrop-blur-sm rounded-xl border border-ink-brown/20 text-center">
          <p className="text-sm text-ink-gray mb-2">墨水总量（剩余额度）</p>
          {balanceLoading ? (
            <p className="text-ink-gray animate-pulse">研墨中...</p>
          ) : balanceError ? (
            <p className="text-ink-red text-sm">{balanceError}</p>
          ) : balance !== null ? (
            <p
              className="text-4xl font-bold text-ink-black"
              style={{ fontFamily: 'Georgia, SimSun, serif' }}
            >
              ¥{balance.toFixed(2)}
            </p>
          ) : apiKey ? (
            <button
              onClick={fetchBalance}
              className="text-ink-brown hover:text-ink-red text-sm underline transition-colors"
            >
              点击查询余额
            </button>
          ) : (
            <p className="text-ink-gray text-sm">请先填入 API Key</p>
          )}
        </div>

        {/* API Key 输入区 */}
        <div className="p-6 bg-ink-card backdrop-blur-sm rounded-xl border border-ink-brown/20">
          <label className="text-sm text-ink-gray block mb-2">
            SiliconFlow API Key
          </label>

          <div className="flex gap-2 mb-2">
            <input
              type="password"
              value={apiKey}
              onChange={(e) => {
                setApiKey(e.target.value)
                setSaved(false)
              }}
              placeholder="sk-xxxxxxxxxxxxxxxx"
              className="flex-1 px-4 py-2.5 bg-ink-card border border-ink-brown/20 rounded-lg
                         text-ink-black placeholder-ink-gray/50
                         focus:outline-none focus:border-ink-brown/50 transition-colors
                         text-sm"
            />
            {apiKey && (
              <button
                onClick={handleClear}
                className="px-3 py-2 text-ink-gray hover:text-ink-red transition-colors text-sm"
              >
                清除
              </button>
            )}
          </div>

          {saved && apiKey && (
            <p className="text-xs text-[#4A7C59] mb-3">
              已保存: {maskKey(apiKey)}
            </p>
          )}

          <button
            onClick={handleSave}
            disabled={!apiKey.trim() || saved}
            className={`w-full py-2.5 rounded-lg transition-all text-sm font-medium
              ${!apiKey.trim() || saved
                ? 'bg-ink-brown/10 text-ink-gray/50 cursor-not-allowed'
                : 'bg-ink-red text-white dark:text-ink-bg hover:bg-ink-red/90'
              }`}
          >
            {saved ? '已注入笔墨' : '注入笔墨'}
          </button>

          <p className="mt-4 text-xs text-ink-gray/70 leading-relaxed">
            前往{' '}
            <a
              href="https://siliconflow.cn"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-brown hover:text-ink-red underline"
            >
              SiliconFlow 官网
            </a>
            {' '}注册即送 14 元额度。Key 仅保存在本地浏览器中，不会上传到我们的服务器。
          </p>
        </div>
      </div>
    </main>
  )
}
