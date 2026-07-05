export const TAG_CATEGORIES = [
  {
    key: 'genre',
    label: '体裁分类',
    icon: '📜',
    tags: ['古体诗', '近体诗', '小令', '中调', '长调'],
  },
  {
    key: 'emotion',
    label: '情感分类',
    icon: '💭',
    tags: ['咏史', '咏物', '山水田园', '边塞', '送别', '思乡怀人', '羁旅', '闺怨'],
  },
  {
    key: 'style',
    label: '风格分类',
    icon: '🎨',
    tags: ['婉约', '豪迈', '清淡自然', '沉郁顿挫', '旷达洒脱'],
  },
]

export type CategoryTags = {
  genre: string[]
  emotion: string[]
  style: string[]
}
