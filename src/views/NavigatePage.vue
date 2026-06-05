<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { books } from '../data/books.js'
import { useLanguage } from '../composables/useLanguage.js'

const router = useRouter()
const { t } = useLanguage()

const oldTestamentBooks = computed(() => books.filter(b => b.testament === 'taloha'))
const newTestamentBooks = computed(() => books.filter(b => b.testament === 'vaovao'))

// Step state
const selectedTestament = ref('')
const selectedBookId = ref('')
const selectedChapter = ref('')
const selectedVerse = ref('')
const chapterData = ref(null)
const loadingVerses = ref(false)

function goHome() {
  router.push({ name: 'Home' })
}

const testaments = [
  { id: 'taloha', label: () => t('home.testament.old'), icon: 'ot', count: 39 },
  { id: 'vaovao', label: () => t('home.testament.new'), icon: 'nt', count: 27 }
]

const availableBooks = computed(() => {
  if (!selectedTestament.value) return []
  return selectedTestament.value === 'taloha' ? oldTestamentBooks.value : newTestamentBooks.value
})

const selectedBook = computed(() => books.find(b => b.id === selectedBookId.value))

const availableChapters = computed(() => {
  if (!selectedBook.value) return []
  return Array.from({ length: selectedBook.value.chapters }, (_, i) => i + 1)
})

watch([selectedBookId, selectedChapter], async ([bookId, chapter]) => {
  chapterData.value = null
  selectedVerse.value = ''
  if (!bookId || !chapter) return
  const book = books.find(b => b.id === bookId)
  if (!book) return
  loadingVerses.value = true
  try {
    const response = await fetch(`/${book.file}`)
    if (response.ok) {
      const data = await response.json()
      chapterData.value = data[chapter.toString()]
    }
  } catch (e) {
    console.error('Failed to load book data', e)
  } finally {
    loadingVerses.value = false
  }
})

const availableVerses = computed(() => {
  if (!chapterData.value) return []
  return Object.keys(chapterData.value)
    .map(Number)
    .sort((a, b) => a - b)
})

function resetAll() {
  selectedTestament.value = ''
  selectedBookId.value = ''
  selectedChapter.value = ''
  selectedVerse.value = ''
}

function navigate() {
  if (!selectedBookId.value || !selectedChapter.value) return
  const chapter = parseInt(selectedChapter.value)
  const verse = selectedVerse.value ? parseInt(selectedVerse.value) : undefined
  router.push({
    name: 'GoToVerse',
    params: {
      book: selectedBook.value.name,
      chapter,
      verse: verse ? verse.toString() : undefined
    }
  })
}
</script>

