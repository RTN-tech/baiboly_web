<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { books } from '../data/books.js'
import { useBookmarks } from '../composables/useBookmarks.js'
import DownloadButton from '../components/DownloadButton.vue'
import FontSizeControl from '../components/FontSizeControl.vue'
import VerseActions from '../components/VerseActions.vue'
import SkeletonLoader from '../components/SkeletonLoader.vue'
import { getBookData } from '../composables/useOfflineData.js'
import { useReadingProgress } from '../composables/useReadingProgress.js'
import { useReadingHistory } from '../composables/useReadingHistory.js'
import { useFontSize } from '../composables/useFontSize.js'
import { useLanguage } from '../composables/useLanguage.js'

const props = defineProps({
  bookId: String,
  chapter: { type: String, default: '1' }
})

const router = useRouter()
const route = useRoute()
const { isBookmarked, toggleBookmark, bookmarkCount } = useBookmarks()
const { updateProgress } = useReadingProgress()
const { addEntry } = useReadingHistory()
useFontSize()
const { t } = useLanguage()

const bookData = ref(null)
const loading = ref(true)
const error = ref(null)
const chListRef = ref(null)
const currentChapter = ref(parseInt(props.chapter) || 1)
const targetVerse = ref(null)
const selectedVerse = ref(null)
const showVerseActions = ref(false)
const touchStartX = ref(0)
const touchStartY = ref(0)

const bookInfo = computed(() => books.find(b => b.id === props.bookId))

const chapters = computed(() => {
  if (!bookData.value) return []
  return Object.keys(bookData.value)
    .filter(key => key !== 'meta')
    .sort((a, b) => parseInt(a) - parseInt(b))
})

const chapterVerses = computed(() => {
  if (!bookData.value) return []
  const ch = bookData.value[currentChapter.value.toString()]
  if (!ch) return []
  return Object.entries(ch).sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
})

const prevChapter = computed(() => {
  const idx = chapters.value.indexOf(currentChapter.value.toString())
  return idx > 0 ? chapters.value[idx - 1] : null
})

const nextChapter = computed(() => {
  const idx = chapters.value.indexOf(currentChapter.value.toString())
  return idx < chapters.value.length - 1 ? chapters.value[idx + 1] : null
})

const prevBook = computed(() => {
  const idx = books.findIndex(b => b.id === props.bookId)
  return idx > 0 ? books[idx - 1] : null
})

const nextBook = computed(() => {
  const idx = books.findIndex(b => b.id === props.bookId)
  return idx < books.length - 1 ? books[idx + 1] : null
})

async function loadBook() {
  if (!bookInfo.value) {
    error.value = 'Tsy hita ilay boky'
    loading.value = false
    return
  }
  loading.value = true
  error.value = null
  try {
    // Try offline IndexedDB first (data downloaded via Télécharger)
    bookData.value = await getBookData(props.bookId)

    // Fall back to network fetch
    if (!bookData.value) {
      const response = await fetch(`/${bookInfo.value.file}`)
      if (!response.ok) throw new Error('Tsy afaka namaky ilay boky')
      bookData.value = await response.json()
    }
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

function goToChapter(ch) {
  currentChapter.value = parseInt(ch)
  router.push({ name: 'Read', params: { bookId: props.bookId, chapter: ch }, query: {} })
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goToBook(book) {
  router.push({ name: 'Read', params: { bookId: book.id, chapter: 1 }, query: {} })
}

watch(() => props.bookId, () => {
  currentChapter.value = 1
  loadBook()
})

watch(() => props.chapter, (val) => {
  currentChapter.value = parseInt(val) || 1
})

// Track reading progress and history when chapter content loads
watch(chapterVerses, (verses) => {
  if (verses.length > 0 && bookInfo.value) {
    updateProgress(props.bookId, bookInfo.value.name, currentChapter.value, targetVerse.value || 1)
    addEntry(props.bookId, bookInfo.value.name, currentChapter.value, targetVerse.value || 1)
  }
})

function handleVerseClick(verseNum, verseText) {
  selectedVerse.value = {
    bookId: props.bookId,
    bookName: bookInfo.value?.name || '',
    chapter: currentChapter.value,
    verse: verseNum,
    text: verseText
  }
  showVerseActions.value = true
}

function onTouchStart(e) {
  touchStartX.value = e.touches[0].clientX
  touchStartY.value = e.touches[0].clientY
}

function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchStartX.value
  const dy = e.changedTouches[0].clientY - touchStartY.value

  // Only handle horizontal swipes (ignore vertical scrolling)
  if (Math.abs(dx) < 60 || Math.abs(dx) < Math.abs(dy) * 1.5) return

  if (dx > 0 && prevChapter.value) {
    // Swipe right → previous chapter
    goToChapter(prevChapter.value)
  } else if (dx < 0 && nextChapter.value) {
    // Swipe left → next chapter
    goToChapter(nextChapter.value)
  }
}

function onKeydown(e) {
  // Left arrow → previous chapter
  if (e.key === 'ArrowLeft' && prevChapter.value) {
    e.preventDefault()
    goToChapter(prevChapter.value)
  }
  // Right arrow → next chapter
  if (e.key === 'ArrowRight' && nextChapter.value) {
    e.preventDefault()
    goToChapter(nextChapter.value)
  }
}

function scrollToVerse() {
  const verse = route.query.v
  if (verse) {
    targetVerse.value = parseInt(verse)
    nextTick(() => {
      const el = document.getElementById(`verse-${targetVerse.value}`)
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' })
          el.classList.add('verse-highlight')
          setTimeout(() => el.classList.remove('verse-highlight'), 3000)
        }, 100)
      }
    })
  }
}

