import { generatePoem } from '@/lib/ai'

export async function POST(request: Request) {
  const { theme, poemType, categoryTags } = await request.json()

  if (!theme || !poemType) {
    return Response.json(
      { error: '请输入主题和选择诗体' },
      { status: 400 }
    )
  }

  const encoder = new TextEncoder()

  function emit(event: string, data: unknown) {
    return encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
  }

  const stream = new ReadableStream({
    async start(controller) {
      try {
        // 阶段一：研墨
        controller.enqueue(emit('stage', { stage: 'ink', text: '研墨中...' }))

        // 调用 AI 生成诗词
        const result = await generatePoem(theme, poemType, categoryTags)

        // 发送元信息
        controller.enqueue(emit('meta', {
          title: result.title,
          dynasty_style: result.dynasty_style,
          tags: result.tags,
          poemType,
          theme,
        }))

        // 阶段二：挥毫 — 逐字输出诗句
        controller.enqueue(emit('stage', { stage: 'brush', text: '挥毫间...' }))

        const allChars: { lineIdx: number; charIdx: number; char: string }[] = []
        for (let lineIdx = 0; lineIdx < result.poem_lines.length; lineIdx++) {
          const line = result.poem_lines[lineIdx]
          for (let charIdx = 0; charIdx < line.length; charIdx++) {
            allChars.push({ lineIdx, charIdx, char: line[charIdx] })
          }
        }

        // 分批发送字符，模拟书写节奏
        for (let i = 0; i < allChars.length; i++) {
          controller.enqueue(emit('char', allChars[i]))
          // 标点符号停顿更短，句末停顿更长
          const ch = allChars[i].char
          const delay = ch === '，' || ch === '。' ? 120 : 60
          await new Promise(r => setTimeout(r, delay))
        }

        // 阶段三：落款
        controller.enqueue(emit('stage', { stage: 'seal', text: '待落款...' }))
        await new Promise(r => setTimeout(r, 600))

        // 完成
        controller.enqueue(emit('done', { ...result, categoryTags, theme, poemType, timestamp: Date.now() }))
        controller.close()
      } catch (error: any) {
        controller.enqueue(emit('error', { error: error.message || '墨尽笔枯，请稍后再试' }))
        controller.close()
      }
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
