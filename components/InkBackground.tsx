'use client'

import { useEffect, useRef, useCallback } from 'react'

/* ============================================================
   InkDrop — 单枚墨滴
   ============================================================ */
interface Satellite {
  angle: number
  distance: number
  radius: number
  maxRadius: number
  opacity: number
  speed: number
}

interface InkDrop {
  x: number
  y: number
  radius: number
  maxRadius: number
  opacity: number
  peakOpacity: number
  speed: number
  life: number          // 0..1, 0=刚出现 1=已消散
  hue: number           // 色相微调 (200-240 冷墨, 30-50 暖墨)
  satellites: Satellite[]
}

/* ============================================================
   Constants
   ============================================================ */
const MAX_DROPS = 18
const AUTO_SPAWN_INTERVAL_MS = 2800

// 墨色基调：从中心深黑到边缘暖褐
const INK_COLORS = {
  deep:  { r: 30,  g: 28,  b: 26 },  // 浓墨
  mid:   { r: 55,  g: 50,  b: 45 },  // 中墨
  light: { r: 100, g: 90,  b: 80 },  // 淡墨
  edge:  { r: 180, g: 170, b: 155 }, // 边缘晕染
}

export default function InkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dropsRef = useRef<InkDrop[]>([])
  const mouseRef = useRef({ x: -500, y: -500, prevX: -500, prevY: -500 })
  const rafRef = useRef(0)
  const lastAutoSpawn = useRef(0)
  const dimensions = useRef({ w: 0, h: 0, dpr: 1 })

  /* ------ 创建新墨滴 ------ */
  const spawnDrop = useCallback((x: number, y: number, maxR: number, peak: number) => {
    const drops = dropsRef.current
    if (drops.length >= MAX_DROPS) {
      // 替换最老的
      drops.shift()
    }
    const satellites: Satellite[] = []
    const satCount = Math.floor(Math.random() * 3) + 1
    for (let i = 0; i < satCount; i++) {
      satellites.push({
        angle: Math.random() * Math.PI * 2,
        distance: 12 + Math.random() * 35,
        radius: 0,
        maxRadius: 4 + Math.random() * 15,
        opacity: 0.15 + Math.random() * 0.25,
        speed: 0.003 + Math.random() * 0.006,
      })
    }

    drops.push({
      x, y,
      radius: 3 + Math.random() * 8,
      maxRadius: maxR,
      opacity: 0,
      peakOpacity: peak,
      speed: 0.004 + Math.random() * 0.008,
      life: 0,
      hue: Math.random() < 0.6 ? 215 + Math.random() * 25 : 35 + Math.random() * 15,
      satellites,
    })
  }, [])

  /* ------ 鼠标响应墨滴 ------ */
  const spawnMouseDrop = useCallback((x: number, y: number) => {
    spawnDrop(x, y, 30 + Math.random() * 50, 0.08 + Math.random() * 0.06)
  }, [spawnDrop])

  /* ------ 自动墨滴 ------ */
  const spawnAutoDrop = useCallback((w: number, h: number) => {
    const margin = 0.1
    const x = w * (margin + Math.random() * (1 - margin * 2))
    const y = h * (margin + Math.random() * (1 - margin * 2))
    const maxR = 60 + Math.random() * 200
    const peak = 0.02 + Math.random() * 0.05
    spawnDrop(x, y, maxR, peak)
  }, [spawnDrop])

  /* ------ 动画主循环 ------ */
  const animate = useCallback((timestamp: number) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const { w, h, dpr } = dimensions.current
    const drops = dropsRef.current

    // 清屏
    ctx.clearRect(0, 0, w, h)

    // 绘制所有墨滴
    for (let i = drops.length - 1; i >= 0; i--) {
      const drop = drops[i]

      // 更新扩散
      drop.life += drop.speed
      drop.radius = drop.maxRadius * easeInOutCubic(Math.min(drop.life, 1))

      // 透明度：快速上升 → 缓慢下降（墨迹浸入纸张的效果）
      if (drop.life < 0.3) {
        drop.opacity = drop.peakOpacity * (drop.life / 0.3)
      } else if (drop.life > 0.7) {
        drop.opacity = drop.peakOpacity * ((1 - drop.life) / 0.3)
      } else {
        drop.opacity = drop.peakOpacity
      }

      // 移除已消散的
      if (drop.life >= 1) {
        drops.splice(i, 1)
        continue
      }

      // 绘制主墨滴
      drawInkDrop(ctx, drop)

      // 绘制卫星墨点
      for (const sat of drop.satellites) {
        sat.radius += (sat.maxRadius - sat.radius) * sat.speed
        const satOpacity = drop.opacity * sat.opacity * (1 - drop.life * 0.5)
        if (satOpacity < 0.003) continue

        const sx = drop.x + Math.cos(sat.angle) * sat.distance * (0.6 + drop.life * 0.8)
        const sy = drop.y + Math.sin(sat.angle) * sat.distance * (0.6 + drop.life * 0.8)

        const gradient = ctx.createRadialGradient(sx, sy, 0, sx, sy, sat.radius)
        gradient.addColorStop(0, `rgba(${INK_COLORS.deep.r},${INK_COLORS.deep.g},${INK_COLORS.deep.b},${satOpacity})`)
        gradient.addColorStop(0.3, `rgba(${INK_COLORS.mid.r},${INK_COLORS.mid.g},${INK_COLORS.mid.b},${satOpacity * 0.7})`)
        gradient.addColorStop(0.7, `rgba(${INK_COLORS.light.r},${INK_COLORS.light.g},${INK_COLORS.light.b},${satOpacity * 0.3})`)
        gradient.addColorStop(1, 'rgba(0,0,0,0)')

        ctx.beginPath()
        ctx.arc(sx, sy, sat.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      }
    }

    // 自动生成
    if (timestamp - lastAutoSpawn.current > AUTO_SPAWN_INTERVAL_MS) {
      lastAutoSpawn.current = timestamp
      spawnAutoDrop(w, h)
    }

    rafRef.current = requestAnimationFrame(animate)
  }, [spawnAutoDrop])

  /* ------ 启动 & 清理 ------ */
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const dpr = window.devicePixelRatio || 1
    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      dimensions.current = { w: w * dpr, h: h * dpr, dpr }
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
    }
    resize()
    window.addEventListener('resize', resize)

    // 鼠标跟踪（节流）
    let throttleTimer: ReturnType<typeof setTimeout> | null = null
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current.prevX = mouseRef.current.x
      mouseRef.current.prevY = mouseRef.current.y
      mouseRef.current.x = e.clientX * dpr
      mouseRef.current.y = e.clientY * dpr

      // 鼠标移动一定距离时生成墨滴
      const dx = mouseRef.current.x - mouseRef.current.prevX
      const dy = mouseRef.current.y - mouseRef.current.prevY
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist > 80 && !throttleTimer) {
        throttleTimer = setTimeout(() => {
          spawnMouseDrop(mouseRef.current.x, mouseRef.current.y)
          throttleTimer = null
        }, 200)
      }
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })

    // 启动动画
    // 初始撒几滴
    for (let i = 0; i < 4; i++) {
      spawnAutoDrop(dimensions.current.w, dimensions.current.h)
    }
    rafRef.current = requestAnimationFrame(animate)

    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMouseMove)
      if (throttleTimer) clearTimeout(throttleTimer)
    }
  }, [animate, spawnAutoDrop, spawnMouseDrop])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 pointer-events-none"
      style={{ willChange: 'transform' }}
    />
  )
}