watch(chapterVerses, () => {
  if (chapterVerses.value.length > 0) {
    scrollToVerse()
  }
})

onMounted(() => {
  currentChapter.value = parseInt(props.chapter) || 1
  loadBook()
  window.addEventListener('keydown', onKeydown)
})
</script>

<template>
  <div class="reader-page" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
    <!-- Top Navigation Bar -->
    <nav class="reader-nav">
      <div class="nav-inner">
        <div class="nav-left">
          <button class="nav-icon-btn" @click="router.push('/')" :title="t('reader.back')">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        </div>

        <div class="nav-book-info" v-if="bookInfo">
          <span class="nav-testament">{{ bookInfo.testamentLabel }}</span>
          <h2 class="nav-book-name">{{ bookInfo.name }}</h2>
        </div>

        <div class="nav-right">
          <FontSizeControl compact />
          <DownloadButton compact />
          <button class="nav-icon-btn" @click="router.push({ name: 'Bookmarks' })" :title="`${t('reader.bookmarks')} (${bookmarkCount})`">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
            <span v-if="bookmarkCount > 0" class="nav-badge">{{ bookmarkCount > 9 ? '9+' : bookmarkCount }}</span>
          </button>
        </div>
      </div>
    </nav>

    <div class="reader-content" v-if="!loading && !error && bookInfo">
      <!-- Book Navigation Arrows -->
      <div class="book-nav">
        <button
          v-if="prevBook"
          class="book-nav-btn"
          @click="goToBook(prevBook)"
          :title="prevBook.name"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <span>{{ prevBook.name }}</span>
        </button>
        <div v-else></div>
        <button
          v-if="nextBook"
          class="book-nav-btn"
          @click="goToBook(nextBook)"
          :title="nextBook.name"
        >
          <span>{{ nextBook.name }}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>

      <!-- Chapter Selector -->
      <div class="chapter-selector">
        <button
          v-if="prevChapter"
          class="ch-nav-btn"
          @click="goToChapter(prevChapter)"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          {{ t('reader.chapter') }} {{ prevChapter }}
        </button>
        <div v-else></div>

        <div class="chapter-dropdown">
          <button class="ch-current" @click="chListRef?.classList.toggle('show')">
            {{ t('reader.chapter') }} {{ currentChapter }}
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 9l6 6 6-6"/></svg>
          </button>
          <div class="ch-list" ref="chListRef">
            <button
              v-for="ch in chapters"
              :key="ch"
              :class="['ch-item', { active: parseInt(ch) === currentChapter }]"
              @click="goToChapter(ch); chListRef?.classList.remove('show')"
            >
              {{ t('reader.chapter') }} {{ ch }}
            </button>
          </div>
        </div>

        <button
          v-if="nextChapter"
          class="ch-nav-btn"
          @click="goToChapter(nextChapter)"
        >
          {{ t('reader.chapter') }} {{ nextChapter }}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
        <div v-else></div>
      </div>

      <!-- Chapter Progress -->
      <div class="chapter-progress">
        <div class="cp-label">{{ t('reader.chapter') }} {{ currentChapter }}</div>
        <div class="cp-bar">
          <div class="cp-fill" :style="{ width: `${(currentChapter / chapters.length) * 100}%` }"></div>
        </div>
        <div class="cp-count">{{ currentChapter }} / {{ chapters.length }}</div>
      </div>

      <!-- Verses -->
      <div class="verses-container">
        <div class="chapter-title">
          <span class="chapter-number">{{ bookInfo.name }} {{ currentChapter }}</span>
        </div>
        <div class="verses">
          <div
            v-for="[verseNum, verseText] in chapterVerses"
            :key="verseNum"
            :id="`verse-${verseNum}`"
            :class="['verse', {
              'verse-target': parseInt(verseNum) === targetVerse,
              'verse-bookmarked': isBookmarked(bookInfo.id, currentChapter, parseInt(verseNum))
            }]"
            @click="handleVerseClick(parseInt(verseNum), verseText)"
          >
            <button
              class="verse-bookmark-btn"
              :class="{ active: isBookmarked(bookInfo.id, currentChapter, parseInt(verseNum)) }"
              @click.stop="toggleBookmark(bookInfo.id, currentChapter, parseInt(verseNum), {
                bookName: bookInfo.name,
                text: verseText
              })"
              :title="isBookmarked(bookInfo.id, currentChapter, parseInt(verseNum)) ? t('reader.removeBookmark') : t('reader.addBookmark')"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
              </svg>
            </button>
            <span class="verse-number">{{ verseNum }}</span>
            <span class="verse-text">{{ verseText }}</span>
          </div>
        </div>
      </div>

      <!-- Bottom Chapter Nav -->
      <div class="chapter-nav-bottom">
        <button
          v-if="prevChapter"
          class="ch-nav-btn large"
          @click="goToChapter(prevChapter)"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          <div>
            <span class="nav-label">{{ t('reader.prevChapter') }}</span>
            <span class="nav-chapter">{{ t('reader.chapter') }} {{ prevChapter }}</span>
          </div>
        </button>
        <button
          v-if="nextChapter"
          class="ch-nav-btn large right"
          @click="goToChapter(nextChapter)"
        >
          <div>
            <span class="nav-label">{{ t('reader.nextChapter') }}</span>
            <span class="nav-chapter">{{ t('reader.chapter') }} {{ nextChapter }}</span>
          </div>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </button>
      </div>
    </div>

    <!-- Loading (skeleton) -->
    <div class="loading-state" v-if="loading">
      <SkeletonLoader type="text" lines="3" />
      <div class="skeleton-spacer"></div>
      <SkeletonLoader type="verse-row" :count="6" />
    </div>

    <!-- Verse Actions Modal -->
    <VerseActions
      v-if="showVerseActions && selectedVerse"
      :book-id="selectedVerse.bookId"
      :book-name="selectedVerse.bookName"
      :chapter="selectedVerse.chapter"
      :verse="selectedVerse.verse"
      :text="selectedVerse.text"
      @close="showVerseActions = false; selectedVerse = null"
    />

    <!-- Error -->
    <div class="error-state" v-if="error">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" stroke-width="1.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <h2>{{ t('reader.error.notfound') }}</h2>
      <p>{{ error }}</p>
      <button class="back-btn" @click="router.push('/')">{{ t('reader.backHome') }}</button>
    </div>
  </div>
