<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSearch } from '../services/searchService.js'

const router = useRouter()
const route = useRoute()
const { isIndexing, indexingProgress, indexReady, buildIndex, search } = useSearch()

const searchQuery = ref('')
const results = ref([])
const totalResults = ref(0)
const hasSearched = ref(false)
const searchInput = ref(null)

function parseQueryFromURL() {
  const q = route.query.q
  if (q && typeof q === 'string') {
    searchQuery.value = q
    return q
  }
  return ''
}

async function performSearch() {
  const q = searchQuery.value.trim()
  if (q.length < 2) {
    results.value = []
    totalResults.value = 0
    hasSearched.value = false
    router.replace({ query: {} })
    return
  }

  router.replace({ query: { q } })

  if (!indexReady.value) {
    await buildIndex()
  }

  const searchResult = search(q)
  results.value = searchResult.results
  totalResults.value = searchResult.total
  hasSearched.value = true
}

function goToVerse(bookId, chapter, verse) {
  router.push({ name: 'Read', params: { bookId, chapter: chapter.toString() }, query: { v: verse.toString() } })
}

function handleSubmit() {
  performSearch()
}

let searchDebounce = null

function handleInput() {
  clearTimeout(searchDebounce)
  searchDebounce = setTimeout(() => performSearch(), 300)
}

function clearSearch() {
  searchQuery.value = ''
  results.value = []
  totalResults.value = 0
  hasSearched.value = false
  router.replace({ query: {} })
  searchInput.value?.focus()
}

onMounted(async () => {
  const q = parseQueryFromURL()
  if (q) {
    await performSearch()
  }
  setTimeout(() => searchInput.value?.focus(), 100)
})

watch(() => route.query.q, (newQ) => {
  if (newQ && newQ !== searchQuery.value) {
    searchQuery.value = newQ
    performSearch()
  }
})
</script>

<template>
  <div class="search-page">
    <!-- Sticky Search Header -->
    <header class="search-header">
      <div class="search-header-inner">
        <button class="back-btn-icon" @click="router.push('/')" title="Miverina any an-trano">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7"/>
          </svg>
        </button>

        <div class="search-bar-wrapper">
          <div class="search-input-group">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              ref="searchInput"
              v-model="searchQuery"
              type="text"
              class="search-input"
              placeholder="Hikaroka andininy ..."
              @input="handleInput"
              @keydown.enter="handleSubmit"
            />
            <button v-if="searchQuery" class="clear-btn" @click="clearSearch">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>

    <div class="search-body">
      <!-- Indexing Progress -->
      <div v-if="isIndexing" class="indexing-progress">
        <div class="loader"></div>
        <p>Am-panokafana ny boky ...</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: `${(indexingProgress.loaded / indexingProgress.total) * 100}%` }"></div>
        </div>
        <p class="progress-text">{{ indexingProgress.loaded }} / {{ indexingProgress.total }} boky</p>
      </div>

      <!-- Initial state -->
      <div v-if="!hasSearched && !searchQuery && !isIndexing" class="empty-state">
        <div class="empty-icon">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </div>
        <h2>Hikaroka ny Baiboly</h2>
        <p>Amin'ny teny malagasy, soraty eto ny teny tadiavina</p>
        <div class="search-tips">
          <span class="tip">Ohatra: <button class="tip-btn" @click="searchQuery = 'fitiavana'; performSearch()">fitiavana</button></span>
          <span class="tip">Ohatra: <button class="tip-btn" @click="searchQuery = 'fahasoavana'; performSearch()">fahasoavana</button></span>
          <span class="tip">Ohatra: <button class="tip-btn" @click="searchQuery = 'fanavotana'; performSearch()">fanavotana</button></span>
        </div>
      </div>

      <!-- No results -->
      <div v-if="hasSearched && searchQuery && totalResults === 0 && !isIndexing" class="no-results">
        <div class="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/><line x1="8" y1="11" x2="14" y2="11"/>
          </svg>
        </div>
        <h2>Tsy nisy valiny</h2>
        <p>Tsy nisy andininy hitanay tamin'ny teny <strong>"{{ searchQuery }}"</strong></p>
        <p class="hint">Andramo amin'ny teny hafa</p>
      </div>

      <!-- Results -->
      <div v-if="hasSearched && results.length > 0" class="results-container">
        <div class="results-header">
          <span class="results-count">{{ totalResults }} andininy hita</span>
        </div>

        <div v-for="group in results" :key="group.bookId" class="book-group">
          <div class="book-group-header">
            <span class="book-group-name">{{ group.bookName }}</span>
            <span class="book-group-count">{{ group.verses.length }} andininy</span>
          </div>

          <div class="verse-results">
            <button
              v-for="vr in group.verses"
              :key="`${group.bookId}-${vr.chapter}-${vr.verse}`"
              class="verse-result-item"
              @click="goToVerse(group.bookId, vr.chapter, vr.verse)"
            >
              <span class="verse-ref">{{ vr.ref }}</span>
              <span class="verse-preview" v-html="vr.highlightedText"></span>
            </button>
          </div>

          <div v-if="group.truncated" class="truncated-notice">
            <span>Misy {{ group.totalVerses }} andininy hafa ...</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.search-page {
  min-height: 100vh;
  background: var(--bg-reader);
  transition: background 0.3s ease;
}

