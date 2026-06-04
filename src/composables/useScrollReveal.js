import { ref, onMounted, onUnmounted } from 'vue'

export function useScrollReveal(options = {}) {
  const targetRef = ref(null)
  const isVisible = ref(false)

  let observer = null

  onMounted(() => {
    const el = targetRef.value
    if (!el) return

    observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible.value = true
          if (observer && el) {
            observer.unobserve(el)
          }
        }
      },
      {
        threshold: options.threshold ?? 0.08,
        rootMargin: options.rootMargin ?? '0px 0px -60px 0px'
      }
    )
    observer.observe(el)
  })

  onUnmounted(() => {
    if (observer) {
      observer.disconnect()
    }
  })

  return { targetRef, isVisible }
}
