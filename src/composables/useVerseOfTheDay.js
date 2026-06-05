import { ref, computed } from 'vue'
import { books } from '../data/books.js'

// 30 meaningful Malagasy Bible verses for the daily rotation
const DAILY_VERSES = [
  { bookId: 'jaona', chapter: 3, verse: 16, text: 'Fa toy izao no fitiavan\'Andriamanitra an\'izao tontolo izao: nomeny ny Zanani-lahy Tokana, mba tsy ho very izay rehetra mino Azy, fa hanana fiainana mandrakizay.' },
  { bookId: 'jeremia', chapter: 29, verse: 11, text: 'Fa fantatro ny hevitra izay atorako ho anareo, hoy Jehovah, dia hevitry ny fiadanana, fa tsy hevitry ny loza, hahatonga anareo hahita farany tsara.' },
  { bookId: 'salamo', chapter: 23, verse: 1, text: 'Jehovah no Mpiandry ahy; tsy mba hahitan-tsahona aho.' },
  { bookId: 'salamo', chapter: 23, verse: 4, text: 'Na dia mandeha amin\'ny lohasaha aloky ny fahafatesana aza aho, dia tsy matahotra loza, fa Hiano no momba ahy; ny tsorakazonao sy ny lohanao no mampionona ahy.' },
  { bookId: 'filipiana', chapter: 4, verse: 13, text: 'Zahay mahay ny zavatra rehetra ao amin\'ilay manome hery ahy.' },
  { bookId: 'salamo', chapter: 121, verse: 1, text: 'Manandrina ny masoko hijery ny tendrombohitra: Avy hankaiza no ho tonga ny fanampiako?' },
  { bookId: 'salamo', chapter: 121, verse: 2, text: 'Ny fanampiako dia avy amin\'i Jehovah, Izay nanao ny lanitra sy ny tany.' },
  { bookId: 'isaia', chapter: 41, verse: 10, text: 'Aza matahotra, fa momba anao Aho; aza manjary maso, fa Izaho no Andriamanitrao; Homeko hery ianao, eny, hanampy anao Aho, ary hanohana anao amin\'ny tanako ankavanana marina.' },
  { bookId: 'salamo', chapter: 27, verse: 1, text: 'Jehovah no fahazavako sy famonjena ahy; iza no hatahorako? Jehovah no fiarovana aina ahy; iza no horaisiko?' },
  { bookId: 'jaona', chapter: 14, verse: 6, text: 'Hoy Jesosy taminy: Izaho no lalana sy fahamarinana ary fiainana; tsy misy mankany amin\'ny Ray, afa-tsy amin\'ny alalako.' },
  { bookId: 'romana', chapter: 8, verse: 28, text: 'Ary fantatsika fa ny zavatra rehetra miara-miasa hahita soa ho an\'izay tia an\'Andriamanitra, dia ho an\'izay antsoina araka ny fikasany.' },
  { bookId: 'salamo', chapter: 46, verse: 1, text: 'Andriamanitra no fialofantsika sy herintsika, Mpanampy vonona amin\'ny fahoriana indrindra.' },
  { bookId: 'matio', chapter: 11, verse: 28, text: 'Mankanesa aty amiko, hianareo rehetra izay mikobona sy mavesatra entana, fa Izaho no hanome anareo fitsaharana.' },
  { bookId: 'salamo', chapter: 91, verse: 1, text: 'Izay mitoetra ao amin\'ny fieren\'ny Avo Indrindra no honina ao amin\'ny aloky ny Tsitoha.' },
  { bookId: 'isaia', chapter: 40, verse: 31, text: 'Fa izay miandry an\'i Jehovah no hahazo hery vaovao; hisandratra toy ny voromahery izy; hazakazaka izy, fa tsy ho sasatra; handeha izy, fa tsy ho reraka.' },
  { bookId: 'jaona', chapter: 1, verse: 1, text: 'Tamin\'ny fiandohana ny Teny, ary ny Teny tao amin\'Andriamanitra, ary Andriamanitra ny Teny.' },
  { bookId: 'salamo', chapter: 34, verse: 8, text: 'Tsidiho ka jereo fa tsara i Jehovah; sambatra izay olona mitoetra ao aminy.' },
  { bookId: 'salamo', chapter: 119, verse: 105, text: 'Ny teninao no fanilo ho an\'ny tongotro, Sy fahazavana ho an\'ny lalako.' },
  { bookId: 'josoa', chapter: 1, verse: 9, text: 'Moa tsy nandidy anao va Aho? Mahereza, ka matanjaha; aza matahotra, ary aza kivy, fa momba anao Jehovah Andriamanitra na dia aiza na aiza no alehanao.' },
  { bookId: 'salamo', chapter: 37, verse: 4, text: 'Mifalia ao amin\'i Jehovah, dia homeny anao izay irin\'ny fonao.' },
  { bookId: 'efesiana', chapter: 2, verse: 8, text: 'Fa fahasoavana no namonjena anareo amin\'ny finoana; ary tsy avy aminareo izany, fa fanomezana avy amin\'Andriamanitra.' },
  { bookId: 'salamo', chapter: 62, verse: 8, text: 'Matokia Azy isan\'andro, hianareo olona, aidino eo anatrehany ny fonareo; Andriamanitra no fialofantsika.' },
  { bookId: 'deoteronomia', chapter: 31, verse: 6, text: 'Mahereza, ka matanjaha; aza matahotra, ary aza misahiran-tsaina noho ny tahotra azy; fa Jehovah Andriamanitrao no miara-mandeha aminao; tsy handao anao Izy, na handao anao.' },
  { bookId: 'salamo', chapter: 18, verse: 2, text: 'Jehovah no harambatoko sy vatolampiko ary Mpanafaka ahy; Andriamanitro no Vatolampiko, izay itokiako; ny ampingako, tandroky ny famonjena ahy, fiarovako.' },
  { bookId: 'salamo', chapter: 103, verse: 1, text: 'Mitsaoha an\'i Jehovah, ry fanahiko; ary izay ao anatiko aoka hisaotra ny anarany masina.' },
  { bookId: 'salamo', chapter: 100, verse: 5, text: 'Fa tsara i Jehovah; ny famindrampony maharitra mandrakizay, ary ny fahamarinany mahatratra taranaka fara mandimby.' },
  { bookId: 'salamo', chapter: 84, verse: 10, text: 'Fa aleo ny andro iray ato an-kianjanao noho ny arivo any an-kafa; aleo mijoro eo am-bavahadin\'ny tranon\'Andriamanitro, noho ny mitoetra ao an-dain\'ny ratsy fanahy.' },
  { bookId: 'joba', chapter: 42, verse: 5, text: 'Ny sofiko nahare anao fahiny; fa ankehitriny ny masoko no mahita Anao.' },
  { bookId: 'salamo', chapter: 19, verse: 14, text: 'Aoka ny tenin\'ny vavako sy ny fisain\'ny foko hanalina an\'ilay sitraponao, Jehovah, vatolampiko sy Mpanavotra ahy.' },
  { bookId: 'ohabolana', chapter: 3, verse: 5, text: 'Matokia an\'i Jehovah amin\'ny fonao rehetra, ary aza miantehitra amin\'ny fahalalanao.' },
  { bookId: 'ohabolana', chapter: 3, verse: 6, text: 'Ekeo Aminy amin\'ny lalanao rehetra, dia Izy no hitarika ny dianao.' },
]

export function useVerseOfTheDay() {
  const today = new Date()
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  )

  const verse = computed(() => {
    const idx = dayOfYear % DAILY_VERSES.length
    return DAILY_VERSES[idx]
  })

  const bookInfo = computed(() => {
    const v = verse.value
    if (!v) return null
    const book = books.find(b => b.id === v.bookId)
    return book || null
  })

  const reference = computed(() => {
    const v = verse.value
    if (!v) return ''
    const book = books.find(b => b.id === v.bookId)
    return `${book ? book.name : v.bookId} ${v.chapter}:${v.verse}`
  })

  return {
    verse,
    bookInfo,
    reference
  }
}
