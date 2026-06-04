<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { books } from '../data/books.js'
import { useBookmarks } from '../composables/useBookmarks.js'
import { useScrollReveal } from '../composables/useScrollReveal.js'

const router = useRouter()
const { bookmarkCount } = useBookmarks()
const { targetRef: testamentRef, isVisible: testamentVisible } = useScrollReveal()

function goToSearch() {
  router.push({ name: 'Search' })
}

function handleKeydown(e) {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault()
    goToSearch()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
})

const oldTestamentBooks = computed(() => books.filter(b => b.testament === 'taloha'))
const newTestamentBooks = computed(() => books.filter(b => b.testament === 'vaovao'))

function openBook(book) {
  router.push({ name: 'Read', params: { bookId: book.id, chapter: 1 } })
}

const selectedTestament = ref('taloha')

const displayedBooks = computed(() => {
  return selectedTestament.value === 'taloha' ? oldTestamentBooks.value : newTestamentBooks.value
})

function toggleTestament(t) {
  selectedTestament.value = t
}
</script>

<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <div class="hero-icon" style="animation-delay: 0.05s">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            <line x1="8" y1="7" x2="16" y2="7"></line>
            <line x1="8" y1="11" x2="14" y2="11"></line>
          </svg>
        </div>
        <h1 class="hero-title" style="animation-delay: 0.15s">Ny Baiboly Masina</h1>
        <p class="hero-subtitle" style="animation-delay: 0.25s">Vakio ny tenin'Andriamanitra amin'ny fiteny malagasy</p>

        <!-- Search Icon -->
        <button class="search-fab" @click="goToSearch" title="Hikaroka andininy (Ctrl+K)" style="animation-delay: 0.35s">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
          </svg>
        </button>

        <!-- Quick Jump -->
        <div class="hero-jump" style="animation-delay: 0.45s">
          <button class="hero-jump-btn" @click="router.push({ name: 'Navigate' })">
            <div class="jump-btn-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>
              </svg>
            </div>
            <div class="jump-btn-text">
              <span class="jump-btn-title">Vakio haingana</span>
              <span class="jump-btn-sub">Safidio boky, toko sy andininy</span>
            </div>
            <svg class="jump-btn-arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/>
              <polyline points="12 5 19 12 12 19"/>
            </svg>
          </button>
        </div>

        <div class="hero-stats" style="animation-delay: 0.55s">
          <div class="stat">
            <span class="stat-number">66</span>
            <span class="stat-label">Boky</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat">
            <span class="stat-number">1,189</span>
            <span class="stat-label">Tokoboky</span>
          </div>
          <div class="stat-divider"></div>
          <div class="stat" style="position:relative">
            <span class="stat-number">31,102</span>
            <span class="stat-label">Andininy</span>
          </div>
        </div>

        <!-- Bookmark Link -->
        <button class="hero-bookmark-link" style="animation-delay: 0.65s" @click="router.push({ name: 'Bookmarks' })">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
          </svg>
          <span>Marque-pages</span>
          <span v-if="bookmarkCount > 0" class="hero-bm-badge">{{ bookmarkCount }}</span>
        </button>
      </div>
    </section>

    <!-- Testament Tabs -->
    <section ref="testamentRef" class="testament-section" :class="{ revealed: testamentVisible }">
      <div class="testament-tabs">
        <button
          :class="['tab-btn', { active: selectedTestament === 'taloha' }]"
          @click="toggleTestament('taloha')"
        >
          <span class="tab-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
              <path d="M2 17l10 5 10-5"></path>
              <path d="M2 12l10 5 10-5"></path>
            </svg>
          </span>
          Testameta Taloha
          <span class="tab-count">(39)</span>
        </button>
        <button
          :class="['tab-btn', { active: selectedTestament === 'vaovao' }]"
          @click="toggleTestament('vaovao')"
        >
          <span class="tab-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </span>
          Testameta Vaovao
          <span class="tab-count">(27)</span>
        </button>
      </div>

      <Transition mode="out-in" name="books">
        <div class="books-grid" :key="selectedTestament">
          <button
            v-for="(book, i) in displayedBooks"
            :key="book.id"
            class="book-card"
            :style="{ transitionDelay: `${i * 0.025}s` }"
            @click="openBook(book)"
          >
            <div class="book-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
                <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
              </svg>
            </div>
            <div class="book-info">
              <span class="book-name">{{ book.name }}</span>
              <span class="book-chapters">{{ book.chapters }} toko</span>
            </div>
          </button>
        </div>
      </Transition>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
  background: var(--bg-app);
}

/* Hero */
.hero {
  position: relative;
  padding: 80px 24px 60px;
  text-align: center;
  overflow: hidden;
}

.hero-bg {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, var(--hero-from) 0%, var(--hero-mid) 50%, var(--hero-to) 100%);
  z-index: 0;
}

.hero-bg::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 20% 50%, rgba(212, 175, 55, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.05) 0%, transparent 50%);
}

.hero-content {
  position: relative;
  z-index: 1;
  max-width: 700px;
  margin: 0 auto;
}

