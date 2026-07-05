import { cookies } from 'next/headers'

const API_BASE = 'https://api.siliconflow.cn/v1'

export function resolveApiKey(): string | null {
  try {
    const cookieStore = cookies()
    const cookieKey = cookieStore.get('user_api_key')?.value
    if (cookieKey) return decodeURIComponent(cookieKey)
  } catch {
    // cookies() 在非请求上下文可能抛出
  }
  return process.env.SILICONFLOW_API_KEY || null
}

export async function generatePoem(theme: string, poemType: string, categoryTags?: { genre: string[]; emotion: string[]; style: string[] }) {
  let userContent = `主题：${theme}\n诗体：${poemType}`

  if (categoryTags && (categoryTags.genre.length || categoryTags.emotion.length || categoryTags.style.length)) {
    const tagParts = []
    if (categoryTags.genre.length) tagParts.push(`体裁=[${categoryTags.genre.join('、')}]`)
    if (categoryTags.emotion.length) tagParts.push(`情感=[${categoryTags.emotion.join('、')}]`)
    if (categoryTags.style.length) tagParts.push(`风格=[${categoryTags.style.join('、')}]`)
    userContent += `\n分类要求：${tagParts.join('，')}`
  }

  const response = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resolveApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'Qwen/Qwen2.5-72B-Instruct',
      messages: [
        { role: 'system', content: '你是一位精通中国古典诗词的大师，擅长创作格律严谨、意境深远的诗词。请根据用户的要求创作诗词。创作要求：1. 严格遵守该诗体的格律（平仄、押韵、对仗）2. 意境优美，有画面感 3. 用典自然，不可堆砌 4. 情感真挚，格调高雅 5. 切勿使用现代词汇。请以JSON格式返回（不要包含其他文字）：{"title": "诗题", "dynasty_style": "风格", "poem_lines": ["句1", "句2", "句3", "句4"], "tags": ["标签1", "标签2", "标签3"]}' },
        { role: 'user', content: userContent }
      ],
      temperature: 0.8,
      response_format: { type: 'json_object' }
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || '墨尽笔枯，请稍后再试')
  }

  const data = await response.json()
  const content = data.choices[0].message.content
  return JSON.parse(content)
}

export async function generateImage(prompt: string) {
  const response = await fetch(`${API_BASE}/images/generations`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resolveApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'Tongyi-MAI/Z-Image-Turbo',
      prompt: prompt,
      image_size: '1024x1024',
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || '泼墨失败，请稍后再试')
  }

  const data = await response.json()
  return data.images[0].url
}

export async function explainPoem(poem: string) {
  const response = await fetch(`${API_BASE}/chat/completions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${resolveApiKey()}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'Qwen/Qwen2.5-72B-Instruct',
      messages: [
        { role: 'system', content: '你是一位古典文学教授。请对以下诗词进行深入浅出的解读。请以JSON格式返回（不要包含其他文字）：{"translation": "白话译文", "appreciation": "赏析", "allusions": [{"word": "典故", "explanation": "解释"}], "imagery": ["意象1", "意象2"], "emotion": "情感基调"}' },
        { role: 'user', content: `诗词：\n${poem}` }
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' }
    }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error?.message || '解读失败，请稍后再试')
  }

  const data = await response.json()
  const content = data.choices[0].message.content
  return JSON.parse(content)
}
