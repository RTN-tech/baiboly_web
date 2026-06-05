<script setup>
import { ref } from 'vue'
import { useInstallPrompt } from '../composables/useInstallPrompt.js'

const { canInstall, isInstalled, promptInstall } = useInstallPrompt()

const dismissed = ref(false)
const installing = ref(false)

async function handleInstall() {
  installing.value = true
  try {
    await promptInstall()
  } finally {
    installing.value = false
  }
}

function handleDismiss() {
  dismissed.value = true
  // Re-show after 7 days (in production, use localStorage with a timestamp)
}
</script>

<template>
  <Transition name="install-slide">
    <div
      v-if="canInstall && !dismissed && !isInstalled"
      class="install-badge"
      role="banner"
      aria-label="Install the app"
    >
      <div class="install-badge-content">
        <div class="install-badge-icon">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
        </div>
        <div class="install-badge-text">
          <span class="install-badge-title">Ampidiro amin'ny efijery</span>
          <span class="install-badge-sub">Tadiavo haingana kokoa</span>
        </div>
        <button
          class="install-badge-btn"
          :disabled="installing"
          @click="handleInstall"
        >
          {{ installing ? '...' : 'Install' }}
        </button>
        <button
          class="install-badge-close"
          @click="handleDismiss"
          title="Aza atao izao"
          aria-label="Dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.install-badge {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  max-width: 440px;
  width: calc(100% - 32px);
}

.install-badge-content {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  background: var(--bg-elevated, #25254a);
  border: 1px solid var(--border-accent, rgba(212, 175, 55, 0.25));
  border-radius: 14px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(212, 175, 55, 0.1);
  backdrop-filter: blur(16px);
}

.install-badge-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  background: rgba(212, 175, 55, 0.12);
  border-radius: 10px;
  color: #d4af37;
}

.install-badge-text {
  flex: 1;
  min-width: 0;
}

.install-badge-title {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text, #f5f5f5);
  line-height: 1.3;
}

.install-badge-sub {
  display: block;
  font-size: 0.72rem;
  color: var(--color-text-tertiary, rgba(255, 255, 255, 0.5));
  margin-top: 1px;
}

.install-badge-btn {
  padding: 8px 16px;
  border: none;
  border-radius: 8px;
  background: #d4af37;
  color: #1a1a2e;
  font-family: 'Inter', -apple-system, sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  flex-shrink: 0;
}

.install-badge-btn:hover {
  background: #c9a432;
  transform: translateY(-1px);
}

.install-badge-btn:active {
  transform: translateY(0);
}

.install-badge-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.install-badge-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  background: none;
  border: none;
  border-radius: 6px;
  color: var(--color-text-tertiary, rgba(255, 255, 255, 0.4));
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.install-badge-close:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-text, #f5f5f5);
}

/* Transition */
.install-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.install-slide-leave-active {
  transition: all 0.25s ease;
}

.install-slide-enter-from {
  opacity: 0;
  transform: translateX(-50%) translateY(24px) scale(0.95);
}

.install-slide-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(16px) scale(0.95);
}
</style>
