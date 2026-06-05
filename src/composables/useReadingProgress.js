import { ref, computed } from 'vue'

const STORAGE_KEY = 'ny-baiboly-reading-progress'

const lastRead = ref(null)

function load() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      lastRead.value = JSON.parse(stored)
    }
  } catch {
    lastRead.value = null
  }
}

function save() {
  if (lastRead.value) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lastRead.value))
  }
}

export function useReadingProgress() {
  load()

  const hasProgress = computed(() => !!lastRead.value)

  function updateProgress(bookId, bookName, chapter, verse) {
    lastRead.value = {
      bookId,
      bookName,
      chapter,
      verse: verse || 1,
      date: Date.now()
    }
    save()
  }

  function clearProgress() {
    lastRead.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  return {
    lastRead,
    hasProgress,
    updateProgress,
    clearProgress
  }
}
