/* Past registrations (היסטוריית הרשמות) per child. */

export const history = [
  {
    id: 'h1',
    childId: 'alon',
    title: 'מחנה פסח – שכבה ז\'',
    season: 'אביב 2024',
    date: '02/04/24',
    amountILS: 980,
    status: 'completed', // הושלם
  },
  {
    id: 'h2',
    childId: 'alon',
    title: 'טיול שבטי – מכתש רמון',
    season: 'חורף 2024',
    date: '12/01/24',
    amountILS: 150,
    status: 'completed',
  },
  {
    id: 'h3',
    childId: 'michael',
    title: 'מפקד פתיחת שנה',
    season: 'סתיו 2023',
    date: '08/09/23',
    amountILS: 0,
    status: 'completed',
  },
  {
    id: 'h4',
    childId: 'michael',
    title: 'סדנת בנים-בנות',
    season: 'חורף 2024',
    date: '20/02/24',
    amountILS: 60,
    status: 'cancelled', // בוטל
  },
  {
    id: 'h5',
    childId: 'daniela',
    title: 'יום שיא שכבת ד\'',
    season: 'אביב 2024',
    date: '17/05/24',
    amountILS: 45,
    status: 'completed',
  },
  /* Upcoming (already paid, happening soon). Dates are relative to
   * today (2026-06-13) so the "ימים" countdown stays meaningful. */
  {
    id: 'u1',
    childId: 'alon',
    title: 'פמ"ל (פעילויות משולבות לתשלום) שכבה ז׳-ח׳',
    season: 'קיץ 2026',
    date: '20/06/26',
    location: 'שבט אופק, תל אביב',
    amountILS: 0,
    status: 'upcoming',
  },
  {
    id: 'u2',
    childId: 'michael',
    title: 'מסע שכבה - הרי ירושלים',
    season: 'קיץ 2026',
    date: '25/06/26',
    location: 'יער ירושלים',
    amountILS: 220,
    status: 'upcoming',
  },
  {
    id: 'u3',
    childId: 'daniela',
    title: 'יום פעילות שיא',
    season: 'קיץ 2026',
    date: '02/07/26',
    location: 'פארק הירקון',
    amountILS: 60,
    status: 'upcoming',
  },
]

/* Past refunds (זיכויים) credited back to the family account. Shown in
 * a second table below the history list on the History page. */
export const refunds = [
  {
    id: 'r1',
    childId: 'michael',
    title: 'סדנת בנים-בנות',
    date: '22/02/24',
    amountILS: 60,
    reason: 'ביטול עד 14 ימי עסקים',
  },
  {
    id: 'r2',
    childId: 'alon',
    title: 'הנחת אחים — מחנה פסח',
    date: '03/04/24',
    amountILS: 98,
    reason: 'הנחת אחים',
  },
]

export const STATUS_LABELS = {
  completed: 'הושלם',
  cancelled: 'בוטל',
  active: 'פעיל',
  upcoming: 'קרוב',
}

/* Parse the DD/MM/YY date strings used across history rows. */
export const parseHistoryDate = (str) => {
  const [d, m, y] = String(str).split('/').map(Number)
  return new Date(2000 + y, m - 1, d)
}

export const upcomingForChild = (childId, today = new Date()) =>
  history
    .filter((h) => h.status === 'upcoming' && h.childId === childId)
    .map((h) => ({ ...h, _at: parseHistoryDate(h.date) }))
    .filter((h) => h._at >= startOfDay(today))
    .sort((a, b) => a._at - b._at)

function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

export const historyForChild = (childId) =>
  history.filter((h) => h.childId === childId)
