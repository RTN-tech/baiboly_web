import { ref, onMounted, onUnmounted } from 'vue'

const installPrompt = ref(null)
const isInstalled = ref(false)
const canInstall = ref(false)

// Module-level capture: beforeinstallprompt fires early, before Vue mounts
let capturedPromptEvent = null

function moduleCaptureEvent(e) {
  e.preventDefault()
  capturedPromptEvent = e
}
window.addEventListener('beforeinstallprompt', moduleCaptureEvent, { once: true })

/**
 * Composable for PWA install prompt (beforeinstallprompt event).
 * Shared state so all components see the same install status.
 */
export function useInstallPrompt() {
  let mediaQuery = null

  // Check if already installed (display-mode: standalone)
  function checkInstalled() {
    isInstalled.value =
      window.matchMedia('(display-mode: standalone)').matches ||
      window.matchMedia('(display-mode: window-controls-overlay)').matches ||
      (window.navigator && window.navigator.standalone === true) // iOS
  }

  async function promptInstall() {
    if (!capturedPromptEvent) return

    // Show the native install prompt
    capturedPromptEvent.prompt()

    // Wait for user response
    const result = await capturedPromptEvent.userChoice
    capturedPromptEvent = null

    if (result.outcome === 'accepted') {
      isInstalled.value = true
      canInstall.value = false
    } else {
      // User dismissed — hide the badge for this session
      canInstall.value = false
    }
  }

  function onMediaChange(e) {
    if (e.matches) {
      isInstalled.value = true
      canInstall.value = false
    }
  }

  function onBeforeInstallPrompt(e) {
    e.preventDefault()
    capturedPromptEvent = e
    canInstall.value = true
  }

  function onAppInstalled() {
    isInstalled.value = true
    canInstall.value = false
    capturedPromptEvent = null
  }

  onMounted(() => {
    checkInstalled()

    // If the event already fired before Vue mounted, reflect it
    if (capturedPromptEvent && !isInstalled.value) {
      canInstall.value = true
    }

    // Listen for display mode changes (user installs the app)
    if ('matchMedia' in window) {
      mediaQuery = window.matchMedia('(display-mode: standalone)')
      mediaQuery.addEventListener('change', onMediaChange)
    }

    // Also register the event listener in case it hasn't fired yet
    window.addEventListener('beforeinstallprompt', onBeforeInstallPrompt)

    // App installed event
    window.addEventListener('appinstalled', onAppInstalled)
  })

  onUnmounted(() => {
    if (mediaQuery) {
      mediaQuery.removeEventListener('change', onMediaChange)
    }
    window.removeEventListener('beforeinstallprompt', onBeforeInstallPrompt)
    window.removeEventListener('appinstalled', onAppInstalled)
  })

  return {
    canInstall,
    isInstalled,
    promptInstall
  }
}
