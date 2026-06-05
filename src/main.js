import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
app.use(router)

// Wait for router to be ready, then mount
router.isReady().then(() => {
  app.mount('#app')

  // Fade out the splash screen
  setTimeout(() => {
    const splash = document.querySelector('.splash-screen')
    if (splash) {
      splash.classList.add('fade-out')
      // Remove splash from DOM after transition
      setTimeout(() => splash.remove(), 600)
    }
  }, 300)
})

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').then(reg => {
      console.log('Service worker registered:', reg.scope)
    }).catch(err => {
      console.warn('Service worker registration failed:', err.message)
    })
  })
}