</template>

<style scoped>
.reader-page {
  min-height: 100vh;
  background: var(--bg-reader);
  color: var(--color-text);
  transition: background 0.3s ease, color 0.3s ease;
}

/* Navigation Bar */
.reader-nav {
  position: sticky;
  top: 0;
  z-index: 100;
  background: var(--bg-nav);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--reader-nav-border);
  transition: background 0.3s ease, border-color 0.3s ease;
}

.nav-inner {
  max-width: 860px;
  margin: 0 auto;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-left,
.nav-right {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 80px;
}

.nav-right {
  justify-content: flex-end;
}

.nav-icon-btn {
  position: relative;
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

.nav-icon-btn:hover {
  background: var(--bg-nav-hover);
  color: var(--color-text-nav-hover);
}

.nav-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: #d4af37;
  color: #1a1a2e;
  font-size: 0.6rem;
  font-weight: 700;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
}

.nav-book-info {
  text-align: center;
}

.nav-testament {
  font-size: 0.7rem;
  color: var(--nav-testament-color);
  text-transform: uppercase;
  letter-spacing: 1.5px;
  font-weight: 600;
}

.nav-book-name {
  font-family: 'Playfair Display', serif;
  font-size: 1.3rem;
  color: var(--nav-book-color);
  margin: 2px 0 0;
  font-weight: 600;
  transition: color 0.3s ease;
}

/* Content */
.reader-content {
  max-width: 780px;
  margin: 0 auto;
  padding: 24px 20px 60px;
}

/* Book Navigation */
.book-nav {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 20px;
}

.book-nav-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--bg-card-hover);
  border: 1px solid var(--border-book-nav);
  color: var(--book-nav-text);
  padding: 8px 14px;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  max-width: 45%;
}

