import { resolveApiKey } from '@/lib/ai'

export async function GET() {
  const apiKey = resolveApiKey()
  if (!apiKey) {
    return Response.json({ error: '尚未注入笔墨，请先设置 API Key' }, { status: 400 })
  }

  try {
    const response = await fetch('https://api.siliconflow.cn/v1/user/info', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({}))
      return Response.json(
        { error: err.message || 'API Key 无效或查询失败' },
        { status: response.status }
      )
    }

    const data = await response.json()
    const balance = data.data?.balance

    return Response.json({
      balance: balance != null ? Number(balance) : null,
    })
  } catch {
    return Response.json({ error: '查询余额失败，请检查网络连接' }, { status: 500 })
  }
}
