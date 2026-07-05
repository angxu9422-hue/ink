# 墨韵诗境 · AI中国古诗词生成器

> 大学生创意编程比赛参赛作品

## 项目简介

输入一个主题或心境，AI为你创作一首中国古典诗词，配以水墨画意境和书法动画展示，并可交互探索诗意解读。

## 功能特性

- 🖋️ **AI诗词生成** — 调用大模型生成符合格律的中国古典诗词
- 🎨 **水墨画生成** — AI生成匹配诗意的中国水墨画
- ✍️ **书法动画** — 逐字"书写"效果，墨迹晕染
- 📖 **诗意解读** — 点击查看白话译文、典故、赏析
- 💾 **作品收藏** — localStorage保存历史作品
- 🎨 **水墨美学UI** — 宣纸米色背景、朱砂印章、水墨晕染动画

## 技术栈

- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **AI接口**: SiliconFlow API (Qwen2.5-72B + FLUX.1-schnell)

## 快速开始

### 1. 安装依赖

```bash
cd ink-rhyme
npm install
```

### 2. 配置 API Key

1. 注册 SiliconFlow: https://siliconflow.cn/
2. 注册即送 14 元额度（约 2000 万 tokens），足够开发和演示使用
3. 复制 `.env.local.example` 为 `.env.local`
4. 在 `.env.local` 中填入你的 API Key:

```env
SILICONFLOW_API_KEY=sk_你的API密钥
```

### 3. 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:3000 查看效果。

## 项目结构

```
ink-rhyme/
├── app/
│   ├── layout.tsx              # 全局布局
│   ├── page.tsx                # 首页（主题输入）
│   ├── generate/
│   │   └── page.tsx            # 生成结果展示页
│   └── api/
│       ├── poem/route.ts       # 诗词生成接口
│       ├── image/route.ts      # 水墨画生成接口
│       └── explain/route.ts    # 诗意解读接口
├── components/
│   ├── InkBackground.tsx       # 水墨动态背景
│   ├── CalligraphyText.tsx     # 书法逐字动画
│   ├── ThemeInput.tsx          # 主题输入组件
│   ├── PoemExplanation.tsx     # 诗意解读弹窗
│   ├── LoadingInk.tsx         # 水墨风加载动画
│   └── SealStamp.tsx          # 朱砂印章
├── lib/
│   ├── ai.ts                   # SiliconFlow API封装
│   ├── prompts.ts              # 提示词模板
│   └── storage.ts              # localStorage收藏管理
└── public/                      # 静态资源
```

## 使用说明

1. 在首页输入主题或心境（如"秋日独坐，思念远方的故人"）
2. 选择诗体（七言绝句/五言律诗/词）
3. 点击"研墨成诗"按钮
4. 等待AI生成诗词和水墨画
5. 查看书法动画展示的诗词
6. 点击"诗意解读"查看白话译文和典故
7. 点击"收藏"保存作品

## 比赛评分维度对应

| 评分维度 | 本项目竞争力 |
|---------|------------|
| 应用创意独特性 | AI+传统文化融合，诗画书一体，文化壁垒高 |
| 交互逻辑合理性 | 输入→生成→展示→解读→收藏，流程清晰 |
| 技术方案稳定实现 | Next.js全栈一体，API Routes保护密钥 |
| 用户体验完整性 | 水墨美学UI，书法动画，收藏功能 |

## 注意事项

- API Key 必须保密，不要提交到 Git
- 图像生成可能需要 10-30 秒，请耐心等待
- 建议使用现代浏览器（Chrome/Edge/Firefox）

## 后续改进方向

- [ ] 添加语音朗读功能
- [ ] 支持更多诗体（排律、乐府等）
- [ ] 添加诗词知识科普卡片
- [ ] 支持分享到社交媒体
- [ ] 添加用户登录和云端收藏