.book-nav-btn:hover {
  background: rgba(212, 175, 55, 0.15);
  border-color: var(--border-accent);
}

/* Chapter Selector */
.chapter-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 32px;
  padding: 8px;
  background: var(--bg-chapter-selector);
  border-radius: 14px;
  box-shadow: var(--shadow-chapter-selector);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}

.ch-nav-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: var(--color-text-tertiary);
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s;
}

.ch-nav-btn:hover {
  background: var(--bg-verse-hover);
  color: var(--color-text);
}

.ch-nav-btn.large {
  padding: 16px 20px;
  background: var(--bg-reader-card);
  border: 1px solid var(--border-large);
  border-radius: 12px;
  min-width: 180px;
  transition: all 0.2s;
}

.ch-nav-btn.large:hover {
  border-color: var(--border-large-hover);
  box-shadow: var(--shadow-large-hover);
}

.ch-nav-btn.large.right {
  text-align: right;
  justify-content: flex-end;
}

.nav-label {
  display: block;
  font-size: 0.75rem;
  color: var(--color-nav-label);
  margin-bottom: 2px;
}

.nav-chapter {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-nav-chapter);
}

.chapter-dropdown {
  position: relative;
}

.ch-current {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: var(--ch-current-bg);
  border: none;
  border-radius: 10px;
  font-family: 'Inter', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.2s;
  min-width: 120px;
  justify-content: center;
}

.ch-current:hover {
  background: var(--ch-current-hover);
}

.ch-list {
  position: absolute;
  top: calc(100% + 6px);
  left: 50%;
  transform: translateX(-50%);
  background: var(--bg-elevated);
  border: 1px solid var(--border-ch-dropdown);
  border-radius: 12px;
  box-shadow: var(--shadow-elevated);
  max-height: 300px;
  overflow-y: auto;
  min-width: 160px;
  display: none;
  z-index: 50;
}

.ch-list.show {
  display: block;
}

.ch-item {
  display: block;
  width: 100%;
  padding: 10px 20px;
  background: none;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  color: var(--color-ch-text);
  cursor: pointer;
  text-align: center;
  transition: all 0.15s;
}

.ch-item:hover {
  background: var(--ch-item-hover);
  color: var(--color-text);
}

.ch-item.active {
  background: var(--ch-active-bg);
  color: var(--color-ch-active-text);
  font-weight: 600;
}

/* Verses */
.verses-container {
  background: var(--bg-reader-card);
  border-radius: 16px;
  padding: 40px;
  box-shadow: var(--shadow-verses);
  border: 1px solid var(--border-reader);
  transition: background 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}

.chapter-title {
  text-align: center;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 2px solid var(--border-chapter-title);
}

.chapter-number {
  font-family: 'Playfair Display', serif;
  font-size: calc(var(--reader-font-size, 1rem) * 1.6);
  font-weight: 700;
  color: var(--color-chapter-number);
  transition: color 0.3s ease, font-size 0.2s ease;
}

