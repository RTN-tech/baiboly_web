<script setup>
import { useFontSize } from '../composables/useFontSize.js'

const { fontSize, increaseSize, decreaseSize, resetSize } = useFontSize()

defineProps({
  compact: { type: Boolean, default: false }
})
</script>

<template>
  <div class="font-size-control" :class="{ compact }">
    <button
      class="fs-btn"
      :disabled="fontSize <= 12"
      @click="decreaseSize"
      title="Henao kely ny soratra"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </button>

    <div class="fs-indicator" @click="resetSize" title="Averina amin'ny tany am-boalohany">
      <span class="fs-value">{{ fontSize }}</span>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
      </svg>
    </div>

    <button
      class="fs-btn"
      :disabled="fontSize >= 28"
      @click="increaseSize"
      title="Henao lehibe ny soratra"
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
    </button>
  </div>
</template>

<style scoped>
.font-size-control {
  display: flex;
  align-items: center;
  gap: 4px;
}

.fs-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--bg-icon-btn);
  border: 1px solid var(--border);
  border-radius: 8px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.fs-btn:hover:not(:disabled) {
  background: var(--bg-icon-btn-hover);
  color: var(--color-text);
}

.fs-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.fs-indicator {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 4px 10px;
  border-radius: 6px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-tertiary);
  min-width: 44px;
  justify-content: center;
}

.fs-indicator:hover {
  border-color: var(--border-accent);
  color: #d4af37;
}

.fs-value {
  min-width: 20px;
  text-align: center;
}

/* Compact mode */
.font-size-control.compact .fs-btn {
  width: 28px;
  height: 28px;
  border-radius: 6px;
}

.font-size-control.compact .fs-indicator {
  padding: 2px 8px;
  min-width: 36px;
  font-size: 0.7rem;
}
</style>
