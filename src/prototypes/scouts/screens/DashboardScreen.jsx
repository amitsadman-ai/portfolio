import { useRef, useState } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  CalendarClock,
  CalendarPlus,
  MapPin,
} from 'lucide-react'
import ChildTabs from '../components/ChildTabs'
import ActivityCard from '../components/ActivityCard'
import { useScouts } from '../ScoutsProvider'
import { activitiesForChild } from '../data/activities'
import { upcomingForChild } from '../data/history'
import './screens.css'

/* Horizontal activity gallery with a "more →" arrow that scrolls one
 * card-width per click. The arrow hides once the user has scrolled to
 * the LTR start (which in RTL is the visual left edge — end of list). */
function GalleryWithArrow({ children }) {
  const ref = useRef(null)
  const [atEnd, setAtEnd] = useState(false)
  const [atStart, setAtStart] = useState(true)
  const handleScroll = () => {
    const el = ref.current
    if (!el) return
    // In RTL, scrollLeft is negative; "start" is 0 and "end" is when
    // |scrollLeft| has consumed the full scrollable width.
    const max = el.scrollWidth - el.clientWidth
    setAtEnd(Math.abs(el.scrollLeft) >= max - 4)
    setAtStart(Math.abs(el.scrollLeft) <= 4)
  }
  const stepSize = () => {
    const el = ref.current
    const card = el?.querySelector('.s-acard')
    return card ? card.clientWidth + 18 : 280
  }
  const handleNext = () => {
    // RTL: scroll toward negative direction to reveal more cards
    ref.current?.scrollBy({ left: -stepSize(), behavior: 'smooth' })
  }
  const handlePrev = () => {
    // RTL: scroll toward 0 to go back to the start
    ref.current?.scrollBy({ left: stepSize(), behavior: 'smooth' })
  }
  return (
    <div className="s-acard-gallery-wrap">
      <div
        ref={ref}
        className="s-acard-gallery"
        onScroll={handleScroll}
      >
        {children}
      </div>
      <button
        type="button"
        className="s-acard-gallery-arrow s-acard-gallery-arrow--next"
        onClick={handleNext}
        disabled={atEnd}
        aria-label="הצגת פעילויות נוספות"
      >
        <ChevronLeft size={22} />
      </button>
      <button
        type="button"
        className="s-acard-gallery-arrow s-acard-gallery-arrow--prev"
        onClick={handlePrev}
        disabled={atStart}
        aria-label="חזרה לפעילויות הקודמות"
      >
        <ChevronRight size={22} />
      </button>
    </div>
  )
}

