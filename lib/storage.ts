export interface SavedPoem {
  id: string
  title: string
  poem_lines: string[]
  dynasty_style: string
  tags: string[]
  theme: string
  poemType: string
  categoryTags?: { genre: string[]; emotion: string[]; style: string[] }
  imageUrl?: string
  timestamp: number
}

const STORAGE_KEY = 'ink_rhyme_collection'

export function savePoem(poem: SavedPoem) {
  const collection = getCollection()
  collection.unshift(poem)
  // 最多保存50首
  if (collection.length > 50) {
    collection.pop()
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(collection))
}

export function getCollection(): SavedPoem[] {
  if (typeof window === 'undefined') return []
  const data = localStorage.getItem(STORAGE_KEY)
  return data ? JSON.parse(data) : []
}

export function deletePoem(id: string) {
  const collection = getCollection()
  const filtered = collection.filter(p => p.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
}

export function isSaved(id: string): boolean {
  const collection = getCollection()
  return collection.some(p => p.id === id)
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
