import { ref, computed } from 'vue'

const STORAGE_KEY = 'ny-baiboly-bookmarks'

const bookmarks = ref([])
let loaded = false

function load() {
  if (loaded) return
  loaded = true
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      bookmarks.value = JSON.parse(stored)
    }
  } catch {
    bookmarks.value = []
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks.value))
}

export function useBookmarks() {
  load()

  const bookmarkCount = computed(() => bookmarks.value.length)

  function isBookmarked(bookId, chapter, verse) {
    return bookmarks.value.some(
      b => b.bookId === bookId && b.chapter === chapter && b.verse === verse
    )
  }

  function toggleBookmark(bookId, chapter, verse, { bookName, text } = {}) {
    const idx = bookmarks.value.findIndex(
      b => b.bookId === bookId && b.chapter === chapter && b.verse === verse
    )

    if (idx >= 0) {
      bookmarks.value.splice(idx, 1)
    } else {
      bookmarks.value.push({
        id: `${bookId}-${chapter}-${verse}`,
        bookId,
        bookName: bookName || bookId,
        chapter,
        verse,
        text: text || '',
        dateAdded: Date.now()
      })
    }
    save()
  }

  function removeBookmark(bookId, chapter, verse) {
    const idx = bookmarks.value.findIndex(
      b => b.bookId === bookId && b.chapter === chapter && b.verse === verse
    )
    if (idx >= 0) {
      bookmarks.value.splice(idx, 1)
      save()
    }
  }

  function clearAll() {
    bookmarks.value = []
    save()
  }

  return {
    bookmarks,
    bookmarkCount,
    isBookmarked,
    toggleBookmark,
    removeBookmark,
    clearAll
  }
}
