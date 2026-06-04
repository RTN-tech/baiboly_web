import { ref, computed } from 'vue'
import { books } from '../data/books.js'

const index = ref([])
const isIndexing = ref(false)
const indexingProgress = ref({ loaded: 0, total: books.length })
const indexReady = ref(false)

let loadPromise = null

async function buildIndex() {
  if (indexReady.value) return
  if (loadPromise) return loadPromise

  isIndexing.value = true
  indexingProgress.value = { loaded: 0, total: books.length }

  loadPromise = (async () => {
    const allVerses = []

    for (const book of books) {
      try {
        const response = await fetch(`/${book.file}`)
        if (!response.ok) throw new Error(`Failed to load ${book.file}`)
        const data = await response.json()

        for (const [chapterNum, verses] of Object.entries(data)) {
          if (chapterNum === 'meta') continue
          for (const [verseNum, verseText] of Object.entries(verses)) {
            allVerses.push({
              bookId: book.id,
              bookName: book.name,
              testament: book.testament,
              testamentLabel: book.testamentLabel,
              chapter: parseInt(chapterNum),
              verse: parseInt(verseNum),
              text: verseText
            })
          }
        }
      } catch (e) {
        console.warn(`Tsy afaka namaky: ${book.name}`, e)
      }
      indexingProgress.value.loaded++
    }

    index.value = allVerses
    indexReady.value = true
    isIndexing.value = false
  })()

  return loadPromise
}

function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function highlightText(text, query) {
  if (!query || !text) return text
  const escaped = escapeRegex(query)
  const regex = new RegExp(`(${escaped})`, 'gi')
  return text.replace(regex, '<mark class="search-highlight">$1</mark>')
}

function search(query) {
  if (!query || !index.value.length) return { results: [], total: 0 }

  const q = query.trim().toLowerCase()
  if (q.length < 2) return { results: [], total: 0 }

  const words = q.split(/\s+/).filter(w => w.length > 0)

  let matches = index.value.filter(entry => {
    const text = entry.text.toLowerCase()
    return words.every(word => text.includes(word))
  })

  const total = matches.length

  // Group by book
  const grouped = {}
  for (const match of matches) {
    const key = match.bookId
    if (!grouped[key]) {
      grouped[key] = {
        bookId: match.bookId,
        bookName: match.bookName,
        testament: match.testament,
        testamentLabel: match.testamentLabel,
        verses: []
      }
    }
    grouped[key].verses.push({
      chapter: match.chapter,
      verse: match.verse,
      text: match.text,
      highlightedText: highlightText(match.text, q),
      ref: `${match.bookName} ${match.chapter}:${match.verse}`
    })
  }

  const results = Object.values(grouped).sort((a, b) => {
    // Sort by testament (Taloha first), then by book order
    const idxA = books.findIndex(b => b.id === a.bookId)
    const idxB = books.findIndex(b => b.id === b.bookId)
    return idxA - idxB
  })

  // Truncate verses per book to avoid overwhelming results
  for (const group of results) {
    if (group.verses.length > 50) {
      group.truncated = true
      group.totalVerses = group.verses.length
      group.verses = group.verses.slice(0, 50)
    }
  }

  return { results, total }
}

export function useSearch() {
  return {
    index,
    isIndexing,
    indexingProgress,
    indexReady,
    buildIndex,
    search,
    highlightText
  }
}
