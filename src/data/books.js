export function findBook(input) {
  if (!input) return null
  const q = input.toString().toLowerCase().trim()

  // Try exact ID match first
  let match = books.find(b => b.id === q)
  if (match) return match

  // Try exact name match (case-insensitive)
  match = books.find(b => b.name.toLowerCase() === q)
  if (match) return match

  // Try name starts with
  match = books.find(b => b.name.toLowerCase().startsWith(q))
  if (match) return match

  // Try ID starts with
  match = books.find(b => b.id.startsWith(q))
  if (match) return match

  // Try name contains
  match = books.find(b => b.name.toLowerCase().includes(q))
  if (match) return match

  return null
}

export const books = [
  // Testameta Taloha (39 books)
  { id: 'genesisy', name: 'Genesisy', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 50, file: 'Testameta/taloha/Genesisy.json' },
  { id: 'eksodosy', name: 'Eksodosy', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 40, file: 'Testameta/taloha/Eksodosy.json' },
  { id: 'levitikosy', name: 'Levitikosy', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 27, file: 'Testameta/taloha/Levitikosy.json' },
  { id: 'nomery', name: 'Nomery', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 36, file: 'Testameta/taloha/Nomery.json' },
  { id: 'deoteronomia', name: 'Deoteronomia', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 34, file: 'Testameta/taloha/Deoteronomia.json' },
  { id: 'josoa', name: 'Josoa', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 24, file: 'Testameta/taloha/Josoa.json' },
  { id: 'mpitsara', name: 'Mpitsara', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 21, file: 'Testameta/taloha/Mpitsara.json' },
  { id: 'rota', name: 'Rota', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 4, file: 'Testameta/taloha/Rota.json' },
  { id: 'i-samoela', name: 'I Samoela', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 31, file: 'Testameta/taloha/I Samoela.json' },
  { id: 'ii-samoela', name: 'II Samoela', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 24, file: 'Testameta/taloha/II Samoela.json' },
  { id: 'i-mpanjaka', name: 'I Mpanjaka', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 22, file: 'Testameta/taloha/I Mpanjaka.json' },
  { id: 'ii-mpanjaka', name: 'II Mpanjaka', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 25, file: 'Testameta/taloha/II Mpanjaka.json' },
  { id: 'i-tantara', name: 'I Tantara', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 29, file: 'Testameta/taloha/I Tantara.json' },
  { id: 'ii-tantara', name: 'II Tantara', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 36, file: 'Testameta/vaovao/II Tantara.json' },
  { id: 'ezra', name: 'Ezra', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 10, file: 'Testameta/taloha/Ezra.json' },
  { id: 'nehemia', name: 'Nehemia', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 13, file: 'Testameta/taloha/Nehemia.json' },
  { id: 'estera', name: 'Estera', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 10, file: 'Testameta/taloha/Estera.json' },
  { id: 'joba', name: 'Joba', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 42, file: 'Testameta/taloha/Joba.json' },
  { id: 'salamo', name: 'Salamo', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 150, file: 'Testameta/taloha/Salamo.json' },
  { id: 'ohabolana', name: 'Ohabolana', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 31, file: 'Testameta/taloha/Ohabolana.json' },
  { id: 'mpitoriteny', name: 'Mpitoriteny', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 12, file: 'Testameta/taloha/Mpitoriteny.json' },
  { id: 'tononkirani-solomona', name: "Tononkiran'i Solomona", testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 8, file: "Testameta/taloha/Tononkiran'i Solomona.json" },
  { id: 'isaia', name: 'Isaia', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 66, file: 'Testameta/taloha/Isaia.json' },
  { id: 'jeremia', name: 'Jeremia', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 52, file: 'Testameta/taloha/Jeremia.json' },
  { id: 'fitomaniana', name: 'Fitomaniana', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 5, file: 'Testameta/taloha/Fitomaniana.json' },
  { id: 'ezekiela', name: 'Ezekiela', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 48, file: 'Testameta/taloha/Ezekiela.json' },
  { id: 'daniela', name: 'Daniela', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 12, file: 'Testameta/taloha/Daniela.json' },
  { id: 'hosea', name: 'Hosea', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 14, file: 'Testameta/taloha/Hosea.json' },
  { id: 'joela', name: 'Joela', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 3, file: 'Testameta/taloha/Joela.json' },
  { id: 'amosa', name: 'Amosa', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 9, file: 'Testameta/taloha/Amosa.json' },
  { id: 'obadia', name: 'Obadia', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 1, file: 'Testameta/taloha/Obadia.json' },
  { id: 'jona', name: 'Jona', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 4, file: 'Testameta/taloha/Jona.json' },
  { id: 'mika', name: 'Mika', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 7, file: 'Testameta/taloha/Mika.json' },
  { id: 'nahoma', name: 'Nahoma', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 3, file: 'Testameta/taloha/Nahoma.json' },
  { id: 'habakoka', name: 'Habakoka', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 3, file: 'Testameta/taloha/Habakoka.json' },
  { id: 'zefania', name: 'Zefania', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 3, file: 'Testameta/taloha/Zefania.json' },
  { id: 'hagay', name: 'Hagay', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 2, file: 'Testameta/taloha/Hagay.json' },
  { id: 'zakaria', name: 'Zakaria', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 14, file: 'Testameta/taloha/Zakaria.json' },
  { id: 'malakia', name: 'Malakia', testament: 'taloha', testamentLabel: 'Testameta Taloha', chapters: 4, file: 'Testameta/taloha/Malakia.json' },
  // Testameta Vaovao (27 books)
  { id: 'matio', name: 'Matio', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 28, file: 'Testameta/vaovao/Matio.json' },
  { id: 'marka', name: 'Marka', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 16, file: 'Testameta/vaovao/Marka.json' },
  { id: 'lioka', name: 'Lioka', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 24, file: 'Testameta/vaovao/Lioka.json' },
  { id: 'jaona', name: 'Jaona', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 21, file: 'Testameta/vaovao/Jaona.json' },
  { id: 'asanny-apostoly', name: "Asan'ny Apostoly", testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 28, file: "Testameta/vaovao/Asan'ny Apostoly.json" },
  { id: 'romana', name: 'Romana', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 16, file: 'Testameta/taloha/Romana.json' },
  { id: 'i-korintiana', name: 'I Korintiana', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 16, file: 'Testameta/vaovao/I Korintiana.json' },
  { id: 'ii-korintiana', name: 'II Korintiana', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 13, file: 'Testameta/vaovao/II Korintiana.json' },
  { id: 'galatiana', name: 'Galatiana', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 6, file: 'Testameta/vaovao/Galatiana.json' },
  { id: 'efesiana', name: 'Efesiana', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 6, file: 'Testameta/vaovao/Efesiana.json' },
  { id: 'filipiana', name: 'Filipiana', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 4, file: 'Testameta/vaovao/Filipiana.json' },
  { id: 'kolosiana', name: 'Kolosiana', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 4, file: 'Testameta/vaovao/Kolosiana.json' },
  { id: 'i-tesaloniana', name: 'I Tesaloniana', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 5, file: 'Testameta/vaovao/I Tesaloniana.json' },
  { id: 'ii-tesaloniana', name: 'II Tesaloniana', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 3, file: 'Testameta/vaovao/II Tesaloniana.json' },
  { id: 'i-timoty', name: 'I Timoty', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 6, file: 'Testameta/vaovao/I Timoty.json' },
  { id: 'ii-timoty', name: 'II Timoty', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 4, file: 'Testameta/vaovao/II Timoty.json' },
  { id: 'titosy', name: 'Titosy', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 3, file: 'Testameta/vaovao/Titosy.json' },
  { id: 'filemona', name: 'Filemona', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 1, file: 'Testameta/vaovao/Filemona.json' },
  { id: 'hebreo', name: 'Hebreo', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 13, file: 'Testameta/vaovao/Hebreo.json' },
  { id: 'jakoba', name: 'Jakoba', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 5, file: 'Testameta/vaovao/Jakoba.json' },
  { id: 'i-petera', name: 'I Petera', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 5, file: 'Testameta/vaovao/I Petera.json' },
  { id: 'ii-petera', name: 'II Petera', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 3, file: 'Testameta/vaovao/II Petera.json' },
  { id: 'i-jaona', name: 'I Jaona', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 5, file: 'Testameta/vaovao/I Jaona.json' },
  { id: 'ii-jaona', name: 'II Jaona', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 1, file: 'Testameta/vaovao/II Jaona.json' },
  { id: 'iii-jaona', name: 'III Jaona', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 1, file: 'Testameta/vaovao/III Jaona.json' },
  { id: 'joda', name: 'Joda', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 1, file: 'Testameta/vaovao/Joda.json' },
  { id: 'apokalypsy', name: 'Apokalypsy', testament: 'vaovao', testamentLabel: 'Testameta Vaovao', chapters: 22, file: 'Testameta/vaovao/Apokalypsy.json' },
]
