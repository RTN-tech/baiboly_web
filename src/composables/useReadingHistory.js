import { ref, computed } from 'vue'

const STORAGE_KEY = 'ny-baiboly-reading-history'
const MAX_ENTRIES = 200

const history = ref([])

function load() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      history.value = JSON.parse(stored)
    }
  } catch {
    history.value = []
  }
}

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value))
}

export function useReadingHistory() {
  load()

  const historyCount = computed(() => history.value.length)
  const recentHistory = computed(() => history.value.slice(0, 50))
  const groupedByDate = computed(() => {
    const groups = {}
    for (const entry of history.value) {
      const date = new Date(entry.date).toLocaleDateString('mg-MG', {
        day: 'numeric', month: 'short', year: 'numeric'
      }) || new Date(entry.date).toLocaleDateString()
      if (!groups[date]) groups[date] = []
      groups[date].push(entry)
    }
    return groups
  })

  function addEntry(bookId, bookName, chapter, verse) {
    const entry = {
      id: `${bookId}-${chapter}-${verse}-${Date.now()}`,
      bookId,
      bookName: bookName || bookId,
      chapter,
      verse: verse || 1,
      date: Date.now()
    }

    // Remove duplicate (same book+chapter)
    const dupeIdx = history.value.findIndex(
      e => e.bookId === bookId && e.chapter === chapter
    )
    if (dupeIdx >= 0) {
      history.value.splice(dupeIdx, 1)
    }

    // Add to front
    history.value.unshift(entry)

    // Trim
    if (history.value.length > MAX_ENTRIES) {
      history.value = history.value.slice(0, MAX_ENTRIES)
    }

    save()
  }

  function clearHistory() {
    history.value = []
    save()
  }

  return {
    history,
    historyCount,
    recentHistory,
    groupedByDate,
    addEntry,
    clearHistory
  }
}
