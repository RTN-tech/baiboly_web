<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useBookmarks } from '../composables/useBookmarks.js'
import { useReadingHistory } from '../composables/useReadingHistory.js'
import { useLanguage } from '../composables/useLanguage.js'

const router = useRouter()
const { bookmarks, bookmarkCount, removeBookmark, clearAll, updateBookmarkColor } = useBookmarks()
const { recentHistory, groupedByDate, historyCount, clearHistory } = useReadingHistory()
const { t } = useLanguage()

const BOOKMARK_COLORS = {
  gold: '#d4af37',
  red: '#e74c3c',
  blue: '#3498db',
  green: '#2ecc71',
  purple: '#9b59b6',
  pink: '#e91e63'
}

const activeTab = ref('bookmarks') // 'bookmarks' or 'history'
const colorFilter = ref(null) // null = all, or color name

const sortedBookmarks = computed(() => {
  return [...bookmarks.value].sort((a, b) => b.dateAdded - a.dateAdded)
})

const filteredBookmarks = computed(() => {
  if (!colorFilter.value) return sortedBookmarks.value
  return sortedBookmarks.value.filter(b => b.color === colorFilter.value)
})

const colorCounts = computed(() => {
  const counts = {}
  for (const bm of bookmarks.value) {
    const c = bm.color || 'none'
    counts[c] = (counts[c] || 0) + 1
  }
  return counts
})

function goToVerse(bm) {
  router.push({ name: 'Read', params: { bookId: bm.bookId, chapter: bm.chapter.toString() }, query: { v: bm.verse.toString() } })
}

function confirmClear() {
  if (bookmarkCount.value === 0) return
  if (confirm(t('bookmarks.clear.confirm'))) {
    clearAll()
  }
}

function confirmClearHistory() {
  if (historyCount.value === 0) return
  if (confirm(t('bookmarks.history.clear.confirm'))) {
    clearHistory()
  }
}

const COLOR_NAMES = ['gold', 'red', 'blue', 'green', 'purple', 'pink', null]