<template>
  <div class="navigate-page">
    <!-- Top Bar -->
    <nav class="nav-bar">
      <button class="nav-back-btn" @click="goHome">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
      </button>
      <h1 class="nav-title">{{ t('nav.title') }}</h1>
      <button v-if="selectedTestament" class="nav-reset-btn" @click="resetAll" :title="t('nav.reset')">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
        </svg>
      </button>
      <div v-else style="width:40px"></div>
    </nav>

    <div class="navigate-content">
      <!-- Step indicators -->
      <div class="step-indicators">
        <div class="step-dot" :class="{ active: selectedTestament, done: selectedTestament }">
          <svg v-if="selectedTestament" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span v-else>1</span>
        </div>
        <div class="step-line" :class="{ active: selectedBookId }"></div>
        <div class="step-dot" :class="{ active: selectedBookId, done: selectedBookId }">
          <svg v-if="selectedBookId" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span v-else>2</span>
        </div>
        <div class="step-line" :class="{ active: selectedChapter }"></div>
        <div class="step-dot" :class="{ active: selectedChapter, done: selectedChapter }">
          <svg v-if="selectedChapter" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span v-else>3</span>
        </div>
        <div class="step-line" :class="{ active: selectedVerse }"></div>
        <div class="step-dot" :class="{ active: selectedVerse, done: selectedVerse }">
          <svg v-if="selectedVerse" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
          <span v-else>4</span>
        </div>
      </div>

      <Transition mode="out-in" name="step">
        <!-- Step 1: Choose Testament -->
        <section v-if="!selectedTestament" key="testament" class="step-section">
          <div class="step-header">
            <span class="step-badge">{{ t('nav.step') }} 1</span>
            <h2 class="step-title">{{ t('nav.step1.title') }}</h2>
            <p class="step-desc">{{ t('nav.step1.desc') }}</p>
          </div>
          <div class="testament-cards">
            <button
              v-for="(tm, i) in testaments"
              :key="tm.id"
              class="testament-card"
              :class="{ 'testament-ot': tm.id === 'taloha', 'testament-nt': tm.id === 'vaovao' }"
              :style="{ animationDelay: `${i * 0.12}s` }"
              @click="selectedTestament = tm.id"
            >
              <div class="testament-icon">
                <svg v-if="tm.id === 'taloha'" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                </svg>
                <svg v-else width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                </svg>
              </div>
              <div class="testament-info">
                <span class="testament-name">{{ tm.label() }}</span>
                <span class="testament-count">{{ tm.count }} {{ t('home.stats.books') }}</span>
              </div>
              <svg class="testament-arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
              </svg>
            </button>
          </div>
        </section>

        <!-- Step 2: Choose Book -->
        <section v-else-if="selectedTestament && !selectedBookId" key="book" class="step-section">
          <div class="step-header">
            <span class="step-badge">{{ t('nav.step') }} 2</span>
            <h2 class="step-title">{{ t('nav.step2.title') }}</h2>
            <p class="step-desc">{{ selectedTestament === 'taloha' ? t('home.testament.old') : t('home.testament.new') }} — {{ availableBooks.length }} {{ t('home.stats.books') }}</p>
          </div>
          <div class="books-scroll">
            <button
              v-for="(book, i) in availableBooks"
              :key="book.id"
              class="book-select-btn"
              :style="{ animationDelay: `${i * 0.025}s` }"
              @click="selectedBookId = book.id"
            >
              <div class="book-sel-icon">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
                </svg>
              </div>
              <span class="book-sel-name">{{ book.name }}</span>
              <span class="book-sel-chapters">{{ book.chapters }} {{ t('home.chapters') }}</span>
            </button>
          </div>
        </section>

        <!-- Step 3: Choose Chapter -->
        <section v-else-if="selectedBookId && !selectedChapter" key="chapter" class="step-section">
          <div class="step-header">
            <span class="step-badge">{{ t('nav.step') }} 3</span>
            <h2 class="step-title">{{ t('nav.step3.title') }}</h2>
            <p class="step-desc">
              <button class="back-step-link" @click="selectedBookId = ''; resetAll()">← {{ selectedBook?.name }}</button>
              — {{ availableChapters.length }} {{ t('home.chapters') }}
            </p>
          </div>
          <div class="chapters-grid">
            <button
              v-for="(ch, i) in availableChapters"
              :key="ch"
              class="chapter-btn"
              :style="{ animationDelay: `${i * 0.02}s` }"
              @click="selectedChapter = ch"
            >
              {{ ch }}
            </button>
          </div>
        </section>

        <!-- Step 4: Choose Verse -->
        <section v-else-if="selectedChapter && !selectedVerse" key="verse" class="step-section">
          <div class="step-header">
            <span class="step-badge">{{ t('nav.step') }} 4</span>
            <h2 class="step-title">{{ t('nav.step4.title') }}</h2>
            <p class="step-desc">
              <span class="back-step-link" @click="selectedChapter = ''">← {{ selectedBook?.name }} {{ t('reader.chapter') }} {{ selectedChapter }}</span>
              <template v-if="loadingVerses">— {{ t('nav.loading.verses') }}</template>
              <template v-else>— {{ availableVerses.length }} {{ t('nav.final.verse').toLowerCase() }}</template>
            </p>
          </div>
          <div class="verses-grid">
            <div v-if="loadingVerses" class="verses-loading">
              <span class="loader"></span>
              <p>{{ t('nav.loading.book') }}</p>
            </div>
            <button
              v-for="(v, i) in availableVerses"
              :key="v"
              class="verse-btn"
              :style="{ animationDelay: `${i * 0.015}s` }"
              @click="selectedVerse = v"
            >
              {{ v }}
            </button>
          </div>
        </section>

        <!-- Final: Ready to go -->
        <section v-else key="final" class="step-section final-section">
          <div class="final-content">
            <div class="final-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#d4af37" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="14" y2="11"/>
              </svg>
            </div>
            <h2 class="final-title">{{ t('nav.final.title') }}</h2>
            <div class="final-ref">
              <span class="final-book">{{ selectedBook?.name }}</span>
              <span class="final-sep">—</span>
              <span class="final-chapter">{{ t('reader.chapter') }} {{ selectedChapter }}</span>
              <span class="final-sep">—</span>
              <span class="final-verse">{{ t('nav.final.verse') }} {{ selectedVerse }}</span>
            </div>
            <div class="final-actions">
              <button class="final-go-btn" @click="navigate">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                </svg>
                <span>{{ t('nav.final.read') }}</span>
              </button>
              <button class="final-change-btn" @click="resetAll">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                </svg>
                <span>{{ t('nav.final.change') }}</span>
              </button>
            </div>
          </div>
        </section>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.navigate-page {
  min-height: 100vh;
  background: var(--bg-app);
  color: var(--color-text);
}

