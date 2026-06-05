<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookmarks } from '../composables/useBookmarks.js'
import { useReadingHistory } from '../composables/useReadingHistory.js'

const router = useRouter()
const { bookmarks, bookmarkCount, removeBookmark, clearAll } = useBookmarks()
const { recentHistory, groupedByDate, historyCount, clearHistory } = useReadingHistory()

const activeTab = ref('bookmarks') // 'bookmarks' or 'history'

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

function confirmClearHistory() {
  if (historyCount.value === 0) return
  if (confirm('Hofafana daholo ve ny tantaram-pamakiana?')) {
    clearHistory()
  }
}

function goToChapterEntry(entry) {
  router.push({
    name: 'Read',
    params: { bookId: entry.bookId, chapter: entry.chapter.toString() },
    query: entry.verse > 1 ? { v: entry.verse.toString() } : {}
  })
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
          <h1>{{ activeTab === 'bookmarks' ? 'Marque-pages' : 'Tantara' }}</h1>
          <span class="bm-count">{{ activeTab === 'bookmarks' ? bookmarkCount + ' andininy' : historyCount + ' famakiana' }}</span>
        </div>
        <button
          v-if="(activeTab === 'bookmarks' && bookmarkCount > 0) || (activeTab === 'history' && historyCount > 0)"
          class="bm-clear-btn"
          @click="activeTab === 'bookmarks' ? confirmClear() : confirmClearHistory()"
          :title="activeTab === 'bookmarks' ? 'Fafao daholo' : 'Fafao ny tantara'"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
    </header>

    <!-- Tabs -->
    <div class="bm-tabs">
      <button :class="['bm-tab', { active: activeTab === 'bookmarks' }]" @click="activeTab = 'bookmarks'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
        </svg>
        <span>Marque-pages</span>
        <span v-if="bookmarkCount > 0" class="tab-badge">{{ bookmarkCount }}</span>
      </button>
      <button :class="['bm-tab', { active: activeTab === 'history' }]" @click="activeTab = 'history'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>Histoire</span>
        <span v-if="historyCount > 0" class="tab-badge">{{ historyCount }}</span>
      </button>
    </div>

    <div class="bm-body">
      <!-- Bookmarks Tab -->
      <template v-if="activeTab === 'bookmarks'">
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
      </template>

      <!-- History Tab -->
      <template v-if="activeTab === 'history'">
        <!-- Empty History -->
        <div v-if="historyCount === 0" class="bm-empty">
          <div class="bm-empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <h2>Tsy misy tantara</h2>
          <p>Hisy ny tantaran'ny vakinao amin'ity pejy ity rehefa mamaky Baiboly</p>
          <button class="bm-browse-btn" @click="router.push('/')">Manomboka mamaky</button>
        </div>

        <!-- History List grouped by date -->
        <div v-else class="bm-list">
          <div v-for="(entries, date) in groupedByDate" :key="date" class="history-group">
            <div class="history-date">{{ date }}</div>
            <div
              v-for="entry in entries"
              :key="entry.id"
              class="bm-item"
              @click="goToChapterEntry(entry)"
            >
              <div class="bm-item-content">
                <span class="bm-ref">{{ entry.bookName }} Toko {{ entry.chapter }}</span>
                <span class="bm-date">{{ entry.verse > 1 ? 'Andininy ' + entry.verse : 'Toko ' + entry.chapter }}</span>
              </div>
            </div>
          </div>
        </div>
      </template>
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

/* Tabs */
.bm-tabs {
  display: flex;
  gap: 8px;
  max-width: 780px;
  margin: 16px auto 0;
  padding: 0 20px;
}

.bm-tab {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 16px;
  border: 2px solid var(--border-tab);
  border-radius: 12px;
  background: var(--tab-bg-inactive);
  color: var(--tab-color-inactive);
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.bm-tab:hover {
  border-color: var(--border-tab-hover);
  background: var(--bg-card-hover);
  color: var(--tab-color-hover);
}

.bm-tab.active {
  border-color: var(--border-tab-active);
  background: var(--tab-active-bg);
  color: #d4af37;
}

.tab-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: rgba(212, 175, 55, 0.15);
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
  color: #d4af37;
}

.bm-tab.active .tab-badge {
  background: rgba(212, 175, 55, 0.2);
}

/* History */
.history-group {
  margin-bottom: 16px;
}

.history-date {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: var(--color-text-tertiary);
  margin-bottom: 8px;
  padding: 0 4px;
}

/* Body */
.bm-body {
  max-width: 780px;
  margin: 0 auto;
  padding: 16px 20px 60px;
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
