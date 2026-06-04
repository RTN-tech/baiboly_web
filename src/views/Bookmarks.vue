<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookmarks } from '../composables/useBookmarks.js'

const router = useRouter()
const { bookmarks, bookmarkCount, removeBookmark, clearAll } = useBookmarks()

const sortedBookmarks = computed(() => {
  return [...bookmarks.value].sort((a, b) => b.dateAdded - a.dateAdded)
})

function goToVerse(bm) {
  router.push({ name: 'Read', params: { bookId: bm.bookId, chapter: bm.chapter.toString() }, query: { v: bm.verse.toString() } })
}

function confirmClear() {
  if (bookmarkCount.value === 0) return
  if (confirm('Hofafana daholo ve ny marque-pages rehetra?')) {
    clearAll()
  }
}
</script>

<template>
  <div class="bookmarks-page">
    <!-- Header -->
    <header class="bm-header">
      <div class="bm-header-inner">
        <button class="bm-back-btn" @click="router.push('/')" title="Indray">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div class="bm-header-title">
          <h1>Marque-pages</h1>
          <span class="bm-count">{{ bookmarkCount }} andininy</span>
        </div>
        <button
          v-if="bookmarkCount > 0"
          class="bm-clear-btn"
          @click="confirmClear"
          title="Fafao daholo"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
    </header>

    <div class="bm-body">
      <!-- Empty State -->
      <div v-if="bookmarkCount === 0" class="bm-empty">
        <div class="bm-empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
        </div>
        <h2>Tsy misy marque-pages</h2>
        <p>Tsindrio ny kisary <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> eo akaikin'ny andininy</p>
        <button class="bm-browse-btn" @click="router.push('/')">Hijery ny boky</button>
      </div>

      <!-- Bookmarks List -->
      <div v-else class="bm-list">
        <div v-for="bm in sortedBookmarks" :key="bm.id" class="bm-item" @click="goToVerse(bm)">
          <div class="bm-item-content">
            <span class="bm-ref">{{ bm.bookName }} {{ bm.chapter }}:{{ bm.verse }}</span>
            <p class="bm-text">{{ bm.text }}</p>
            <span class="bm-date">{{ new Date(bm.dateAdded).toLocaleDateString('mg-MG', { day: 'numeric', month: 'short', year: 'numeric' }) || new Date(bm.dateAdded).toLocaleDateString() }}</span>
          </div>
          <button
            class="bm-remove-btn"
            @click.stop="removeBookmark(bm.bookId, bm.chapter, bm.verse)"
            title="Esory"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bookmarks-page {
  min-height: 100vh;
  background: var(--bg-reader);
  transition: background 0.3s ease;
}

/* Header */
.bm-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-nav);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--reader-nav-border);
  transition: background 0.3s ease, border-color 0.3s ease;
}

.bm-header-inner {
  max-width: 780px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
}

.bm-back-btn {
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

.bm-back-btn:hover {
  background: var(--bg-nav-hover);
  color: var(--color-text-nav-hover);
}

.bm-header-title {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.bm-header-title h1 {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--nav-book-color);
  margin: 0;
}

.bm-count {
  font-size: 0.8rem;
  color: var(--color-text-tertiary);
  font-weight: 400;
}

.bm-clear-btn {
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

.bm-clear-btn:hover {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

/* Body */
.bm-body {
  max-width: 780px;
  margin: 0 auto;
  padding: 24px 20px 60px;
}

/* Empty */
.bm-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 20px;
  text-align: center;
}

.bm-empty-icon {
  color: var(--color-empty-icon);
  margin-bottom: 20px;
}

.bm-empty h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.4rem;
  color: var(--color-empty-heading);
  margin: 0 0 10px;
}

.bm-empty p {
  color: var(--color-empty-text);
  margin: 0 0 28px;
  font-size: 0.95rem;
  line-height: 1.6;
}

.bm-browse-btn {
  padding: 12px 28px;
  background: var(--back-btn-bg);
  color: var(--back-btn-color);
  border: none;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.bm-browse-btn:hover {
  background: var(--back-btn-hover);
  transform: translateY(-1px);
}

/* Bookmark Items */
.bm-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.bm-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 14px 16px;
  background: var(--bg-reader-card);
  border: 1px solid var(--border-reader);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.bm-item:hover {
  border-color: var(--border-accent);
  box-shadow: var(--shadow-result-hover);
  transform: translateX(3px);
}

.bm-item-content {
  flex: 1;
  min-width: 0;
}

.bm-ref {
  display: block;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-result-ref);
  margin-bottom: 4px;
  letter-spacing: 0.3px;
}

.bm-text {
  font-size: 0.92rem;
  color: var(--color-result-text);
  line-height: 1.6;
  margin: 0 0 6px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bm-date {
  font-size: 0.72rem;
  color: var(--color-text-tertiary);
}

.bm-remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: none;
  border: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  flex-shrink: 0;
  margin-top: 2px;
  opacity: 0;
}

.bm-item:hover .bm-remove-btn {
  opacity: 1;
}

.bm-remove-btn:hover {
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
}

@media (max-width: 600px) {
  .bm-body { padding: 16px 12px 40px; }
  .bm-item { padding: 12px 14px; }
  .bm-empty { padding: 80px 16px; }
  .bm-header-title h1 { font-size: 1.1rem; }
}
</style>