/* Top Bar */
.nav-bar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--bg-nav);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--reader-nav-border);
}

.nav-back-btn,
.nav-reset-btn {
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
}

.nav-back-btn:hover,
.nav-reset-btn:hover {
  background: var(--bg-nav-hover);
  color: var(--color-text-nav-hover);
}

.nav-title {
  font-family: 'Inter', sans-serif;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text);
  margin: 0;
}

/* Content */
.navigate-content {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px 20px 80px;
}

/* Step Indicators */
.step-indicators {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 40px;
}

.step-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 700;
  background: var(--bg-card);
  border: 2px solid var(--border);
  color: var(--color-text-tertiary);
  transition: all 0.3s ease;
}

.step-dot.active {
  border-color: #d4af37;
  color: #d4af37;
  box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.12);
}

.step-dot.done {
  background: #d4af37;
  border-color: #d4af37;
  color: #1a1a2e;
}

.step-line {
  width: 40px;
  height: 2px;
  background: var(--border);
  transition: background 0.3s ease;
  margin: 0 4px;
}

.step-line.active {
  background: #d4af37;
}

/* Step Sections */
.step-section {
  position: relative;
}

/* Vue Transition animations */
.step-enter-active {
  animation: stepIn 0.35s ease forwards;
}

.step-leave-active {
  animation: stepOut 0.25s ease forwards;
}

@keyframes stepIn {
  from {
    opacity: 0;
    transform: translateY(18px) scale(0.97);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes stepOut {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-12px) scale(0.97);
  }
}

/* Staggered item entrance */
.testament-card,
.book-select-btn,
.chapter-btn,
.verse-btn {
  animation: itemFadeUp 0.35s ease both;
}

