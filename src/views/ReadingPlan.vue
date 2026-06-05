<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useLanguage } from '../composables/useLanguage.js'
import { useReadingPlan } from '../composables/useReadingPlan.js'

const router = useRouter()
const { t } = useLanguage()
const { plans, progress, activePlan, todayReadings, totalDays, daysCompleted, percentComplete, startPlan, completeToday, resetPlan } = useReadingPlan()

const showPlans = ref(true)

function confirmReset() {
  if (confirm(t('bookmarks.clear.confirm'))) {
    resetPlan()
    showPlans.value = true
  }
}

function handleStartPlan(planId) {
  startPlan(planId)
  showPlans.value = false
}

function goToReading(reading) {
  router.push({ name: 'Read', params: { bookId: reading.bookId, chapter: reading.chapter.toString() } })
}

function handleCompleteToday() {
  completeToday()
}
</script>

<template>
  <div class="plan-page">
    <!-- Header -->
    <header class="plan-header">
      <div class="plan-header-inner">
        <button class="plan-back-btn" @click="router.push('/')" :title="t('reader.back')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div class="plan-header-title">
          <h1>{{ t('plan.title') }}</h1>
        </div>
        <button v-if="activePlan" class="plan-reset-btn" @click="confirmReset" :title="t('plan.reset')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
          </svg>
        </button>
      </div>
    </header>

    <div class="plan-body">
      <!-- Plan Selection -->
      <div v-if="showPlans || !activePlan" class="plans-list">
        <h2 class="plans-heading">{{ t('plan.choose') }}</h2>
        <div
          v-for="plan in plans"
          :key="plan.id"
          class="plan-card"
          @click="handleStartPlan(plan.id)"
        >
          <div class="plan-card-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="plan-card-info">
            <span class="plan-card-name">{{ t(plan.nameKey) }}</span>
            <span class="plan-card-desc">{{ t(plan.descKey) }}</span>
            <span class="plan-card-days">{{ plan.days }} {{ t('plan.day').toLowerCase() }}</span>
          </div>
          <svg class="plan-card-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
          </svg>
        </div>
      </div>

      <!-- Active Plan Progress -->
      <div v-else-if="activePlan" class="plan-progress">
        <!-- Progress Bar -->
        <div class="plan-progress-card">
          <div class="plan-progress-header">
            <span class="plan-progress-label">{{ t('plan.progress') }}</span>
            <span class="plan-progress-pct">{{ percentComplete }}%</span>
          </div>
          <div class="plan-progress-bar">
            <div class="plan-progress-fill" :style="{ width: percentComplete + '%' }"></div>
          </div>
          <div class="plan-progress-stats">
            <span>{{ daysCompleted }} / {{ totalDays }} {{ t('plan.day').toLowerCase() }}</span>
          </div>
        </div>

        <!-- Today's Reading -->
        <div class="plan-today">
          <h3 class="plan-today-title">
            {{ t('plan.today') }}
            <span class="plan-today-day">{{ t('plan.day') }} {{ progress.currentDay + 1 }}</span>
          </h3>

          <div v-if="todayReadings.length === 0" class="plan-empty">
            <p>{{ t('plan.noplan') }}</p>
          </div>

          <div v-else class="plan-readings">
            <div
              v-for="(reading, i) in todayReadings"
              :key="i"
              class="plan-reading-item"
              @click="goToReading(reading)"
            >
              <div class="plan-reading-num">{{ i + 1 }}</div>
              <div class="plan-reading-info">
                <span class="plan-reading-book">{{ reading.bookName }}</span>
                <span class="plan-reading-ch">{{ t('reader.chapter') }} {{ reading.chapter }}</span>
              </div>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </div>

          <div class="plan-actions">
            <button class="plan-done-btn" @click="handleCompleteToday" :disabled="progress.completedDays.includes(progress.currentDay)">
              <svg v-if="progress.completedDays.includes(progress.currentDay)" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              <span>{{ progress.completedDays.includes(progress.currentDay) ? t('plan.complete') : t('plan.markdone') }}</span>
            </button>
            <button class="plan-change-btn" @click="showPlans = true">{{ t('nav.reset') }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.plan-page {
  min-height: 100vh;
  background: var(--bg-app);
  transition: background 0.3s ease;
}

.plan-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-nav);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--reader-nav-border);
}