export default function DashboardScreen() {
  const { roster, activeChildId, setActiveChildId } = useScouts()

  const activeChild = roster.find((c) => c.id === activeChildId) || roster[0]
  const openActivities = activitiesForChild(activeChild)
  /* Today is fixed for the prototype so the "in X days" labels stay stable
   * regardless of when the demo is viewed. */
  const upcoming = upcomingForChild(activeChild.id, new Date('2026-06-13'))

  return (
    <div>
      <div className="s-childtabs-block">
        <h3 className="s-childtabs-block__title">חניכים פעילים</h3>
        <p className="s-childtabs-block__subtitle">
          בחרו חניך כדי לראות את הפעילויות הקרובות והעתידיות לשכבה שלו
        </p>
        <ChildTabs
          roster={roster}
          activeId={activeChildId}
          onChange={setActiveChildId}
          variant="pill"
        />
      </div>

      {upcoming.length > 0 && (
        <section className="s-section">
          <div className="s-section__head">
            <div>
              <h2 className="s-section__title">אירועים קרובים</h2>
              <p className="s-section__subtitle">
                פעילויות שכבר שולמו ויתקיימו בקרוב
              </p>
            </div>
          </div>
          <div className="s-upcoming">
            {upcoming.map((u) => (
              <UpcomingCard
                key={u.id}
                event={u}
                today={new Date('2026-06-13')}
              />
            ))}
          </div>
        </section>
      )}

      {/* Activities open for registration */}
      <section className="s-section">
        <div className="s-section__head">
          <div>
            <h2 className="s-section__title">פעילויות פתוחות להרשמה</h2>
            <p className="s-section__note">
              במידה והפעילויות חסומות לתשלום, ייתכן ולא רכשת/השלמת רכישה של מיסי
              חבר לשנה זאת.
              <br />
              לאחר השלמה של תשלום זה, תיפתח האופציה לרישום לפעילויות הנוספות.
            </p>
          </div>
        </div>

        {openActivities.length ? (
          openActivities.length > 4 ? (
            <GalleryWithArrow>
              {openActivities.map((a) => (
                <ActivityCard
                  key={a.id}
                  activity={a}
                  childId={activeChild.id}
                />
              ))}
            </GalleryWithArrow>
          ) : (
            <div className="s-acard-grid">
              {openActivities.map((a) => (
                <ActivityCard
                  key={a.id}
                  activity={a}
                  childId={activeChild.id}
                />
              ))}
            </div>
          )
        ) : (
          <div className="s-empty">
            <span className="s-empty__emoji">🏕️</span>
            אין כרגע פעילויות פתוחות עבור {activeChild.firstName}.
          </div>
        )}
      </section>

    </div>
  )
}


/* Tile for an upcoming (already-paid) event, sorted by closeness to today.
 * Shows a "in X days" countdown so the parent sees at a glance how soon
 * it is. */
function UpcomingCard({ event, today }) {
  const days = Math.round((event._at - startOfDay(today)) / (24 * 60 * 60 * 1000))
  const countdown =
    days === 0 ? 'היום' : days === 1 ? 'מחר' : `בעוד ${days} ימים`

  return (
    <article className="s-upcoming__card">
      <div className="s-upcoming__head">
        <span className="s-upcoming__countdown">{countdown}</span>
        <button
          type="button"
          className="s-upcoming__addcal"
          onClick={() => downloadIcs(event)}
        >
          <CalendarPlus size={15} />
          <span>הוסף ליומן</span>
        </button>
      </div>
      <h3 className="s-upcoming__title">{event.title}</h3>
      <ul className="s-upcoming__meta">
        <li>
          <CalendarClock size={15} />
          <span className="scouts__ltr">{event.date}</span>
        </li>
        {event.location && (
          <li>
            <MapPin size={15} />
            <span>{event.location}</span>
          </li>
        )}
      </ul>
    </article>
  )
}

/* Build a minimal .ics blob for the given event and trigger a download.
 * All-day event using DTSTART;VALUE=DATE so calendars don't pin a time. */
function downloadIcs(event) {
  const d = event._at
  const dateStr =
    d.getFullYear() +
    String(d.getMonth() + 1).padStart(2, '0') +
    String(d.getDate()).padStart(2, '0')
  const nextDay = new Date(d)
  nextDay.setDate(nextDay.getDate() + 1)
  const nextDayStr =
    nextDay.getFullYear() +
    String(nextDay.getMonth() + 1).padStart(2, '0') +
    String(nextDay.getDate()).padStart(2, '0')

  const escape = (s) => String(s || '').replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')

  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Israeli Scouts Portal//HE',
    'CALSCALE:GREGORIAN',
    'BEGIN:VEVENT',
    `UID:${event.id}@scouts-portal`,
    `DTSTAMP:${dateStr}T000000Z`,
    `DTSTART;VALUE=DATE:${dateStr}`,
    `DTEND;VALUE=DATE:${nextDayStr}`,
    `SUMMARY:${escape(event.title)}`,
    event.location ? `LOCATION:${escape(event.location)}` : null,
    'END:VEVENT',
    'END:VCALENDAR',
    '',
  ].filter(Boolean)

  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${event.id}.ics`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function startOfDay(d) {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}
