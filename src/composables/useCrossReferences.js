import { books } from '../data/books.js'

// Key cross-references in the Malagasy Bible
// Format: refKey -> array of { bookId, chapter, verse }
// refKey = "bookId-chapter-verse"
const CROSS_REFS = {
  // Genesis
  'genesisy-1-1': [
    { bookId: 'jaona', chapter: 1, verse: 1 },
    { bookId: 'hebreo', chapter: 11, verse: 3 },
    { bookId: 'salamo', chapter: 102, verse: 25 }
  ],
  'genesisy-1-26': [
    { bookId: 'genesisy', chapter: 5, verse: 1 },
    { bookId: 'genesisy', chapter: 9, verse: 6 },
    { bookId: 'salamo', chapter: 8, verse: 5 }
  ],
  'genesisy-2-7': [
    { bookId: 'joba', chapter: 33, verse: 4 },
    { bookId: 'i-korintiana', chapter: 15, verse: 45 }
  ],
  'genesisy-3-15': [
    { bookId: 'romana', chapter: 16, verse: 20 },
    { bookId: 'apokalypsy', chapter: 12, verse: 9 }
  ],
  'genesisy-12-3': [
    { bookId: 'galatiana', chapter: 3, verse: 8 },
    { bookId: 'galatiana', chapter: 3, verse: 16 }
  ],
  'genesisy-15-6': [
    { bookId: 'romana', chapter: 4, verse: 3 },
    { bookId: 'galatiana', chapter: 3, verse: 6 },
    { bookId: 'jakoba', chapter: 2, verse: 23 }
  ],

  // Exodus
  'eksodosy-3-14': [
    { bookId: 'jaona', chapter: 8, verse: 58 },
    { bookId: 'apokalypsy', chapter: 1, verse: 8 }
  ],
  'eksodosy-12-13': [
    { bookId: 'i-korintiana', chapter: 5, verse: 7 },
    { bookId: 'hebreo', chapter: 11, verse: 28 }
  ],
  'eksodosy-20-1': [
    { bookId: 'deoteronomia', chapter: 5, verse: 6 }
  ],
  'eksodosy-20-12': [
    { bookId: 'efesiana', chapter: 6, verse: 2 }
  ],

  // Psalms
  'salamo-1-1': [
    { bookId: 'salamo', chapter: 119, verse: 1 },
    { bookId: 'salamo', chapter: 26, verse: 4 }
  ],
  'salamo-22-1': [
    { bookId: 'matio', chapter: 27, verse: 46 },
    { bookId: 'marka', chapter: 15, verse: 34 }
  ],
  'salamo-22-18': [
    { bookId: 'matio', chapter: 27, verse: 35 },
    { bookId: 'jaona', chapter: 19, verse: 24 }
  ],
  'salamo-23-1': [
    { bookId: 'jaona', chapter: 10, verse: 11 },
    { bookId: 'i-petera', chapter: 2, verse: 25 }
  ],
  'salamo-51-1': [
    { bookId: 'salamo', chapter: 32, verse: 5 },
    { bookId: 'ii-samoela', chapter: 12, verse: 13 }
  ],
  'salamo-118-22': [
    { bookId: 'matio', chapter: 21, verse: 42 },
    { bookId: 'i-petera', chapter: 2, verse: 7 }
  ],
  'salamo-119-105': [
    { bookId: 'ohabolana', chapter: 6, verse: 23 },
    { bookId: 'ii-petera', chapter: 1, verse: 19 }
  ],

  // Isaiah
  'isaia-7-14': [
    { bookId: 'matio', chapter: 1, verse: 23 },
    { bookId: 'lioka', chapter: 1, verse: 31 }
  ],
  'isaia-9-6': [
    { bookId: 'lioka', chapter: 2, verse: 11 },
    { bookId: 'jaona', chapter: 3, verse: 16 }
  ],
  'isaia-11-1': [
    { bookId: 'isaia', chapter: 53, verse: 2 },
    { bookId: 'apokalypsy', chapter: 5, verse: 5 },
    { bookId: 'romana', chapter: 15, verse: 12 }
  ],
  'isaia-40-3': [
    { bookId: 'matio', chapter: 3, verse: 3 },
    { bookId: 'lioka', chapter: 3, verse: 4 }
  ],
  'isaia-53-4': [
    { bookId: 'matio', chapter: 8, verse: 17 },
    { bookId: 'i-petera', chapter: 2, verse: 24 }
  ],
  'isaia-53-5': [
    { bookId: 'romana', chapter: 4, verse: 25 },
    { bookId: 'i-petera', chapter: 2, verse: 24 }
  ],
  'isaia-61-1': [
    { bookId: 'lioka', chapter: 4, verse: 18 }
  ],

  // Jeremiah
  'jeremia-29-11': [
    { bookId: 'romana', chapter: 8, verse: 28 },
    { bookId: 'salamo', chapter: 40, verse: 5 }
  ],
  'jeremia-31-31': [
    { bookId: 'hebreo', chapter: 8, verse: 8 },
    { bookId: 'hebreo', chapter: 9, verse: 15 }
  ],
  'jeremia-33-3': [
    { bookId: 'salamo', chapter: 50, verse: 15 },
    { bookId: 'matio', chapter: 7, verse: 7 }
  ],

  // Ezekiel
  'ezekiela-36-26': [
    { bookId: 'jaona', chapter: 3, verse: 5 },
    { bookId: 'hebreo', chapter: 10, verse: 16 }
  ],

  // Daniel
  'daniela-7-13': [
    { bookId: 'matio', chapter: 24, verse: 30 },
    { bookId: 'matio', chapter: 26, verse: 64 },
    { bookId: 'apokalypsy', chapter: 1, verse: 7 }
  ],

  // Hosea
  'hosea-6-6': [
    { bookId: 'matio', chapter: 9, verse: 13 },
    { bookId: 'matio', chapter: 12, verse: 7 }
  ],
  'hosea-11-1': [
    { bookId: 'matio', chapter: 2, verse: 15 }
  ],

  // Joel
  'joela-2-28': [
    { bookId: 'asa', chapter: 2, verse: 17 },
    { bookId: 'asa', chapter: 2, verse: 18 }
  ],

  // Joel
  'joela-2-32': [
    { bookId: 'romana', chapter: 10, verse: 13 }
  ],

  // Jonah
  'jona-1-17': [
    { bookId: 'matio', chapter: 12, verse: 40 }
  ],

  // Micah
  'mika-5-2': [
    { bookId: 'matio', chapter: 2, verse: 6 },
    { bookId: 'jaona', chapter: 7, verse: 42 }
  ],

  // Habakkuk
  'habakoka-2-4': [
    { bookId: 'romana', chapter: 1, verse: 17 },
    { bookId: 'galatiana', chapter: 3, verse: 11 },
    { bookId: 'hebreo', chapter: 10, verse: 38 }
  ],

  // Malachi
  'malakia-3-1': [
    { bookId: 'matio', chapter: 11, verse: 10 },
    { bookId: 'lioka', chapter: 7, verse: 27 }
  ],
  'malakia-4-5': [
    { bookId: 'matio', chapter: 11, verse: 14 },
    { bookId: 'matio', chapter: 17, verse: 10 },
    { bookId: 'lioka', chapter: 1, verse: 17 }
  ],

  // Matthew
  'matio-1-23': [
    { bookId: 'isaia', chapter: 7, verse: 14 }
  ],
  'matio-2-6': [
    { bookId: 'mika', chapter: 5, verse: 2 }
  ],
  'matio-3-3': [
    { bookId: 'isaia', chapter: 40, verse: 3 }
  ],
  'matio-4-4': [
    { bookId: 'deoteronomia', chapter: 8, verse: 3 }
  ],
  'matio-4-7': [
    { bookId: 'deoteronomia', chapter: 6, verse: 16 }
  ],
  'matio-4-10': [
    { bookId: 'deoteronomia', chapter: 6, verse: 13 }
  ],
  'matio-5-14': [
    { bookId: 'jaona', chapter: 8, verse: 12 },
    { bookId: 'efesiana', chapter: 5, verse: 8 }
  ],
  'matio-5-44': [
    { bookId: 'lioka', chapter: 6, verse: 27 },
    { bookId: 'romana', chapter: 12, verse: 20 }
  ],
  'matio-7-7': [
    { bookId: 'lioka', chapter: 11, verse: 9 },
    { bookId: 'jaona', chapter: 14, verse: 13 }
  ],
  'matio-11-28': [
    { bookId: 'jaona', chapter: 7, verse: 37 },
    { bookId: 'apokalypsy', chapter: 22, verse: 17 }
  ],
  'matio-16-19': [
    { bookId: 'matio', chapter: 18, verse: 18 },
    { bookId: 'jaona', chapter: 20, verse: 23 }
  ],
  'matio-22-37': [
    { bookId: 'deoteronomia', chapter: 6, verse: 5 },
    { bookId: 'lioka', chapter: 10, verse: 27 }
  ],
  'matio-22-39': [
    { bookId: 'levitikosy', chapter: 19, verse: 18 },
    { bookId: 'romana', chapter: 13, verse: 9 }
  ],
  'matio-26-28': [
    { bookId: 'eksodosy', chapter: 24, verse: 8 },
    { bookId: 'hebreo', chapter: 9, verse: 20 }
  ],
  'matio-28-19': [
    { bookId: 'asa', chapter: 1, verse: 8 },
    { bookId: 'marka', chapter: 16, verse: 15 }
  ],

  // Mark
  'marka-10-45': [
    { bookId: 'matio', chapter: 20, verse: 28 },
    { bookId: 'filipiana', chapter: 2, verse: 7 }
  ],
  'marka-16-15': [
    { bookId: 'matio', chapter: 28, verse: 19 },
    { bookId: 'asa', chapter: 1, verse: 8 }
  ],

  // Luke
  'lioka-1-31': [
    { bookId: 'isaia', chapter: 7, verse: 14 },
    { bookId: 'matio', chapter: 1, verse: 21 }
  ],
  'lioka-4-18': [
    { bookId: 'isaia', chapter: 61, verse: 1 }
  ],
  'lioka-6-31': [
    { bookId: 'matio', chapter: 7, verse: 12 }
  ],
  'lioka-15-7': [
    { bookId: 'matio', chapter: 18, verse: 13 },
    { bookId: 'jakoba', chapter: 5, verse: 20 }
  ],

  // John
  'jaona-1-1': [
    { bookId: 'genesisy', chapter: 1, verse: 1 },
    { bookId: 'i-jaona', chapter: 1, verse: 1 }
  ],
  'jaona-1-14': [
    { bookId: 'matio', chapter: 1, verse: 16 },
    { bookId: 'kolosiana', chapter: 2, verse: 9 },
    { bookId: 'galatiana', chapter: 4, verse: 4 }
  ],
  'jaona-1-29': [
    { bookId: 'eksodosy', chapter: 12, verse: 3 },
    { bookId: 'isaia', chapter: 53, verse: 7 },
    { bookId: 'i-petera', chapter: 1, verse: 19 }
  ],
  'jaona-3-3': [
    { bookId: 'jaona', chapter: 1, verse: 13 },
    { bookId: 'i-petera', chapter: 1, verse: 23 }
  ],
  'jaona-3-16': [
    { bookId: 'romana', chapter: 5, verse: 8 },
    { bookId: 'i-jaona', chapter: 4, verse: 9 }
  ],
  'jaona-6-35': [
    { bookId: 'jaona', chapter: 4, verse: 14 },
    { bookId: 'jaona', chapter: 7, verse: 37 }
  ],
  'jaona-8-12': [
    { bookId: 'jaona', chapter: 1, verse: 4 },
    { bookId: 'jaona', chapter: 12, verse: 46 }
  ],
  'jaona-10-11': [
    { bookId: 'jaona', chapter: 10, verse: 14 },
    { bookId: 'hebreo', chapter: 13, verse: 20 },
    { bookId: 'i-petera', chapter: 5, verse: 4 }
  ],
  'jaona-11-25': [
    { bookId: 'jaona', chapter: 5, verse: 24 },
    { bookId: 'i-korintiana', chapter: 15, verse: 22 }
  ],
  'jaona-14-6': [
    { bookId: 'jaona', chapter: 1, verse: 14 },
    { bookId: 'efesiana', chapter: 2, verse: 18 },
    { bookId: 'hebreo', chapter: 10, verse: 20 }
  ],
  'jaona-14-16': [
    { bookId: 'jaona', chapter: 15, verse: 26 },
    { bookId: 'jaona', chapter: 16, verse: 7 },
    { bookId: 'asa', chapter: 2, verse: 33 }
  ],
  'jaona-15-5': [
    { bookId: 'jaona', chapter: 15, verse: 1 },
    { bookId: 'galatiana', chapter: 5, verse: 22 }
  ],

  // Acts
  'asa-1-8': [
    { bookId: 'matio', chapter: 28, verse: 19 },
    { bookId: 'marka', chapter: 16, verse: 15 },
    { bookId: 'asa', chapter: 2, verse: 1 }
  ],
  'asa-2-1': [
    { bookId: 'levitikosy', chapter: 23, verse: 15 }
  ],
  'asa-2-38': [
    { bookId: 'lioka', chapter: 24, verse: 47 },
    { bookId: 'asa', chapter: 8, verse: 16 },
    { bookId: 'matio', chapter: 3, verse: 11 }
  ],
  'asa-4-12': [
    { bookId: 'matio', chapter: 1, verse: 21 },
    { bookId: 'i-korintiana', chapter: 3, verse: 11 },
    { bookId: 'asa', chapter: 10, verse: 43 }
  ],

  // Romans
  'romana-1-17': [
    { bookId: 'habakoka', chapter: 2, verse: 4 },
    { bookId: 'galatiana', chapter: 3, verse: 11 },
    { bookId: 'hebreo', chapter: 10, verse: 38 }
  ],
  'romana-3-23': [
    { bookId: 'galatiana', chapter: 3, verse: 22 },
    { bookId: 'i-jaona', chapter: 1, verse: 8 }
  ],
  'romana-5-8': [
    { bookId: 'jaona', chapter: 3, verse: 16 },
    { bookId: 'i-jaona', chapter: 4, verse: 10 }
  ],
  'romana-6-23': [
    { bookId: 'efesiana', chapter: 2, verse: 8 },
    { bookId: 'jaona', chapter: 3, verse: 16 },
    { bookId: 'genesisy', chapter: 2, verse: 17 }
  ],
  'romana-8-28': [
    { bookId: 'efesiana', chapter: 1, verse: 11 },
    { bookId: 'jeremia', chapter: 29, verse: 11 }
  ],
  'romana-10-9': [
    { bookId: 'matio', chapter: 10, verse: 32 },
    { bookId: 'asa', chapter: 8, verse: 37 }
  ],
  'romana-12-1': [
    { bookId: 'i-petera', chapter: 2, verse: 5 },
    { bookId: 'hebreo', chapter: 13, verse: 15 }
  ],

  // 1 Corinthians
  'i-korintiana-2-9': [
    { bookId: 'isaia', chapter: 64, verse: 4 },
    { bookId: 'i-petera', chapter: 1, verse: 12 }
  ],
  'i-korintiana-6-19': [
    { bookId: 'i-korintiana', chapter: 3, verse: 16 },
    { bookId: 'efesiana', chapter: 2, verse: 21 },
    { bookId: 'ii-korintiana', chapter: 6, verse: 16 }
  ],
  'i-korintiana-10-13': [
    { bookId: 'ii-petera', chapter: 2, verse: 9 },
    { bookId: 'hebreo', chapter: 4, verse: 15 }
  ],
  'i-korintiana-13-1': [
    { bookId: 'matio', chapter: 22, verse: 37 },
    { bookId: 'i-jaona', chapter: 4, verse: 8 }
  ],
  'i-korintiana-15-3': [
    { bookId: 'isaia', chapter: 53, verse: 5 },
    { bookId: 'galatiana', chapter: 1, verse: 4 },
    { bookId: 'i-petera', chapter: 2, verse: 24 }
  ],
  'i-korintiana-15-4': [
    { bookId: 'salamo', chapter: 16, verse: 10 },
    { bookId: 'matio', chapter: 12, verse: 40 },
    { bookId: 'asa', chapter: 2, verse: 31 }
  ],

  // 2 Corinthians
  'ii-korintiana-5-17': [
    { bookId: 'galatiana', chapter: 6, verse: 15 },
    { bookId: 'efesiana', chapter: 4, verse: 24 },
    { bookId: 'apokalypsy', chapter: 21, verse: 5 }
  ],
  'ii-korintiana-9-7': [
    { bookId: 'deoteronomia', chapter: 15, verse: 7 },
    { bookId: 'ohabolana', chapter: 22, verse: 9 }
  ],

  // Galatians
  'galatiana-5-22': [
    { bookId: 'jaona', chapter: 15, verse: 2 },
    { bookId: 'efesiana', chapter: 5, verse: 9 }
  ],

  // Ephesians
  'efesiana-2-8': [
    { bookId: 'romana', chapter: 3, verse: 24 },
    { bookId: 'ii-timoty', chapter: 1, verse: 9 }
  ],
  'efesiana-2-10': [
    { bookId: 'jaona', chapter: 15, verse: 16 },
    { bookId: 'titosy', chapter: 2, verse: 14 }
  ],
  'efesiana-4-26': [
    { bookId: 'salamo', chapter: 4, verse: 4 }
  ],
  'efesiana-5-18': [
    { bookId: 'ohabolana', chapter: 23, verse: 31 },
    { bookId: 'lioka', chapter: 21, verse: 34 }
  ],
  'efesiana-6-1': [
    { bookId: 'kolosiana', chapter: 3, verse: 20 },
    { bookId: 'ohabolana', chapter: 6, verse: 20 }
  ],

  // Philippians
  'filipiana-2-6': [
    { bookId: 'jaona', chapter: 1, verse: 1 },
    { bookId: 'kolosiana', chapter: 1, verse: 15 },
    { bookId: 'hebreo', chapter: 1, verse: 3 }
  ],
  'filipiana-2-10': [
    { bookId: 'isaia', chapter: 45, verse: 23 },
    { bookId: 'romana', chapter: 14, verse: 11 }
  ],
  'filipiana-4-13': [
    { bookId: 'jaona', chapter: 15, verse: 5 },
    { bookId: 'ii-korintiana', chapter: 12, verse: 9 }
  ],

  // Colossians
  'kolosiana-1-15': [
    { bookId: 'hebreo', chapter: 1, verse: 3 },
    { bookId: 'jaona', chapter: 1, verse: 18 },
    { bookId: 'ii-korintiana', chapter: 4, verse: 4 }
  ],

  // 1 Thessalonians
  'i-tesaloniana-4-16': [
    { bookId: 'matio', chapter: 24, verse: 31 },
    { bookId: 'i-korintiana', chapter: 15, verse: 52 },
    { bookId: 'apokalypsy', chapter: 20, verse: 6 }
  ],

  // 1 Timothy
  'i-timoty-2-5': [
    { bookId: 'hebreo', chapter: 9, verse: 15 },
    { bookId: 'i-jaona', chapter: 2, verse: 1 }
  ],
  'i-timoty-6-10': [
    { bookId: 'ohabolana', chapter: 28, verse: 20 },
    { bookId: 'hebreo', chapter: 13, verse: 5 }
  ],

  // 2 Timothy
  'ii-timoty-3-16': [
    { bookId: 'ii-petera', chapter: 1, verse: 21 },
    { bookId: 'romana', chapter: 15, verse: 4 }
  ],

  // Hebrews
  'hebreo-1-1': [
    { bookId: 'nomery', chapter: 12, verse: 6 },
    { bookId: 'matio', chapter: 1, verse: 1 }
  ],
  'hebreo-1-3': [
    { bookId: 'jaona', chapter: 1, verse: 14 },
    { bookId: 'filipiana', chapter: 2, verse: 6 },
    { bookId: 'kolosiana', chapter: 1, verse: 15 }
  ],
  'hebreo-4-12': [
    { bookId: 'efesiana', chapter: 6, verse: 17 },
    { bookId: 'i-petera', chapter: 1, verse: 23 }
  ],
  'hebreo-11-1': [
    { bookId: 'romana', chapter: 8, verse: 24 },
    { bookId: 'ii-korintiana', chapter: 5, verse: 7 },
    { bookId: 'hebreo', chapter: 10, verse: 39 }
  ],

  // James
  'jakoba-1-2': [
    { bookId: 'romana', chapter: 5, verse: 3 },
    { bookId: 'i-petera', chapter: 1, verse: 6 }
  ],
  'jakoba-2-17': [
    { bookId: 'galatiana', chapter: 5, verse: 6 },
    { bookId: 'i-jaona', chapter: 3, verse: 17 }
  ],
  'jakoba-5-14': [
    { bookId: 'marka', chapter: 6, verse: 13 },
    { bookId: 'lioka', chapter: 10, verse: 34 }
  ],

  // 1 Peter
  'i-petera-1-3': [
    { bookId: 'efesiana', chapter: 1, verse: 3 },
    { bookId: 'titosy', chapter: 3, verse: 5 }
  ],
  'i-petera-2-9': [
    { bookId: 'eksodosy', chapter: 19, verse: 6 },
    { bookId: 'deoteronomia', chapter: 7, verse: 6 },
    { bookId: 'apokalypsy', chapter: 1, verse: 6 }
  ],
  'i-petera-5-7': [
    { bookId: 'salamo', chapter: 55, verse: 22 },
    { bookId: 'matio', chapter: 6, verse: 25 }
  ],

  // 2 Peter
  'ii-petera-1-4': [
    { bookId: 'ii-korintiana', chapter: 7, verse: 1 },
    { bookId: 'i-jaona', chapter: 3, verse: 2 }
  ],

  // 1 John
  'i-jaona-1-1': [
    { bookId: 'jaona', chapter: 1, verse: 1 },
    { bookId: 'lioka', chapter: 24, verse: 39 }
  ],
  'i-jaona-3-1': [
    { bookId: 'jaona', chapter: 1, verse: 12 },
    { bookId: 'efesiana', chapter: 1, verse: 5 }
  ],
  'i-jaona-4-8': [
    { bookId: 'jaona', chapter: 3, verse: 16 },
    { bookId: 'i-jaona', chapter: 4, verse: 16 },
    { bookId: 'jaona', chapter: 15, verse: 13 }
  ],
  'i-jaona-4-19': [
    { bookId: 'jaona', chapter: 15, verse: 16 },
    { bookId: 'i-jaona', chapter: 4, verse: 10 }
  ],

  // Revelation
  'apokalypsy-1-8': [
    { bookId: 'apokalypsy', chapter: 21, verse: 6 },
    { bookId: 'apokalypsy', chapter: 22, verse: 13 },
    { bookId: 'isaia', chapter: 41, verse: 4 }
  ],
  'apokalypsy-1-18': [
    { bookId: 'romana', chapter: 6, verse: 9 },
    { bookId: 'efesiana', chapter: 1, verse: 20 },
    { bookId: 'apokalypsy', chapter: 2, verse: 8 }
  ],
  'apokalypsy-3-20': [
    { bookId: 'lioka', chapter: 12, verse: 36 },
    { bookId: 'jaona', chapter: 14, verse: 23 }
  ],
  'apokalypsy-21-1': [
    { bookId: 'isaia', chapter: 65, verse: 17 },
    { bookId: 'ii-petera', chapter: 3, verse: 13 }
  ],
  'apokalypsy-21-4': [
    { bookId: 'isaia', chapter: 25, verse: 8 },
    { bookId: 'isaia', chapter: 35, verse: 10 },
    { bookId: 'i-korintiana', chapter: 15, verse: 54 }
  ],
  'apokalypsy-22-17': [
    { bookId: 'jaona', chapter: 7, verse: 37 },
    { bookId: 'apokalypsy', chapter: 21, verse: 6 },
    { bookId: 'isaia', chapter: 55, verse: 1 }
  ]
}

