import './globals.css'
import { ThemeProvider, ThemeScript } from '@/lib/theme'
import { ThemeToggle } from '@/components/ThemeToggle'

export const metadata = {
  title: '墨韵诗境 - AI中国古诗词生成器',
  description: '输入主题或心境，AI为你创作中国古典诗词，配以水墨画意境和书法动画展示',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen rice-paper-bg">
        <ThemeProvider>
          {children}
          <ThemeToggle />
        </ThemeProvider>
      </body>
    </html>
  )
}