.verses {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.verse {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  line-height: 1.8;
  padding: 4px 4px 4px 0;
  transition: background 0.2s;
  border-radius: 8px;
  margin: 0;
  position: relative;
}

.verse:hover {
  background: var(--bg-verse-hover);
}

.verse.verse-target {
  background: rgba(212, 175, 55, 0.12);
  border-left: 3px solid #d4af37;
  margin-left: -3px;
  padding-left: 12px;
  border-radius: 0 8px 8px 0;
}

.verse.verse-highlight {
  animation: versePulse 3s ease;
}

/* Chapter Progress Bar */
.chapter-progress {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  padding: 8px 0;
}

.cp-label {
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: fit-content;
}

.cp-bar {
  flex: 1;
  height: 4px;
  background: var(--border);
  border-radius: 2px;
  overflow: hidden;
}

.cp-fill {
  height: 100%;
  background: linear-gradient(90deg, #d4af37, #c9a032);
  border-radius: 2px;
  transition: width 0.4s ease;
}

.cp-count {
  font-family: 'Inter', sans-serif;
  font-size: 0.72rem;
  color: var(--color-text-tertiary);
  font-weight: 500;
  min-width: fit-content;
  white-space: nowrap;
}

/* Verse clickable */
.verse {
  cursor: pointer;
}

.verse:active {
  background: rgba(212, 175, 55, 0.04);
}

.skeleton-spacer {
  height: 40px;
}

.loading-state {
  padding: 60px 20px;
}

@keyframes versePulse {
  0%, 100% { background: transparent; }
  10%, 60% { background: rgba(212, 175, 55, 0.2); border-left: 3px solid #d4af37; }
}

.verse.verse-bookmarked {
  background: rgba(212, 175, 55, 0.06);
}

.verse-bookmark-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  border-radius: 6px;
  transition: all 0.2s;
  padding: 0;
  margin-top: 3px;
  opacity: 0;
}

.verse:hover .verse-bookmark-btn {
  opacity: 1;
}

.verse-bookmark-btn:hover {
  color: #d4af37;
  background: rgba(212, 175, 55, 0.1);
}

.verse-bookmark-btn.active {
  opacity: 1;
  color: #d4af37;
}

.verse-bookmark-btn.active svg {
  fill: #d4af37;
}

.verse-number {
  font-family: 'Inter', sans-serif;
  font-size: calc(var(--reader-font-size, 1rem) * 0.75);
  font-weight: 700;
  color: var(--color-verse-number);
  min-width: 24px;
  text-align: right;
  flex-shrink: 0;
  padding-top: 2px;
}

.verse-text {
  font-family: 'Inter', sans-serif;
  font-size: var(--reader-font-size, 1rem);
  color: var(--color-verse-text);
  line-height: 1.8;
  transition: color 0.3s ease, font-size 0.2s ease;
  flex: 1;
}

/* Bottom Chapter Nav */
.chapter-nav-bottom {
  display: flex;
  justify-content: space-between;
  gap: 16px;
  margin-top: 32px;
}

/* Loading */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  color: var(--color-text-tertiary);
  gap: 16px;
}

.loader {
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

/* Error */
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  padding: 40px;
  text-align: center;
}

.error-state h2 {
  font-family: 'Playfair Display', serif;
  color: var(--color-text);
  margin: 16px 0 8px;
}

.error-state p {
  color: var(--color-text-secondary);
  margin: 0 0 24px;
}

.back-btn {
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

.back-btn:hover {
  background: var(--back-btn-hover);
  transform: translateY(-1px);
}

@media (max-width: 600px) {
  .reader-content { padding: 16px 12px 40px; }
  .verses-container { padding: 24px 16px; border-radius: 12px; }
  .chapter-number { font-size: calc(var(--reader-font-size, 1rem) * 1.3); }
  .verse-text { font-size: var(--reader-font-size, 0.9rem); }
  .verse-number { min-width: 20px; font-size: calc(var(--reader-font-size, 1rem) * 0.7); }
  .chapter-nav-bottom { flex-direction: column; }
  .ch-nav-btn.large { min-width: auto; width: 100%; }
  .book-nav { flex-direction: column; align-items: stretch; }
  .book-nav-btn { max-width: 100%; justify-content: center; }
  .chapter-selector { gap: 8px; }
  .nav-left, .nav-right { min-width: auto; }
}
</style>
