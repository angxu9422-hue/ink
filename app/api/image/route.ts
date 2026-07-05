import { generateImage } from '@/lib/ai'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()

    if (!prompt) {
      return Response.json(
        { error: '缺少图像生成提示词' },
        { status: 400 }
      )
    }

    const imageUrl = await generateImage(prompt)
    return Response.json({ imageUrl })
  } catch (error: any) {
    console.error('Image generation error:', error)
    return Response.json(
      { error: error.message || '泼墨失败，请稍后再试' },
      { status: 500 }
    )
  }
}
