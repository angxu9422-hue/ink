import { generatePoem } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const { theme, poemType, categoryTags } = await request.json()

    if (!theme || !poemType) {
      return Response.json(
        { error: '请输入主题和选择诗体' },
        { status: 400 }
      )
    }

    const result = await generatePoem(theme, poemType, categoryTags)
    return Response.json({ ...result, categoryTags })
  } catch (error: any) {
    console.error('Poem generation error:', error)
    return Response.json(
      { error: error.message || '墨尽笔枯，请稍后再试' },
      { status: 500 }
    )
  }
}
