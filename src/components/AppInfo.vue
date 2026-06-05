<script setup>
import { useRouter } from 'vue-router'
import { useLanguage } from '../composables/useLanguage.js'

const router = useRouter()
const { t } = useLanguage()

function goToAbout() {
  router.push('/about')
}
</script>

<template>
  <div class="app-info">
    <button class="info-btn" @click="goToAbout" :title="t('app.info.title')">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <line x1="12" y1="16" x2="12" y2="12"/>
        <line x1="12" y1="8" x2="12.01" y2="8"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.app-info {
  position: fixed;
  top: 16px;
  right: 170px;
  z-index: 9999;
}

.info-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: var(--float-btn-bg);
  border: 1px solid var(--float-btn-border);
  border-radius: 50%;
  color: var(--float-btn-color);
  cursor: pointer;
  transition: all 0.2s;
  backdrop-filter: blur(8px);
}

.info-btn:hover {
  background: var(--float-btn-hover-bg);
  border-color: var(--float-btn-hover-border);
  color: var(--float-btn-hover-color);
}
</style>
