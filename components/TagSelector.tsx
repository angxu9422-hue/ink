'use client'

import { TAG_CATEGORIES } from '@/lib/tags'

interface TagSelectorProps {
  categoryKey: string
  selectedTags: string[]
  disabledTags?: string[]
  onToggle: (categoryKey: string, tag: string) => void
}

export default function TagSelector({ categoryKey, selectedTags, disabledTags, onToggle }: TagSelectorProps) {
  const category = TAG_CATEGORIES.find(c => c.key === categoryKey)
  if (!category) return null

  return (
    <div className="mb-5">
      {/* 分类标题 */}
      <label className="flex items-center gap-2 text-sm text-ink-sub mb-2.5">
        <span className="text-base">{category.icon}</span>
        <span className="font-medium">{category.label}</span>
        {selectedTags.length > 0 && (
          <span className="text-xs px-1.5 py-0.5 rounded-full bg-ink-body/8 text-ink-sub">
            {selectedTags.length}
          </span>
        )}
      </label>

      <div className="flex flex-wrap gap-2">
        {category.tags.map(tag => {
          const isSelected = selectedTags.includes(tag)
          const isDisabled = disabledTags?.includes(tag)
          return (
            <button
              key={tag}
              type="button"
              onClick={() => onToggle(categoryKey, tag)}
              disabled={isDisabled}
              className={[
                'px-3 py-1.5 rounded-full text-sm transition-all duration-300',
                'active:scale-95',
                isSelected
                  ? 'bg-ink-tag-on text-ink-tag-on-text ring-2 ring-ink-tag-on-ring ring-offset-2 ring-offset-ink-bg shadow-sm font-medium'
                  : 'tag-ink bg-ink-tag-off text-ink-tag-off-text border border-ink-tag-off-border',
                isDisabled
                  ? 'opacity-30 cursor-not-allowed'
                  : 'cursor-pointer',
              ].join(' ')}
            >
              {tag}
            </button>
          )
        })}
      </div>
    </div>
  )
}