.hero-icon {
  color: #d4af37;
  margin-bottom: 24px;
  animation: heroEnter 0.5s ease both, float 3s ease-in-out 0.6s infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

.hero-title {
  font-family: 'Playfair Display', serif;
  font-size: 3rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 12px;
  line-height: 1.2;
  animation: heroEnter 0.5s ease both;
}

.hero-subtitle {
  font-family: 'Inter', sans-serif;
  font-size: 1.1rem;
  color: var(--color-text-secondary);
  margin: 0 0 24px;
  font-weight: 300;
  animation: heroEnter 0.5s ease both;
}

@keyframes heroEnter {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Search FAB icon */
.search-fab {
  position: absolute;
  top: 20px;
  right: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(8px);
  z-index: 10;
  animation: heroEnter 0.5s ease both;
}

.search-fab:hover {
  background: rgba(212, 175, 55, 0.15);
  border-color: rgba(212, 175, 55, 0.35);
  color: #d4af37;
  transform: translateY(-2px) scale(1.05);
}

.search-fab:active {
  transform: translateY(-1px) scale(0.97);
}

/* Bookmark Link */
.hero-bookmark-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-top: 20px;
  padding: 10px 20px;
  background: rgba(212, 175, 55, 0.08);
  border: 1px solid rgba(212, 175, 55, 0.15);
  border-radius: 12px;
  color: #d4af37;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: heroEnter 0.5s ease both;
}

.hero-bookmark-link:hover {
  background: rgba(212, 175, 55, 0.15);
  border-color: rgba(212, 175, 55, 0.3);
  transform: translateY(-1px);
}

.hero-bm-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #d4af37;
  color: #1a1a2e;
  font-size: 0.7rem;
  font-weight: 700;
  border-radius: 10px;
  line-height: 1;
}

/* Quick Jump */
.hero-jump {
  max-width: 480px;
  margin: -16px auto 36px;
  animation: heroEnter 0.5s ease both;
}

.hero-jump-btn {
  display: flex;
  align-items: center;
  gap: 14px;
  width: 100%;
  padding: 16px 20px;
  border: 1px solid var(--hero-search-border);
  border-radius: 16px;
  background: var(--hero-search-bg);
  backdrop-filter: blur(8px);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
  font-family: 'Inter', sans-serif;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.hero-jump-btn:hover {
  border-color: var(--border-search-focus);
  background: var(--hero-search-bg-focus);
  box-shadow: var(--hero-search-shadow);
  transform: translateY(-2px);
}

.hero-jump-btn:active {
  transform: translateY(-1px) scale(0.99);
}

.jump-btn-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  background: linear-gradient(135deg, #d4af37, #c9a432);
  border-radius: 12px;
  color: #1a1a2e;
}

.jump-btn-text {
  flex: 1;
  min-width: 0;
}

.jump-btn-title {
  display: block;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--hero-search-input);
}

.jump-btn-sub {
  display: block;
  font-size: 0.78rem;
  color: var(--hero-search-placeholder);
  margin-top: 2px;
}

.jump-btn-arrow {
  color: var(--hero-search-icon);
  flex-shrink: 0;
  transition: transform 0.3s ease;
}

.hero-jump-btn:hover .jump-btn-arrow {
  transform: translateX(4px);
}

.hero-stats {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  animation: heroEnter 0.5s ease both;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-number {
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: #d4af37;
}

.stat-label {
  font-size: 0.85rem;
  color: var(--hero-stat-color);
  font-weight: 400;
}

.stat-divider {
  width: 1px;
  height: 40px;
  background: var(--hero-stat-divider);
}

/* Testament Tabs — Scroll Reveal */
.testament-section {
  max-width: 960px;
  margin: 0 auto;
  padding: 0 24px 60px;
  opacity: 0;
  transform: translateY(40px);
  transition: opacity 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.testament-section.revealed {
  opacity: 1;
  transform: translateY(0);
}

.testament-tabs {
  display: flex;
  gap: 12px;
  margin-bottom: 32px;
}

.tab-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 24px;
  border: 2px solid var(--border-tab);
  border-radius: 16px;
  background: var(--tab-bg-inactive);
  color: var(--tab-color-inactive);
  font-family: 'Inter', sans-serif;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(20px);
}

.revealed .tab-btn {
  animation: tabReveal 0.45s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
}

.revealed .tab-btn:first-child {
  animation-delay: 0.1s;
}

.revealed .tab-btn:last-child {
  animation-delay: 0.2s;
}

@keyframes tabReveal {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.tab-btn:hover {
  border-color: var(--border-tab-hover);
  background: var(--bg-card-hover);
  color: var(--tab-color-hover);
}

.tab-btn.active {
  border-color: var(--border-tab-active);
  background: var(--tab-active-bg);
  color: #d4af37;
}

.tab-icon {
  display: flex;
  align-items: center;
}

.tab-count {
  font-weight: 400;
  opacity: 0.7;
}

/* Books Grid */
.books-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

/* Books transition (testament switch) */
.books-enter-active {
  animation: booksIn 0.35s ease forwards;
}

.books-leave-active {
  animation: booksOut 0.25s ease forwards;
}

@keyframes booksIn {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes booksOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-8px);
  }
}

.book-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px 18px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: var(--bg-card);
  cursor: pointer;
  text-align: left;
  font-family: 'Inter', sans-serif;
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94),
              border-color 0.3s ease,
              background 0.3s ease,
              box-shadow 0.3s ease;
}

.revealed .book-card {
  opacity: 1;
  transform: translateY(0);
}

.book-card:hover {
  border-color: var(--border-card-hover);
  background: var(--bg-card-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-card);
}

.book-icon {
  color: #d4af37;
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.book-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.book-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-heading);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.book-chapters {
  font-size: 0.75rem;
  color: var(--color-text-muted);
  margin-top: 2px;
}

@media (max-width: 640px) {
  .hero-title { font-size: 2rem; }
  .hero-subtitle { font-size: 0.95rem; }
  .hero-stats { gap: 20px; }
  .stat-number { font-size: 1.4rem; }
  .books-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
  .testament-tabs { flex-direction: column; }

}
</style>
