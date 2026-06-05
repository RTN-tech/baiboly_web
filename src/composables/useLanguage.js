import { ref, computed, watch } from 'vue'

const STORAGE_KEY = 'ny-baiboly-lang'
const SUPPORTED = ['mg', 'fr', 'en']

const currentLang = ref('mg')

// Load saved language
try {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved && SUPPORTED.includes(saved)) {
    currentLang.value = saved
  }
} catch {}

const TRANSLATIONS = {
  // ===== GLOBAL =====
  'app.name': {
    mg: 'Ny Baiboly Masina',
    fr: 'La Sainte Bible',
    en: 'The Holy Bible'
  },
  'app.subtitle': {
    mg: "Vakio ny tenin'Andriamanitra amin'ny fiteny malagasy",
    fr: 'Lisez la Parole de Dieu en malgache',
    en: 'Read the Word of God in Malagasy'
  },
  'app.lang.mg': { mg: 'Malagasy', fr: 'Malgache', en: 'Malagasy' },
  'app.lang.fr': { mg: 'Français', fr: 'Français', en: 'French' },
  'app.lang.en': { mg: 'English', fr: 'Anglais', en: 'English' },

  // ===== HOME PAGE =====
  'home.search.placeholder': {
    mg: 'Hikaroka andininy (Ctrl+K)',
    fr: 'Chercher un verset (Ctrl+K)',
    en: 'Search verses (Ctrl+K)'
  },
  'home.quickJump.title': {
    mg: 'Vakio haingana',
    fr: 'Lecture rapide',
    en: 'Quick read'
  },
  'home.quickJump.sub': {
    mg: 'Safidio boky, toko sy andininy',
    fr: 'Choisissez livre, chapitre et verset',
    en: 'Choose book, chapter and verse'
  },
  'home.stats.books': { mg: 'Boky', fr: 'Livres', en: 'Books' },
  'home.stats.chapters': { mg: 'Tokoboky', fr: 'Chapitres', en: 'Chapters' },
  'home.stats.verses': { mg: 'Andininy', fr: 'Verset', en: 'Verses' },
  'home.bookmarks': { mg: 'Marque-pages', fr: 'Marque-pages', en: 'Bookmarks' },
  'home.continueReading': { mg: 'Hanohy hamaky', fr: 'Continuer la lecture', en: 'Continue reading' },
  'home.randomVerse': { mg: 'Andininy kisendra', fr: 'Verset aléatoire', en: 'Random verse' },
  'home.verseOfDay': { mg: 'Andininy andavan\'andro', fr: 'Verset du jour', en: 'Verse of the day' },
  'home.testament.old': { mg: 'Testameta Taloha', fr: 'Ancien Testament', en: 'Old Testament' },
  'home.testament.new': { mg: 'Testameta Vaovao', fr: 'Nouveau Testament', en: 'New Testament' },
  'home.chapters': { mg: 'toko', fr: 'chap.', en: 'ch.' },

  // ===== BIBLE READER =====
  'reader.back': { mg: 'Indray', fr: 'Accueil', en: 'Home' },
  'reader.bookmarks': { mg: 'Marque-pages', fr: 'Marque-pages', en: 'Bookmarks' },
  'reader.chapter': { mg: 'Toko', fr: 'Chapitre', en: 'Chapter' },
  'reader.prevChapter': { mg: 'Toko teo aloha', fr: 'Chapitre précédent', en: 'Previous chapter' },
  'reader.nextChapter': { mg: 'Toko manaraka', fr: 'Chapitre suivant', en: 'Next chapter' },
  'reader.loading': { mg: 'Am-panokafana ny boky...', fr: 'Chargement du livre...', en: 'Loading book...' },
  'reader.error.load': { mg: 'Tsy afaka namaky ilay boky', fr: 'Impossible de charger le livre', en: 'Failed to load the book' },
  'reader.error.notfound': { mg: 'Tsy hita ilay boky', fr: 'Livre introuvable', en: 'Book not found' },
  'reader.backHome': { mg: 'Miverina any an-trano', fr: "Retour à l'accueil", en: 'Back to home' },
  'reader.addBookmark': { mg: 'Ampio marque-page', fr: 'Ajouter un marque-page', en: 'Add bookmark' },
  'reader.removeBookmark': { mg: 'Esory ny marque-page', fr: 'Supprimer le marque-page', en: 'Remove bookmark' },
  'reader.font.increase': { mg: 'Henao lehibe ny soratra', fr: 'Augmenter la taille', en: 'Increase font size' },
  'reader.font.decrease': { mg: 'Henao kely ny soratra', fr: 'Diminuer la taille', en: 'Decrease font size' },
  'reader.font.reset': { mg: 'Averina amin\'ny tany am-boalohany', fr: 'Taille par défaut', en: 'Reset font size' },

  // ===== VERSE ACTIONS =====
  'verse.copy': { mg: 'Soraty', fr: 'Copier', en: 'Copy' },
  'verse.copied': { mg: 'Voasoratra', fr: 'Copié', en: 'Copied' },
  'verse.share': { mg: 'Zara', fr: 'Partager', en: 'Share' },

  // ===== NAVIGATE PAGE =====
  'nav.title': { mg: 'Vakio haingana', fr: 'Lecture rapide', en: 'Quick navigate' },
  'nav.reset': { mg: 'Hanomboka indray', fr: 'Recommencer', en: 'Reset' },
  'nav.step': { mg: 'Dingana', fr: 'Étape', en: 'Step' },
  'nav.step1.title': { mg: 'Fidio ny Testamenta', fr: 'Choisissez le Testament', en: 'Choose the Testament' },
  'nav.step1.desc': { mg: 'Safidio ny Testamenta tianao vakiana', fr: 'Choisissez le Testament à lire', en: 'Select a testament to read' },
  'nav.step2.title': { mg: 'Fidio ny boky', fr: 'Choisissez le livre', en: 'Choose the book' },
  'nav.step2.desc': { mg: 'Fidio ny boky tianao vakiana', fr: 'Choisissez le livre à lire', en: 'Select a book to read' },
  'nav.step3.title': { mg: 'Fidio ny toko', fr: 'Choisissez le chapitre', en: 'Choose the chapter' },
  'nav.step3.desc': { mg: 'Fidio ny toko tianao vakiana', fr: 'Choisissez le chapitre', en: 'Select the chapter' },
  'nav.step4.title': { mg: 'Fidio ny andininy', fr: 'Choisissez le verset', en: 'Choose the verse' },
  'nav.step4.desc': { mg: 'Fidio ny andininy tianao vakiana', fr: 'Choisissez le verset', en: 'Select the verse' },
  'nav.final.title': { mg: 'Vonona ny hamaky', fr: 'Prêt à lire', en: 'Ready to read' },
  'nav.final.read': { mg: 'Hamaky', fr: 'Lire', en: 'Read' },
  'nav.final.change': { mg: 'Hanova', fr: 'Modifier', en: 'Change' },
  'nav.final.verse': { mg: 'Andininy', fr: 'Verset', en: 'Verse' },
  'nav.loading.verses': { mg: 'mikaroka andininy...', fr: 'chargement des versets...', en: 'loading verses...' },
  'nav.loading.book': { mg: 'Am-panokafana ny boky...', fr: 'Chargement du livre...', en: 'Loading book...' },

  // ===== SEARCH =====
  'search.placeholder': { mg: 'Hikaroka andininy ...', fr: 'Chercher des versets ...', en: 'Search verses ...' },
  'search.indexing': { mg: 'Am-panokafana ny boky ...', fr: 'Indexation des livres ...', en: 'Indexing books ...' },
  'search.books': { mg: 'boky', fr: 'livres', en: 'books' },
  'search.results.count': { mg: 'andininy hita', fr: 'versets trouvés', en: 'verses found' },
  'search.verses': { mg: 'andininy', fr: 'versets', en: 'verses' },
  'search.noResults.title': { mg: 'Tsy nisy valiny', fr: 'Aucun résultat', en: 'No results' },
  'search.noResults.text': { mg: 'Tsy nisy andininy hitanay tamin\'ny teny', fr: 'Aucun verset trouvé pour', en: 'No verses found for' },
  'search.noResults.hint': { mg: 'Andramo amin\'ny teny hafa', fr: 'Essayez avec un autre mot', en: 'Try a different word' },
  'search.empty.title': { mg: 'Hikaroka ny Baiboly', fr: 'Chercher dans la Bible', en: 'Search the Bible' },
  'search.empty.desc': { mg: 'Amin\'ny teny malagasy, soraty eto ny teny tadiavina', fr: 'Tapez votre recherche en malgache', en: 'Type your search in Malagasy' },
  'search.filter.all': { mg: 'Rehetra', fr: 'Tous', en: 'All' },
  'search.filter.old': { mg: 'Testameta Taloha', fr: 'Ancien Testament', en: 'Old Testament' },
  'search.filter.new': { mg: 'Testameta Vaovao', fr: 'Nouveau Testament', en: 'New Testament' },
  'search.example': { mg: 'Ohatra:', fr: 'Exemple :', en: 'Example:' },
  'search.tip.fitiavana': { mg: 'fitiavana', fr: 'amour', en: 'love' },
  'search.tip.fahasoavana': { mg: 'fahasoavana', fr: 'grâce', en: 'grace' },
  'search.tip.fanavotana': { mg: 'fanavotana', fr: 'salut', en: 'salvation' },
  'search.more': { mg: 'Misy {{count}} andininy hafa ...', fr: '{{count}} versets supplémentaires ...', en: '{{count}} more verses ...' },

  // ===== BOOKMARKS =====
  'bookmarks.title': { mg: 'Marque-pages', fr: 'Marque-pages', en: 'Bookmarks' },
  'bookmarks.verses': { mg: 'andininy', fr: 'versets', en: 'verses' },
  'bookmarks.empty.title': { mg: 'Tsy misy marque-pages', fr: 'Aucun marque-page', en: 'No bookmarks' },
  'bookmarks.empty.desc': { mg: 'Tsindrio ny kisary eo akaikin\'ny andininy', fr: 'Cliquez sur l\'icône à côté d\'un verset', en: 'Click the icon next to a verse' },
  'bookmarks.browse': { mg: 'Hijery ny boky', fr: 'Parcourir les livres', en: 'Browse books' },
  'bookmarks.remove': { mg: 'Esory', fr: 'Supprimer', en: 'Remove' },
  'bookmarks.clear': { mg: 'Fafao daholo', fr: 'Tout effacer', en: 'Clear all' },
  'bookmarks.clear.confirm': { mg: 'Hofafana daholo ve ny marque-pages rehetra?', fr: 'Supprimer tous les marque-pages ?', en: 'Delete all bookmarks?' },
  'bookmarks.history.title': { mg: 'Tantara', fr: 'Historique', en: 'History' },
  'bookmarks.history.empty.title': { mg: 'Tsy misy tantara', fr: 'Aucun historique', en: 'No history' },
  'bookmarks.history.empty.desc': { mg: 'Hisy ny tantaran\'ny vakinao amin\'ity pejy ity rehefa mamaky Baiboly', fr: 'L\'historique apparaîtra ici quand vous lirez', en: 'Reading history will appear here' },
  'bookmarks.history.start': { mg: 'Manomboka mamaky', fr: 'Commencer à lire', en: 'Start reading' },
  'bookmarks.history.clear.confirm': { mg: 'Hofafana daholo ve ny tantaram-pamakiana?', fr: 'Supprimer tout l\'historique ?', en: 'Delete all reading history?' },
  'bookmarks.tab.bookmarks': { mg: 'Marque-pages', fr: 'Marque-pages', en: 'Bookmarks' },
  'bookmarks.tab.history': { mg: 'Histoire', fr: 'Historique', en: 'History' },
  'bookmarks.famakiana': { mg: 'famakiana', fr: 'lectures', en: 'reads' },

  // ===== INSTALL =====
  'install.title': { mg: 'Ampidiro amin\'ny efijery', fr: 'Installer sur l\'écran', en: 'Install on screen' },
  'install.sub': { mg: 'Tadiavo haingana kokoa', fr: 'Accès plus rapide', en: 'Faster access' },
  'install.dismiss': { mg: 'Aza atao izao', fr: 'Plus tard', en: 'Not now' },

  // ===== DOWNLOAD =====
  'download.label': { mg: 'Télécharger', fr: 'Télécharger', en: 'Download' },
  'download.downloading': { mg: 'Sintona ...', fr: 'Téléchargement...', en: 'Downloading...' },
  'download.complete': { mg: 'Voasintona', fr: 'Téléchargé', en: 'Downloaded' },
  'download.complete.tooltip': { mg: 'Efa voasintona ny Baiboly rehetra', fr: 'Toute la Bible est téléchargée', en: 'All Bible books downloaded' },
  'download.tooltip': { mg: 'Sintono ny Baiboly ho an\'ny fampiasana tsy misy Internet', fr: 'Télécharger la Bible pour utilisation hors-ligne', en: 'Download the Bible for offline use' },
  'download.progress': { mg: '{{loaded}}/{{total}} boky ({{pct}}%)', fr: '{{loaded}}/{{total}} livres ({{pct}}%)', en: '{{loaded}}/{{total}} books ({{pct}}%)' },
  'download.error': { mg: 'Tsy afaka namaky ilay boky', fr: 'Erreur de téléchargement', en: 'Download error' },

  // ===== THEME =====
  'theme.dark': { mg: 'Mifamadika ho maivana', fr: 'Mode clair', en: 'Light mode' },
  'theme.light': { mg: 'Mifamadika ho maizina', fr: 'Mode sombre', en: 'Dark mode' }
}

function t(key, params = {}) {
  const tr = TRANSLATIONS[key]
  if (!tr) return key
  let text = tr[currentLang.value] || tr['mg'] || key
  // Replace {{params}}
  for (const [k, v] of Object.entries(params)) {
    text = text.replace(new RegExp(`\\{\\{${k}\\}\\}`, 'g'), v)
  }
  return text
}

function setLanguage(lang) {
  if (!SUPPORTED.includes(lang)) return
  currentLang.value = lang
  localStorage.setItem(STORAGE_KEY, lang)
  document.documentElement.lang = lang
}

function applyLanguage() {
  document.documentElement.lang = currentLang.value
}

export function useLanguage() {
  applyLanguage()

  const current = computed(() => currentLang.value)
  const isMg = computed(() => currentLang.value === 'mg')
  const isFr = computed(() => currentLang.value === 'fr')
  const isEn = computed(() => currentLang.value === 'en')
  const supported = SUPPORTED

  return {
    current,
    isMg,
    isFr,
    isEn,
    supported,
    t,
    setLanguage,
    applyLanguage
  }
}
