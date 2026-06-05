import { ref, watch, onMounted } from 'vue'

const STORAGE_KEY = 'ny-baiboly-font-size'
const DEFAULT_SIZE = 16

const fontSize = ref(DEFAULT_SIZE)

function applySize(size) {
  document.documentElement.style.setProperty('--reader-font-size', `${size}px`)
}

function load() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const val = parseInt(stored)
      if (val >= 12 && val <= 28) {
        fontSize.value = val
      }
    }
  } catch {
    // ignore
  }
}

export function useFontSize() {
  load()
  applySize(fontSize.value)

  const isInitialized = ref(false)

  onMounted(() => {
    if (!isInitialized.value) {
      isInitialized.value = true
      applySize(fontSize.value)
    }
  })

  function increaseSize() {
    if (fontSize.value < 28) {
      fontSize.value += 2
      applySize(fontSize.value)
      localStorage.setItem(STORAGE_KEY, fontSize.value.toString())
    }
  }

  function decreaseSize() {
    if (fontSize.value > 12) {
      fontSize.value -= 2
      applySize(fontSize.value)
      localStorage.setItem(STORAGE_KEY, fontSize.value.toString())
    }
  }

  function resetSize() {
    fontSize.value = DEFAULT_SIZE
    applySize(DEFAULT_SIZE)
    localStorage.setItem(STORAGE_KEY, DEFAULT_SIZE.toString())
  }

  return {
    fontSize,
    increaseSize,
    decreaseSize,
    resetSize
  }
}