@keyframes itemFadeUp {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Step indicators transition */
.step-dot {
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.step-line {
  transition: background 0.4s ease;
}

.step-badge {
  animation: badgePop 0.3s ease both;
}

@keyframes badgePop {
  from {
    opacity: 0;
    transform: scale(0.7);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes finalEnter {
  from {
    opacity: 0;
    transform: translateY(24px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.step-header {
  text-align: center;
  margin-bottom: 28px;
}

.step-badge {
  display: inline-flex;
  padding: 4px 12px;
  background: rgba(212, 175, 55, 0.1);
  color: #d4af37;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  border-radius: 20px;
  margin-bottom: 12px;
}

.step-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.6rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 6px;
}

.step-desc {
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: var(--color-text-secondary);
  margin: 0;
}

.back-step-link {
  color: #d4af37;
  cursor: pointer;
  transition: opacity 0.2s;
  background: none;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  padding: 0;
}

.back-step-link:hover {
  opacity: 0.8;
}

/* Testament Cards */
.testament-cards {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.testament-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-radius: 16px;
  border: 2px solid var(--border);
  background: var(--bg-card);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-family: 'Inter', sans-serif;
}

.testament-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.testament-ot:hover {
  border-color: rgba(212, 175, 55, 0.35);
  background: var(--bg-card-hover);
}

.testament-nt:hover {
  border-color: rgba(212, 175, 55, 0.35);
  background: var(--bg-card-hover);
}

.testament-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: rgba(212, 175, 55, 0.08);
  color: #d4af37;
  flex-shrink: 0;
}

.testament-info {
  flex: 1;
  min-width: 0;
}

.testament-name {
  display: block;
  font-size: 1.05rem;
  font-weight: 600;
  color: var(--color-text);
}

.testament-count {
  display: block;
  font-size: 0.82rem;
  color: var(--color-text-secondary);
  margin-top: 3px;
}

.testament-arrow {
  color: var(--color-text-tertiary);
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.testament-card:hover .testament-arrow {
  transform: translateX(4px);
  color: #d4af37;
}

/* Books List */
.books-scroll {
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 420px;
  overflow-y: auto;
  padding-right: 4px;
}

.books-scroll::-webkit-scrollbar {
  width: 4px;
}

.books-scroll::-webkit-scrollbar-track {
  background: transparent;
}

.books-scroll::-webkit-scrollbar-thumb {
  background: var(--border);
  border-radius: 4px;
}

.book-select-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 18px;
  border-radius: 12px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  font-family: 'Inter', sans-serif;
}

.book-select-btn:hover {
  border-color: var(--border-card-hover);
  background: var(--bg-card-hover);
  transform: translateX(4px);
}

.book-sel-icon {
  color: #d4af37;
  flex-shrink: 0;
  display: flex;
}

.book-sel-name {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-heading);
}

.book-sel-chapters {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  flex-shrink: 0;
}

/* Chapters Grid */
.chapters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(52px, 1fr));
  gap: 8px;
}

.chapter-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 8px;
  border-radius: 10px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--color-text);
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chapter-btn:hover {
  border-color: rgba(212, 175, 55, 0.4);
  background: rgba(212, 175, 55, 0.06);
  color: #d4af37;
  transform: translateY(-2px);
}

/* Verses Grid */
.verses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(48px, 1fr));
  gap: 6px;
}

.verse-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px 6px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--color-text);
  font-family: 'Inter', sans-serif;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.verse-btn:hover {
  border-color: rgba(212, 175, 55, 0.4);
  background: rgba(212, 175, 55, 0.06);
  color: #d4af37;
  transform: translateY(-2px);
}

.verses-loading {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 20px;
  color: var(--color-text-tertiary);
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
}

.loader {
  width: 32px;
  height: 32px;
  border: 3px solid var(--loader-track);
  border-top-color: #d4af37;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Final Section */
.final-section {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
}

.final-content {
  text-align: center;
  padding: 40px;
  background: var(--bg-card);
  border-radius: 20px;
  border: 1px solid var(--border);
  max-width: 420px;
  width: 100%;
  animation: finalEnter 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
}

.final-icon {
  margin-bottom: 20px;
}

.final-title {
  font-family: 'Playfair Display', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 20px;
}

.final-ref {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 32px;
  padding: 16px 20px;
  background: rgba(212, 175, 55, 0.06);
  border-radius: 12px;
  border: 1px solid rgba(212, 175, 55, 0.15);
}

.final-book {
  font-family: 'Playfair Display', serif;
  font-size: 1.1rem;
  font-weight: 700;
  color: #d4af37;
}

.final-sep {
  color: var(--color-text-tertiary);
  font-size: 0.85rem;
}

.final-chapter,
.final-verse {
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.final-actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.final-go-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 32px;
  background: linear-gradient(135deg, #d4af37, #c9a432);
  border: none;
  border-radius: 14px;
  color: #1a1a2e;
  font-family: 'Inter', sans-serif;
  font-size: 1.05rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 16px rgba(212, 175, 55, 0.3);
}

.final-go-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(212, 175, 55, 0.4);
}

.final-go-btn:active {
  transform: translateY(0) scale(0.98);
}

.final-change-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px 24px;
  background: none;
  border: 1px solid var(--border);
  border-radius: 12px;
  color: var(--color-text-secondary);
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.final-change-btn:hover {
  border-color: var(--border-card-hover);
  color: var(--color-text);
}

@media (max-width: 480px) {
  .navigate-content { padding: 16px 14px 60px; }
  .step-title { font-size: 1.3rem; }
  .step-line { width: 24px; }
  .chapters-grid { grid-template-columns: repeat(auto-fill, minmax(44px, 1fr)); }
  .verses-grid { grid-template-columns: repeat(auto-fill, minmax(40px, 1fr)); }
  .testament-card { padding: 16px 18px; }
  .final-content { padding: 24px 16px; }
}
</style>
