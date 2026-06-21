/* Single source of truth for the prototype's route base + nav structure.
 *
 * Two builds use this file:
 *  - Portfolio build → prototype is nested under /work/israeli-scouts/demo
 *  - Standalone Scouts demo build (vite.scouts.config.js sets the env flag)
 *    → prototype sits at the site root, so the base is empty. */

export const BASE = import.meta.env.VITE_SCOUTS_STANDALONE === 'true'
  ? ''
  : '/work/israeli-scouts/demo'

export const path = (sub = '') => (sub ? `${BASE}/${sub}` : BASE)

/* Sidebar nav items (icon names resolved in Sidebar.jsx). */
export const NAV = [
  { to: path('dashboard'), label: 'פעילויות והרשמות', icon: 'FileSearch2' },
  { to: path('family'), label: 'המשפחה שלי וחניכים', icon: 'Users' },
  { to: path('history'), label: 'היסטוריית הרשמות וזיכויים', icon: 'History' },
  { to: path('contact'), label: 'פנייה לשבט', icon: 'MessageSquare' },
  { to: path('discounts'), label: 'הנחות חבר', icon: 'BadgePercent' },
]

/* Page titles shown in the topbar, keyed by the last path segment. */
export const TITLES = {
  dashboard: 'פעילויות והרשמות',
  family: 'המשפחה שלי וחניכים',
  history: 'היסטוריית הרשמות וזיכויים',
  contact: 'פנייה לשבט',
  discounts: 'הנחות חבר',
  'add-child': 'הוספת חניך',
  checkout: 'הצהרת הורה ותשלום',
}
