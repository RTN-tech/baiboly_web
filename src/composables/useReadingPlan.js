import { ref, computed } from 'vue'
import { books } from '../data/books.js'

const STORAGE_KEY = 'ny-baiboly-reading-plan'
const READING_PLANS = [
  {
    id: '1-year',
    nameKey: 'plan.1year.name',
    descKey: 'plan.1year.desc',
    days: 365,
    dailyReadings: generateYearPlan()
  },
  {
    id: '3-months',
    nameKey: 'plan.3months.name',
    descKey: 'plan.3months.desc',
    days: 90,
    dailyReadings: generateFastPlan(90)
  },
  {
    id: 'nt-only',
    nameKey: 'plan.nt.name',
    descKey: 'plan.nt.desc',
    days: 90,
    dailyReadings: generateNTPlan()
  }
]

function generateYearPlan() {
  const plan = []
  const allChapters = []
  for (const book of books) {
    for (let ch = 1; ch <= book.chapters; ch++) {
      allChapters.push({ bookId: book.id, bookName: book.name, chapter: ch })
    }
  }
  // Shuffle OT/NT for variety - interleave OT and NT chapters
  const otChapters = allChapters.filter(c => {
    const b = books.find(bk => bk.id === c.bookId)
    return b && b.testament === 'taloha'
  })
  const ntChapters = allChapters.filter(c => {
    const b = books.find(bk => bk.id === c.bookId)
    return b && b.testament === 'vaovao'
  })

  const totalDays = 365
  const otPerDay = Math.ceil(otChapters.length / totalDays)
  const ntPerDay = Math.ceil(ntChapters.length / totalDays)

  let oi = 0, ni = 0
  for (let d = 0; d < totalDays; d++) {
    const readings = []
    for (let i = 0; i < otPerDay && oi < otChapters.length; i++) {
      readings.push(otChapters[oi++])
    }
    for (let i = 0; i < ntPerDay && ni < ntChapters.length; i++) {
      readings.push(ntChapters[ni++])
    }
    if (readings.length > 0) plan.push(readings)
  }
  return plan
}

function generateFastPlan(days) {
  const plan = []
  const allChapters = []
  for (const book of books) {
    for (let ch = 1; ch <= book.chapters; ch++) {
      allChapters.push({ bookId: book.id, bookName: book.name, chapter: ch })
    }
  }
  const perDay = Math.ceil(allChapters.length / days)
  for (let i = 0; i < allChapters.length; i += perDay) {
    plan.push(allChapters.slice(i, i + perDay))
  }
  return plan
}

function generateNTPlan() {
  const plan = []
  const ntBooks = books.filter(b => b.testament === 'vaovao')
  const chapters = []
  for (const book of ntBooks) {
    for (let ch = 1; ch <= book.chapters; ch++) {
      chapters.push({ bookId: book.id, bookName: book.name, chapter: ch })
    }
  }
  const perDay = Math.ceil(chapters.length / 90)
  for (let i = 0; i < chapters.length; i += perDay) {
    plan.push(chapters.slice(i, i + perDay))
  }
  return plan
}

function loadProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return { planId: null, currentDay: 0, completedDays: [], startDate: null }
}

function saveProgress(p) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
}

export function useReadingPlan() {
  const progress = ref(loadProgress())

  const activePlan = computed(() => {
    if (!progress.value.planId) return null
    return READING_PLANS.find(p => p.id === progress.value.planId) || null
  })

  const todayReadings = computed(() => {
    const plan = activePlan.value
    if (!plan) return []
    const day = progress.value.currentDay
    return plan.dailyReadings[day] || []
  })

  const totalDays = computed(() => activePlan.value?.days || 0)
  const daysCompleted = computed(() => progress.value.completedDays.length)
  const percentComplete = computed(() => {
    if (totalDays.value === 0) return 0
    return Math.round((daysCompleted.value / totalDays.value) * 100)
  })

  function startPlan(planId) {
    progress.value = {
      planId,
      currentDay: 0,
      completedDays: [],
      startDate: Date.now()
    }
    saveProgress(progress.value)
  }

  function completeToday() {
    const day = progress.value.currentDay
    if (!progress.value.completedDays.includes(day)) {
      progress.value.completedDays.push(day)
      progress.value.currentDay = day + 1
      saveProgress(progress.value)
    }
  }

  function resetPlan() {
    progress.value = { planId: null, currentDay: 0, completedDays: [], startDate: null }
    saveProgress(progress.value)
  }

  return {
    plans: READING_PLANS,
    progress,
    activePlan,
    todayReadings,
    totalDays,
    daysCompleted,
    percentComplete,
    startPlan,
    completeToday,
    resetPlan
  }
}
