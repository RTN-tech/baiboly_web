<script setup>
import { useVerseOfTheDay } from '../composables/useVerseOfTheDay.js'
import { useRouter } from 'vue-router'
import { useLanguage } from '../composables/useLanguage.js'

const router = useRouter()
const { verse, reference } = useVerseOfTheDay()
const { t } = useLanguage()

function goToVerse() {
  const v = verse.value
  if (!v) return
  router.push({
    name: 'Read',
    params: { bookId: v.bookId, chapter: v.chapter.toString() },
    query: { v: v.verse.toString() }
  })
}
</script>

<template>
  <div class="verse-of-the-day" v-if="verse">
    <div class="votd-badge">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
      </svg>
      <span>{{ t('home.verseOfDay') }}</span>
    </div>
    <blockquote class="votd-text">{{ verse.text }}</blockquote>
    <button class="votd-ref" @click="goToVerse">— {{ reference }} →</button>
  </div>
</template>

<style scoped>
.verse-of-the-day {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.08), rgba(212, 175, 55, 0.02));
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 16px;
  padding: 24px;
  max-width: 480px;
  margin: 0 auto;
  transition: all 0.3s ease;
}

.verse-of-the-day:hover {
  border-color: rgba(212, 175, 55, 0.35);
  box-shadow: 0 4px 20px rgba(212, 175, 55, 0.08);
}

.votd-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: rgba(212, 175, 55, 0.1);
  border-radius: 20px;
  color: #d4af37;
  font-family: 'Inter', sans-serif;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 14px;
}

.votd-text {
  font-family: 'Playfair Display', serif;
  font-size: 1.15rem;
  font-style: italic;
  font-weight: 500;
  color: var(--color-text);
  line-height: 1.7;
  margin: 0 0 14px;
  quotes: "«" "»" "‹" "›";
}

.votd-text::before {
  content: "«";
  color: #d4af37;
  opacity: 0.5;
  margin-right: 2px;
}

.votd-text::after {
  content: "»";
  color: #d4af37;
  opacity: 0.5;
  margin-left: 2px;
}

.votd-ref {
  background: none;
  border: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: #d4af37;
  cursor: pointer;
  transition: all 0.2s;
  padding: 0;
}

.votd-ref:hover {
  opacity: 0.8;
  transform: translateX(2px);
}

@media (max-width: 640px) {
  .verse-of-the-day {
    padding: 18px;
  }
  .votd-text {
    font-size: 1rem;
  }
}
</style>