/* ============================================================
   绘制单枚墨滴
   ============================================================ */
function drawInkDrop(ctx: CanvasRenderingContext2D, drop: InkDrop) {
  const { x, y, radius, opacity, hue } = drop
  if (opacity < 0.002) return

  // HSL 微调色相，让每滴墨色略有差异
  const saturation = 8 + Math.random() * 4
  const lightness = 8 + drop.life * 15

  // 使用多层径向渐变模拟墨迹从浓到淡的自然过渡
  const gradient = ctx.createRadialGradient(x, y, radius * 0.05, x, y, radius)

  // 中心：浓墨
  gradient.addColorStop(0,    `hsla(${hue},${saturation}%,${lightness}%,${opacity})`)
  gradient.addColorStop(0.15, `hsla(${hue},${saturation}%,${lightness + 5}%,${opacity * 0.95})`)
  gradient.addColorStop(0.35, `hsla(${hue},${saturation - 2}%,${lightness + 10}%,${opacity * 0.75})`)
  gradient.addColorStop(0.6,  `hsla(${hue},${saturation - 4}%,${lightness + 18}%,${opacity * 0.4})`)
  gradient.addColorStop(0.85, `hsla(${hue},${saturation - 6}%,${lightness + 25}%,${opacity * 0.12})`)
  gradient.addColorStop(1,    'rgba(0,0,0,0)')

  ctx.beginPath()
  ctx.arc(x, y, radius, 0, Math.PI * 2)
  ctx.fillStyle = gradient
  ctx.fill()

  // 极淡的二次光晕 — 模拟宣纸纤维吸墨
  if (radius > 20) {
    const haloGradient = ctx.createRadialGradient(x, y, radius * 0.4, x, y, radius * 1.35)
    haloGradient.addColorStop(0, 'rgba(0,0,0,0)')
    haloGradient.addColorStop(0.5, `hsla(${hue},${saturation - 4}%,${lightness + 30}%,${opacity * 0.06})`)
    haloGradient.addColorStop(1, 'rgba(0,0,0,0)')
    ctx.beginPath()
    ctx.arc(x, y, radius * 1.35, 0, Math.PI * 2)
    ctx.fillStyle = haloGradient
    ctx.fill()
  }
}

/* ============================================================
   缓动函数：先快后慢，模拟墨汁遇纸扩散
   ============================================================ */
function easeInOutCubic(t: number): number {
  // 前半段快速扩散，后半段缓慢浸润
  if (t < 0.5) {
    return 4 * t * t * t  // ease-in
  }
  return 1 - Math.pow(-2 * t + 2, 3) / 2  // ease-out
}
