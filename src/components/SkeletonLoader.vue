<script setup>
defineProps({
  type: {
    type: String,
    default: 'text',
    validator: v => ['text', 'card', 'chapter', 'verse-row'].includes(v)
  },
  lines: { type: Number, default: 3 },
  count: { type: Number, default: 1 }
})
</script>

<template>
  <div class="skeleton-container">
    <!-- Text skeleton -->
    <div v-if="type === 'text'" class="skeleton-text" :class="`lines-${lines}`">
      <div v-for="i in lines" :key="i" class="skeleton-line" :style="{ width: i === lines ? '60%' : '100%' }"></div>
    </div>

    <!-- Card skeleton -->
    <div v-if="type === 'card'" class="skeleton-cards">
      <div v-for="i in count" :key="i" class="skeleton-card">
        <div class="skeleton-card-icon"></div>
        <div class="skeleton-card-text">
          <div class="skeleton-line" style="width: 70%"></div>
          <div class="skeleton-line" style="width: 40%"></div>
        </div>
      </div>
    </div>

    <!-- Chapter grid skeleton -->
    <div v-if="type === 'chapter'" class="skeleton-chapter-grid">
      <div v-for="i in count" :key="i" class="skeleton-chapter-item"></div>
    </div>

    <!-- Verse row skeleton -->
    <div v-if="type === 'verse-row'" class="skeleton-verse-rows">
      <div v-for="i in count" :key="i" class="skeleton-verse-row">
        <div class="skeleton-verse-num"></div>
        <div class="skeleton-verse-content">
          <div class="skeleton-line" style="width: 100%"></div>
          <div class="skeleton-line" style="width: 85%"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.skeleton-container {
  width: 100%;
}

/* Generic skeleton line */
.skeleton-line {
  height: 12px;
  background: var(--skeleton-color, var(--border));
  border-radius: 6px;
  margin-bottom: 10px;
  background: linear-gradient(
    90deg,
    var(--skeleton-color, var(--border)) 25%,
    var(--skeleton-shimmer, rgba(212, 175, 55, 0.06)) 50%,
    var(--skeleton-color, var(--border)) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

/* Text skeleton */
.skeleton-text.lines-1 .skeleton-line:last-child,
.skeleton-text.lines-2 .skeleton-line:last-child {
  width: 60% !important;
}

/* Card skeleton */
.skeleton-cards {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.skeleton-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.skeleton-card-icon {
  width: 24px;
  height: 24px;
  background: var(--skeleton-color, var(--border));
  border-radius: 6px;
  flex-shrink: 0;
  background: linear-gradient(
    90deg,
    var(--skeleton-color, var(--border)) 25%,
    var(--skeleton-shimmer, rgba(212, 175, 55, 0.06)) 50%,
    var(--skeleton-color, var(--border)) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-card-text {
  flex: 1;
}

/* Chapter grid skeleton */
.skeleton-chapter-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(52px, 1fr));
  gap: 8px;
}

.skeleton-chapter-item {
  aspect-ratio: 1;
  border-radius: 10px;
  background: var(--skeleton-color, var(--border));
  background: linear-gradient(
    90deg,
    var(--skeleton-color, var(--border)) 25%,
    var(--skeleton-shimmer, rgba(212, 175, 55, 0.06)) 50%,
    var(--skeleton-color, var(--border)) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

/* Verse rows skeleton */
.skeleton-verse-rows {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.skeleton-verse-row {
  display: flex;
  gap: 10px;
  padding: 8px 0;
}

.skeleton-verse-num {
  width: 20px;
  height: 14px;
  flex-shrink: 0;
  border-radius: 4px;
  background: var(--skeleton-color, var(--border));
  background: linear-gradient(
    90deg,
    var(--skeleton-color, var(--border)) 25%,
    var(--skeleton-shimmer, rgba(212, 175, 55, 0.06)) 50%,
    var(--skeleton-color, var(--border)) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-verse-content {
  flex: 1;
}

@media (prefers-reduced-motion: reduce) {
  .skeleton-line,
  .skeleton-card-icon,
  .skeleton-chapter-item,
  .skeleton-verse-num {
    animation: none;
  }
}
</style>
