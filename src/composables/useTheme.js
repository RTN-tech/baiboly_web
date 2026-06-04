import { ref, watch, onMounted } from 'vue'

const THEME_KEY = 'ny-baiboly-theme'

const isDark = ref(true)
const isInitialized = ref(false)

function applyTheme(dark) {
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
}

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value
    applyTheme(isDark.value)
    localStorage.setItem(THEME_KEY, isDark.value ? 'dark' : 'light')
  }

  function setTheme(dark) {
    isDark.value = dark
    applyTheme(dark)
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
  }

  onMounted(() => {
    if (!isInitialized.value) {
      isInitialized.value = true
      const stored = localStorage.getItem(THEME_KEY)
      if (stored === 'light') {
        isDark.value = false
      }
      applyTheme(isDark.value)
    }
  })

  return {
    isDark,
    toggleTheme,
    setTheme
  }
}
