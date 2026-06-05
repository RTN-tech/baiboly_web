import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import BibleReader from '../views/BibleReader.vue'
import SearchResults from '../views/SearchResults.vue'
import GoToVerse from '../views/GoToVerse.vue'
import Bookmarks from '../views/Bookmarks.vue'
import NavigatePage from '../views/NavigatePage.vue'
import AboutPage from '../views/AboutPage.vue'
import ReadingPlan from '../views/ReadingPlan.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomePage
  },
  {
    path: '/read/:bookId/:chapter?',
    name: 'Read',
    component: BibleReader,
    props: true
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchResults
  },
  {
    path: '/bookmarks',
    name: 'Bookmarks',
    component: Bookmarks
  },
  {
    path: '/r/:book/:chapter/:verse?',
    name: 'GoToVerse',
    component: GoToVerse
  },
  {
    path: '/r/:book',
    name: 'GoToBook',
    component: GoToVerse
  },
  {
    path: '/navigate',
    name: 'Navigate',
    component: NavigatePage
  },
  {
    path: '/about',
    name: 'About',
    component: AboutPage
  },
  {
    path: '/reading-plan',
    name: 'ReadingPlan',
    component: ReadingPlan
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
