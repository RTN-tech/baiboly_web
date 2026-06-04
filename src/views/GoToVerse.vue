<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { findBook } from '../data/books.js'

const router = useRouter()
const route = useRoute()

onMounted(() => {
  const params = route.params
  const bookInput = params.book
  const chapter = parseInt(params.chapter) || 1
  const verse = params.verse ? parseInt(params.verse) : null

  if (!bookInput) {
    router.replace('/')
    return
  }

  const book = findBook(bookInput)

  if (!book) {
    router.replace({ name: 'Search', query: { q: bookInput } })
    return
  }

  // Validate chapter exists for this book
  const maxChapter = book.chapters
  const validChapter = Math.min(Math.max(1, chapter), maxChapter)

  // Navigate to the reader
  const query = verse ? { v: verse.toString() } : {}
  router.replace({
    name: 'Read',
    params: { bookId: book.id, chapter: validChapter.toString() },
    query
  })
})
</script>

<template>
  <div class="goto-loading">
    <div class="loader"></div>
    <p>Famakiana ny boky ...</p>
  </div>
</template>

<style scoped>
.goto-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: var(--bg-app);
  color: var(--color-text-secondary);
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
</style>