export function useCrossReferences(bookId, chapter, verse) {
  const key = `${bookId}-${chapter}-${verse}`
  const refs = CROSS_REFS[key] || []
  return { refs, key }
}

export function getCrossReferences(bookId, chapter, verse) {
  const key = `${bookId}-${chapter}-${verse}`
  return CROSS_REFS[key] || []
}

// Find any bookId from text reference like "Gen 1:1" or "Salamo 23:1"
export function findReferenceInText(text) {
  const patterns = [
    // Matio 1:1, Jaona 3:16, etc
    /(\p{L}+(?:['’]\p{L}+)?)\s+(\d+)\s*:\s*(\d+)/giu,
    // Romana 8, Salamo 23 (chapter only)
    /(\p{L}+(?:['’]\p{L}+)?)\s+(\d+)\b(?!\s*:)/giu
  ]
  return patterns
}

export const BOOK_NAME_MAP = {}
for (const book of books) {
  BOOK_NAME_MAP[book.name.toLowerCase()] = book.id
  // Also map some common abbreviations
  if (book.id === 'genesisy') BOOK_NAME_MAP['gen'] = 'genesisy'
  if (book.id === 'eksodosy') BOOK_NAME_MAP['eks'] = 'eksodosy'
  if (book.id === 'salamo') { BOOK_NAME_MAP['sal'] = 'salamo'; BOOK_NAME_MAP['ps'] = 'salamo' }
  if (book.id === 'ohabolana') BOOK_NAME_MAP['oho'] = 'ohabolana'
  if (book.id === 'jaona') { BOOK_NAME_MAP['jhn'] = 'jaona'; BOOK_NAME_MAP['john'] = 'jaona' }
  if (book.id === 'matio') BOOK_NAME_MAP['mat'] = 'matio'
  if (book.id === 'marka') BOOK_NAME_MAP['mar'] = 'marka'
  if (book.id === 'lioka') BOOK_NAME_MAP['lioka'] = 'lioka'
  if (book.id === 'asa') { BOOK_NAME_MAP['asanny apostoly'] = 'asanny-apostoly'; BOOK_NAME_MAP['asa'] = 'asanny-apostoly' }
  if (book.id === 'romana') BOOK_NAME_MAP['rom'] = 'romana'
  if (book.id === 'i-korintiana') BOOK_NAME_MAP['1kor'] = 'i-korintiana'
  if (book.id === 'ii-korintiana') BOOK_NAME_MAP['2kor'] = 'ii-korintiana'
  if (book.id === 'galatiana') BOOK_NAME_MAP['gal'] = 'galatiana'
  if (book.id === 'efesiana') BOOK_NAME_MAP['ef'] = 'efesiana'
  if (book.id === 'filipiana') BOOK_NAME_MAP['fil'] = 'filipiana'
  if (book.id === 'apokalypsy') BOOK_NAME_MAP['apo'] = 'apokalypsy'
}
