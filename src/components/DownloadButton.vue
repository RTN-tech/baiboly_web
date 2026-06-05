<script setup>
import { ref, onMounted } from 'vue'
import { useOfflineData } from '../composables/useOfflineData.js'
import { useLanguage } from '../composables/useLanguage.js'

const props = defineProps({
  compact: { type: Boolean, default: false }
})

const {
  isDownloading,
  downloadProgress,
  downloadComplete,
  downloadError,
  downloadAll,
  checkOfflineStatus
} = useOfflineData()
const { t } = useLanguage()

const showTooltip = ref(false)

onMounted(() => {
  checkOfflineStatus()
})

async function handleDownload() {
  if (downloadComplete.value) {
    showTooltip.value = true
    setTimeout(() => { showTooltip.value = false }, 3000)
    return
  }
  await downloadAll()
}

function formatProgress() {
  const pct = Math.round((downloadProgress.value.loaded / downloadProgress.value.total) * 100)
  return t('download.progress', { loaded: downloadProgress.value.loaded, total: downloadProgress.value.total, pct })
}
</script>

<template>
  <div class="download-btn-wrapper" :class="{ compact }">
    <button
      class="download-btn"
      :class="{ downloading: isDownloading, complete: downloadComplete }"
      :disabled="isDownloading"
      @click="handleDownload"
      :title="downloadComplete ? t('download.complete.tooltip') : t('download.tooltip')"
    >
      <!-- Spinny loader when downloading -->
      <svg v-if="isDownloading" class="spin-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
      </svg>

      <!-- Check mark when complete -->
      <svg v-else-if="downloadComplete" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"/>
      </svg>

      <!-- Download arrow otherwise -->
      <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>

      <span class="download-btn-text">
        <template v-if="isDownloading && compact">{{ t('download.downloading').split('...')[0] }}</template>
        <template v-else-if="isDownloading">{{ t('download.downloading') }}</template>
        <template v-else-if="downloadComplete && compact">{{ t('download.complete') }}</template>
        <template v-else-if="downloadComplete">{{ t('download.complete') }}</template>
        <template v-else-if="compact"></template>
        <template v-else>{{ t('download.label') }}</template>
      </span>
    </button>

    <!-- Progress bar (visible only when downloading) -->
    <div v-if="isDownloading && !compact" class="download-progress-wrapper">
      <div class="download-progress-bar">
        <div class="download-progress-fill" :style="{ width: `${(downloadProgress.loaded / downloadProgress.total) * 100}%` }"></div>
      </div>
      <span class="download-progress-text">{{ formatProgress() }}</span>
    </div>

    <!-- Error message -->
    <div v-if="downloadError" class="download-error">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
      {{ downloadError }}
    </div>

    <!-- Tooltip "déjà téléchargé" -->
    <Transition name="tooltip">
      <div v-if="showTooltip" class="download-tooltip">{{ t('download.complete.tooltip') }}</div>
    </Transition>
  </div>
</template>

<style scoped>
.download-btn-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  gap: 10px;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border: 1px solid var(--border-tab);
  border-radius: 10px;
  background: var(--tab-bg-inactive);
  color: var(--tab-color-inactive);
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.download-btn:hover:not(:disabled) {
  border-color: var(--border-tab-hover);
  background: var(--bg-card-hover);
  color: var(--tab-color-hover);
  transform: translateY(-1px);
}

.download-btn:active:not(:disabled) {
  transform: translateY(0);
}

.download-btn.complete {
  border-color: rgba(46, 204, 113, 0.3);
  background: rgba(46, 204, 113, 0.08);
  color: #2ecc71;
}

.download-btn.complete:hover {
  border-color: rgba(46, 204, 113, 0.5);
  background: rgba(46, 204, 113, 0.12);
}

.download-btn.downloading {
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
  cursor: not-allowed;
}

.download-btn:disabled {
  opacity: 0.7;
}

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.download-btn-text {
  line-height: 1;
}

/* Compact variant (for nav bars) */
.download-btn-wrapper.compact .download-btn {
  padding: 8px;
  border-radius: 10px;
  width: 40px;
  height: 40px;
  justify-content: center;
}

.download-btn-wrapper.compact .download-btn-text {
  display: none;
}

@media (max-width: 640px) {
  .download-btn-wrapper.compact .download-btn {
    width: 40px;
    height: 40px;
    padding: 8px;
  }
  .download-btn-wrapper.compact .download-btn-text {
    display: none;
  }
}

/* Progress */
.download-progress-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.download-progress-bar {
  width: 100px;
  height: 5px;
  background: var(--progress-track);
  border-radius: 3px;
  overflow: hidden;
}

.download-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4af37, #c9a032);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.download-progress-text {
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  white-space: nowrap;
}

/* Error */
.download-error {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: #e74c3c;
}

/* Tooltip */
.download-tooltip {
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-elevated);
  color: var(--color-text);
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 0.78rem;
  white-space: nowrap;
  border: 1px solid var(--border);
  box-shadow: var(--shadow-elevated);
  z-index: 100;
}

.download-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: var(--bg-elevated);
}

.tooltip-enter-active,
.tooltip-leave-active {
  transition: opacity 0.2s ease, transform 0.2s ease;
}

.tooltip-enter-from,
.tooltip-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}
</style>
