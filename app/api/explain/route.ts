import { explainPoem } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const { poem } = await request.json()

    if (!poem) {
      return Response.json(
        { error: '缺少诗词内容' },
        { status: 400 }
      )
    }

    const result = await explainPoem(poem)
    return Response.json(result)
  } catch (error: any) {
    console.error('Poem explanation error:', error)
    return Response.json(
      { error: error.message || '解读失败，请稍后再试' },
      { status: 500 }
    )
  }
}