function cycleColor(bm) {
  const currentIdx = COLOR_NAMES.indexOf(bm.color)
  const nextColor = COLOR_NAMES[(currentIdx + 1) % COLOR_NAMES.length]
  updateBookmarkColor(bm.bookId, bm.chapter, bm.verse, nextColor)
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
        <button class="bm-back-btn" @click="router.push('/')" :title="t('reader.back')">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>
        <div class="bm-header-title">
          <h1>{{ activeTab === 'bookmarks' ? t('bookmarks.title') : t('bookmarks.history.title') }}</h1>
          <span class="bm-count">{{ activeTab === 'bookmarks' ? bookmarkCount + ' ' + t('bookmarks.verses') : historyCount + ' ' + t('bookmarks.famakiana') }}</span>
        </div>
        <button
          v-if="(activeTab === 'bookmarks' && bookmarkCount > 0) || (activeTab === 'history' && historyCount > 0)"
          class="bm-clear-btn"
          @click="activeTab === 'bookmarks' ? confirmClear() : confirmClearHistory()"
          :title="activeTab === 'bookmarks' ? t('bookmarks.clear') : t('bookmarks.history.title')"
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
        <span>{{ t('bookmarks.tab.bookmarks') }}</span>
        <span v-if="bookmarkCount > 0" class="tab-badge">{{ bookmarkCount }}</span>
      </button>
      <button :class="['bm-tab', { active: activeTab === 'history' }]" @click="activeTab = 'history'">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
        </svg>
        <span>{{ t('bookmarks.tab.history') }}</span>
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
          <h2>{{ t('bookmarks.empty.title') }}</h2>
          <p>{{ t('bookmarks.empty.desc') }} <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:inline;vertical-align:middle"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/></svg> eo akaikin'ny andininy</p>
          <button class="bm-browse-btn" @click="router.push('/')">{{ t('bookmarks.browse') }}</button>
        </div>

        <!-- Color Filter -->
        <div v-if="bookmarkCount > 0" class="bm-filter">
          <button
            :class="['bm-filter-btn', { active: !colorFilter }]"
            @click="colorFilter = null"
          >
            <span class="bm-filter-dot all"></span>
            <span>{{ t('search.filter.all') }}</span>
            <span class="bm-filter-count">{{ bookmarkCount }}</span>
          </button>
          <button
            v-for="(hex, name) in BOOKMARK_COLORS"
            :key="name"
            :class="['bm-filter-btn', { active: colorFilter === name }]"
            @click="colorFilter = colorFilter === name ? null : name"
          >
            <span class="bm-filter-dot" :style="{ background: hex }"></span>
            <span>{{ t('bookmark.color.' + name) }}</span>
            <span class="bm-filter-count">{{ colorCounts[name] || 0 }}</span>
          </button>
        </div>

        <!-- Filtered empty state -->
        <div v-if="bookmarkCount > 0 && filteredBookmarks.length === 0" class="bm-empty bm-empty-small">
          <p>{{ t('search.noResults.hint') }}</p>
          <button class="bm-browse-btn" @click="colorFilter = null" style="margin-top:12px">{{ t('search.filter.all') }}</button>
        </div>

        <!-- Bookmarks List -->
        <div v-if="filteredBookmarks.length > 0" class="bm-list">
          <div v-for="bm in filteredBookmarks" :key="bm.id" class="bm-item" @click="goToVerse(bm)">
            <div class="bm-color-col">
              <button
                class="bm-color-dot"
                :style="{ background: bm.color ? BOOKMARK_COLORS[bm.color] : 'transparent', borderColor: bm.color ? BOOKMARK_COLORS[bm.color] : 'var(--color-text-tertiary)' }"
                @click.stop="cycleColor(bm)"
                :title="t('bookmark.color.' + (bm.color || 'none'))"
              ></button>
            </div>
            <div class="bm-item-content">
              <span class="bm-ref">{{ bm.bookName }} {{ bm.chapter }}:{{ bm.verse }}</span>
              <p class="bm-text">{{ bm.text }}</p>
              <span class="bm-date">{{ new Date(bm.dateAdded).toLocaleDateString('mg-MG', { day: 'numeric', month: 'short', year: 'numeric' }) || new Date(bm.dateAdded).toLocaleDateString() }}</span>
            </div>
            <button
              class="bm-remove-btn"
              @click.stop="removeBookmark(bm.bookId, bm.chapter, bm.verse)"
              :title="t('bookmarks.remove')"
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
          <h2>{{ t('bookmarks.history.empty.title') }}</h2>
          <p>{{ t('bookmarks.history.empty.desc') }}</p>
          <button class="bm-browse-btn" @click="router.push('/')">{{ t('bookmarks.history.start') }}</button>
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
                <span class="bm-ref">{{ entry.bookName }} {{ t('reader.chapter') }} {{ entry.chapter }}</span>
                <span class="bm-date">{{ entry.verse > 1 ? t('reader.chapter') + ' ' + entry.verse : t('reader.chapter') + ' ' + entry.chapter }}</span>
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

/* Color Filter */
.bm-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.bm-filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 10px;
  background: var(--bg-icon-btn);
  border: 1px solid var(--border);
  border-radius: 20px;
  color: var(--color-text-secondary);
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.bm-filter-btn:hover {
  border-color: var(--border-accent);
  background: var(--bg-card-hover);
  color: #d4af37;
}

.bm-filter-btn.active {
  border-color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
}

.bm-filter-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}

.bm-filter-dot.all {
  border: 2px solid var(--color-text-tertiary);
  background: transparent;
}

.bm-filter-count {
  font-size: 0.68rem;
  opacity: 0.7;
}

.bm-empty-small {
  padding: 40px 20px;
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

/* Color dot column */
.bm-color-col {
  display: flex;
  align-items: flex-start;
  padding-top: 4px;
  flex-shrink: 0;
}

.bm-color-dot {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  border: 2px solid;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
  flex-shrink: 0;
}

.bm-color-dot:hover {
  transform: scale(1.35);
  box-shadow: 0 0 8px rgba(212, 175, 55, 0.3);
}

@media (max-width: 600px) {
  .bm-body { padding: 16px 12px 40px; }
  .bm-item { padding: 12px 14px; }
  .bm-empty { padding: 80px 16px; }
  .bm-header-title h1 { font-size: 1.1rem; }
}
</style>
