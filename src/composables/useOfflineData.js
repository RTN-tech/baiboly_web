import { ref, computed } from 'vue'
import { books } from '../data/books.js'

const DB_NAME = 'ny-baiboly'
const DB_VERSION = 1
const STORE_NAME = 'books'

const isDownloading = ref(false)
const downloadProgress = ref({ loaded: 0, total: books.length })
const downloadComplete = ref(false)
const downloadError = ref(null)

let dbPromise = null

function openDB() {
  if (dbPromise) return dbPromise

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onupgradeneeded = event => {
      const db = event.target.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }

    request.onsuccess = event => resolve(event.target.result)
    request.onerror = event => reject(event.target.error)
  })

  return dbPromise
}

/**
 * Standalone function to retrieve book data from IndexedDB.
 * Can be imported directly by other modules without going through the composable.
 */
export async function getBookData(bookId) {
  try {
    const db = await openDB()
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const request = store.get(bookId)

      request.onsuccess = () => resolve(request.result ? request.result.data : null)
      request.onerror = () => reject(request.error)
    })
  } catch (e) {
    console.warn('IndexedDB getBookData failed:', e)
    return null
  }
}

export async function getStoredBookIds() {
  try {
    const db = await openDB()
    return await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly')
      const store = tx.objectStore(STORE_NAME)
      const keys = []
      const cursor = store.openCursor()

      cursor.onsuccess = event => {
        const cur = event.target.result
        if (cur) {
          keys.push(cur.key)
          cur.continue()
        } else {
          resolve(keys)
        }
      }
      cursor.onerror = () => reject(cursor.error)
    })
  } catch (e) {
    console.warn('IndexedDB getStoredBookIds failed:', e)
    return []
  }
}

async function storeBookData(bookId, data) {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.put({ id: bookId, data })

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

async function clearAllData() {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const request = store.clear()

    request.onsuccess = () => resolve()
    request.onerror = () => reject(request.error)
  })
}

async function downloadAll() {
  if (isDownloading.value) return

  isDownloading.value = true
  downloadError.value = null
  downloadProgress.value = { loaded: 0, total: books.length }

  try {
    for (const book of books) {
      try {
        const response = await fetch(`/${book.file}`)
        if (!response.ok) throw new Error(`Tsy afaka namaky: ${book.name}`)
        const data = await response.json()
        await storeBookData(book.id, data)
      } catch (e) {
        console.warn(`Tsy voasintona: ${book.name}`, e)
      }
      downloadProgress.value.loaded++
    }

    downloadComplete.value = true
  } catch (e) {
    downloadError.value = e.message
  } finally {
    isDownloading.value = false
  }
}

async function checkOfflineStatus() {
  try {
    const storedIds = await getStoredBookIds()
    const allIds = books.map(b => b.id)
    const allStored = allIds.every(id => storedIds.includes(id))

    downloadComplete.value = allStored

    // Sync progress to reflect current state
    if (allStored) {
      downloadProgress.value = { loaded: books.length, total: books.length }
    }
  } catch {
    downloadComplete.value = false
  }
}

export function useOfflineData() {
  return {
    isDownloading,
    downloadProgress,
    downloadComplete,
    downloadError,
    downloadAll,
    getBookData,
    getStoredBookIds,
    clearAllData,
    checkOfflineStatus
  }
}
