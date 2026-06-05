<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  bookId: String,
  bookName: String,
  chapter: Number,
  verse: Number,
  text: String
})

const emit = defineEmits(['close', 'navigate-chapter'])

const copied = ref(false)

async function copyVerse() {
  const content = `"${props.text}" — ${props.bookName} ${props.chapter}:${props.verse}`
  try {
    await navigator.clipboard.writeText(content)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch {
    // Fallback
    const textarea = document.createElement('textarea')
    textarea.value = content
    document.body.appendChild(textarea)
    textarea.select()
    document.execCommand('copy')
    document.body.removeChild(textarea)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  }
}

async function shareVerse() {
  const content = `"${props.text}" — ${props.bookName} ${props.chapter}:${props.verse}`
  if (navigator.share) {
    try {
      await navigator.share({
        title: `${props.bookName} ${props.chapter}:${props.verse}`,
        text: content
      })
    } catch {
      // User cancelled
    }
  } else {
    // Fallback to copy
    await copyVerse()
  }
}

function goToChapter() {
  emit('navigate-chapter', props.chapter)
}

function onKeydown(e) {
  if (e.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  window.addEventListener('keydown', onKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="verse-actions-overlay" @click.self="$emit('close')">
    <div class="verse-actions-card">
      <div class="verse-actions-header">
        <span class="verse-actions-ref">{{ bookName }} {{ chapter }}:{{ verse }}</span>
        <button class="verse-actions-close" @click="$emit('close')">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <p class="verse-actions-text">{{ text }}</p>
      <div class="verse-actions-buttons">
        <button class="va-btn" @click="copyVerse" :class="{ copied }">
          <svg v-if="!copied" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <span>{{ copied ? 'Voasoratra' : 'Soraty' }}</span>
        </button>
        <button class="va-btn" @click="shareVerse">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
          </svg>
          <span>Zara</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.verse-actions-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(6px);
  animation: overlayFadeIn 0.2s ease;
}

@keyframes overlayFadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.verse-actions-card {
  max-width: 400px;
  width: calc(100% - 40px);
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 16px;
  box-shadow: var(--shadow-elevated);
  animation: cardSlideIn 0.25s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateY(20px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.verse-actions-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px 0;
}

.verse-actions-ref {
  font-family: 'Playfair Display', serif;
  font-size: 0.9rem;
  font-weight: 700;
  color: #d4af37;
}

.verse-actions-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  border-radius: 6px;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all 0.2s;
}

.verse-actions-close:hover {
  background: var(--bg-icon-btn);
  color: var(--color-text);
}

.verse-actions-text {
  padding: 12px 20px;
  font-family: 'Inter', sans-serif;
  font-size: 0.92rem;
  color: var(--color-verse-text);
  line-height: 1.7;
  margin: 0;
}

.verse-actions-buttons {
  display: flex;
  gap: 8px;
  padding: 0 20px 16px;
}

.va-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 16px;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg-card);
  color: var(--color-text-secondary);
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.va-btn:hover {
  border-color: var(--border-accent);
  background: var(--bg-card-hover);
  color: #d4af37;
}

.va-btn.copied {
  border-color: rgba(46, 204, 113, 0.3);
  background: rgba(46, 204, 113, 0.08);
  color: #2ecc71;
}
</style>