/* Search Header */
.search-header {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-search-header);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border-nav);
  transition: background 0.3s ease, border-color 0.3s ease;
}

.search-header-inner {
  max-width: 780px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.back-btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: var(--bg-icon-btn);
  border: none;
  border-radius: 10px;
  color: var(--color-text-nav);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.back-btn-icon:hover {
  background: var(--bg-icon-btn-hover);
  color: var(--color-text-nav-hover);
}

.search-bar-wrapper {
  flex: 1;
}

.search-input-group {
  display: flex;
  align-items: center;
  background: var(--bg-search-input);
  border-radius: 12px;
  padding: 0 14px;
  transition: all 0.2s;
  border: 2px solid transparent;
}

.search-input-group:focus-within {
  background: var(--bg-search-input-focus);
  border-color: var(--border-search-focus);
}

.search-icon {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--color-search-input);
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  padding: 12px 10px;
  font-weight: 400;
}

.search-input::placeholder {
  color: var(--color-search-placeholder);
}

.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: var(--bg-icon-btn);
  border: none;
  border-radius: 8px;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.clear-btn:hover {
  background: var(--bg-icon-btn-hover);
  color: var(--color-text-nav-hover);
}

/* Body */
.search-body {
  max-width: 780px;
  margin: 0 auto;
  padding: 24px 20px 60px;
}

/* Indexing */
.indexing-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  gap: 16px;
}

.indexing-progress .loader {
  width: 40px;
  height: 40px;
  border: 3px solid var(--loader-track);
  border-top-color: #d4af37;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.indexing-progress p {
  color: var(--color-text-secondary);
  font-size: 0.95rem;
}

.progress-bar {
  width: 200px;
  height: 6px;
  background: var(--progress-track);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4af37, #c9a032);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 0.8rem !important;
  color: var(--color-text-tertiary) !important;
}

/* Empty State */
.empty-state, .no-results {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  color: var(--color-empty-icon);
  margin-bottom: 16px;
}

.empty-state h2, .no-results h2 {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  color: var(--color-empty-heading);
  margin: 0 0 8px;
  transition: color 0.3s ease;
}

.empty-state p, .no-results p {
  color: var(--color-empty-text);
  margin: 0;
  font-size: 0.95rem;
}

.no-results strong {
  color: var(--color-text);
}

.hint {
  margin-top: 12px !important;
  font-size: 0.85rem !important;
  color: var(--color-hint) !important;
}

/* Search Tips */
.search-tips {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 24px;
  justify-content: center;
}

.tip {
  font-size: 0.85rem;
  color: var(--color-text-tertiary);
}

.tip-btn {
  background: var(--tip-btn-bg);
  border: 1px solid var(--tip-btn-border);
  color: var(--search-highlight-color);
  padding: 6px 14px;
  border-radius: 20px;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 500;
}

.tip-btn:hover {
  background: var(--tip-btn-hover-bg);
  border-color: var(--tip-btn-hover-border);
}

/* Results */
.results-container {
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid var(--border-chapter-title);
}

.results-count {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 1px;
}

/* Book Group */
.book-group {
  margin-bottom: 28px;
}

.book-group-header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 12px;
  padding: 10px 14px;
  background: var(--bg-group-header);
  border-radius: 10px;
  box-shadow: var(--shadow-group-header);
  border: 1px solid var(--border-group-header);
  transition: background 0.3s ease, border-color 0.3s ease;
}

.book-group-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-group-name);
  transition: color 0.3s ease;
}

.book-group-count {
  font-size: 0.8rem;
  color: var(--color-group-count);
  font-weight: 400;
}

/* Verse Result Items */
.verse-results {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.verse-result-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px 16px;
  background: var(--bg-result-item);
  border: 1px solid var(--border-result-item);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  font-family: 'Inter', sans-serif;
  width: 100%;
}

.verse-result-item:hover {
  border-color: var(--border-accent);
  box-shadow: var(--shadow-result-hover);
  transform: translateX(3px);
}

.verse-ref {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-result-ref);
  letter-spacing: 0.3px;
}

.verse-preview {
  font-size: 0.92rem;
  color: var(--color-result-text);
  line-height: 1.6;
}

.verse-preview :deep(.search-highlight) {
  background: var(--search-highlight-bg);
  color: var(--search-highlight-color);
  padding: 1px 3px;
  border-radius: 3px;
  font-weight: 600;
}

/* Truncated notice */
.truncated-notice {
  text-align: center;
  padding: 10px;
  color: var(--color-truncated);
  font-size: 0.82rem;
  font-style: italic;
}

@media (max-width: 600px) {
  .search-body { padding: 16px 12px 40px; }
  .search-header-inner { padding: 10px 12px; gap: 8px; }
  .search-input { font-size: 0.92rem; padding: 10px 8px; }
  .empty-state { padding: 60px 16px; }
  .verse-result-item { padding: 10px 14px; }
}
</style>
