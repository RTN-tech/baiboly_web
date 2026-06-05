<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useLanguage } from '../composables/useLanguage.js'

const { current, supported, t, setLanguage } = useLanguage()
const open = ref(false)
const toggleRef = ref(null)

function select(lang) {
  setLanguage(lang)
  open.value = false
}

function toggle() {
  open.value = !open.value
}

function onDocumentClick(e) {
  if (open.value && toggleRef.value && !toggleRef.value.contains(e.target)) {
    open.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onDocumentClick)
})

onUnmounted(() => {
  document.removeEventListener('click', onDocumentClick)
})
</script>

<template>
  <div ref="toggleRef" class="lang-toggle">
    <button class="lang-btn" @click="toggle" :title="t('app.name')">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
      </svg>
      <span class="lang-current">{{ current.toUpperCase() }}</span>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9l6 6 6-6"/></svg>
    </button>

    <Transition name="lang-drop">
      <div v-if="open" class="lang-dropdown">
        <button
          v-for="lang in supported"
          :key="lang"
          :class="['lang-option', { active: lang === current }]"
          @click="select(lang)"
        >
          <span class="lang-flag">{{ lang === 'mg' ? '🇲🇬' : lang === 'fr' ? '🇫🇷' : '🇬🇧' }}</span>
          <span>{{ t(`app.lang.${lang}`) }}</span>
          <svg v-if="lang === current" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </button>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.lang-toggle {
  position: fixed;
  top: 16px;
  right: 74px;
  z-index: 9999;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-family: 'Inter', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  transition: all 0.2s;
  backdrop-filter: blur(8px);
}

.lang-btn:hover {
  background: rgba(212, 175, 55, 0.15);
  border-color: rgba(212, 175, 55, 0.35);
  color: #d4af37;
}

.lang-current {
  min-width: 20px;
  text-align: center;
}

.lang-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  min-width: 180px;
  overflow: hidden;
}

.lang-option {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 14px;
  background: none;
  border: none;
  color: var(--color-text);
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.15s;
  text-align: left;
}

.lang-option:hover {
  background: var(--bg-card-hover);
}

.lang-option.active {
  background: rgba(212, 175, 55, 0.06);
  color: #d4af37;
  font-weight: 600;
}

.lang-flag {
  font-size: 1.1rem;
}

.lang-drop-enter-active,
.lang-drop-leave-active {
  transition: all 0.2s ease;
}

.lang-drop-enter-from,
.lang-drop-leave-to {
  opacity: 0;
  transform: translateY(-6px) scale(0.95);
}
</style>