.plan-header-inner {
  max-width: 780px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.plan-back-btn, .plan-reset-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  color: var(--reader-nav-text);
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s;
  flex-shrink: 0;
}

.plan-back-btn:hover, .plan-reset-btn:hover {
  background: var(--bg-nav-hover);
  color: var(--color-text-nav-hover);
}

.plan-header-title {
  flex: 1;
}

.plan-header-title h1 {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--nav-book-color);
  margin: 0;
}

.plan-body {
  max-width: 780px;
  margin: 0 auto;
  padding: 20px 20px 60px;
}

/* Plan List */
.plans-heading {
  font-family: 'Playfair Display', serif;
  font-size: 1.2rem;
  color: var(--color-text);
  margin: 0 0 16px;
}

.plans-list {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.plan-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: var(--bg-reader-card);
  border: 1px solid var(--border-reader);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 12px;
}

.plan-card:hover {
  border-color: var(--border-accent);
  box-shadow: var(--shadow-result-hover);
  transform: translateY(-1px);
}

.plan-card-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--tab-active-bg);
  border-radius: 12px;
  color: #d4af37;
  flex-shrink: 0;
}

.plan-card-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.plan-card-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
}

.plan-card-desc {
  font-size: 0.78rem;
  color: var(--color-text-tertiary);
}

.plan-card-days {
  font-size: 0.72rem;
  color: #d4af37;
  font-weight: 500;
  margin-top: 2px;
}

.plan-card-arrow {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.plan-card:hover .plan-card-arrow {
  color: #d4af37;
  transform: translateX(2px);
  transition: all 0.2s;
}

/* Progress */
.plan-progress-card {
  background: var(--bg-reader-card);
  border: 1px solid var(--border-reader);
  border-radius: 14px;
  padding: 20px;
  margin-bottom: 24px;
}

.plan-progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.plan-progress-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
}

.plan-progress-pct {
  font-size: 1.2rem;
  font-weight: 700;
  color: #d4af37;
}

.plan-progress-bar {
  height: 6px;
  background: var(--bg-progress);
  border-radius: 3px;
  overflow: hidden;
  margin-bottom: 10px;
}

.plan-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4af37, #c9a032);
  border-radius: 3px;
  transition: width 0.5s ease;
}

.plan-progress-stats {
  font-size: 0.78rem;
  color: var(--color-text-tertiary);
}

/* Today's Reading */
.plan-today-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  color: var(--color-text);
  margin: 0 0 16px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.plan-today-day {
  font-family: 'Inter', sans-serif;
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--color-text-tertiary);
}

.plan-empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-tertiary);
}

.plan-readings {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
}

.plan-reading-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  background: var(--bg-reader-card);
  border: 1px solid var(--border-reader);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.plan-reading-item:hover {
  border-color: var(--border-accent);
  transform: translateX(3px);
}

.plan-reading-num {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--tab-active-bg);
  border-radius: 50%;
  font-size: 0.8rem;
  font-weight: 700;
  color: #d4af37;
  flex-shrink: 0;
}

.plan-reading-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.plan-reading-book {
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--color-text);
}

.plan-reading-ch {
  font-size: 0.78rem;
  color: var(--color-text-tertiary);
}

.plan-reading-item svg {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.plan-reading-item:hover svg {
  color: #d4af37;
  transition: all 0.2s;
}

/* Actions */
.plan-actions {
  display: flex;
  gap: 10px;
}

.plan-done-btn, .plan-change-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 12px;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.plan-done-btn {
  background: linear-gradient(135deg, #d4af37, #c9a032);
  border: none;
  color: #1a1a2e;
}

.plan-done-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(212, 175, 55, 0.3);
}

.plan-done-btn:disabled {
  opacity: 0.6;
  cursor: default;
}

.plan-change-btn {
  background: none;
  border: 1px solid var(--border);
  color: var(--color-text-secondary);
}

.plan-change-btn:hover {
  border-color: var(--border-accent);
  color: #d4af37;
}

@media (max-width: 600px) {
  .plan-body { padding: 16px 12px 40px; }
  .plan-card { padding: 14px; }
}
</style>
