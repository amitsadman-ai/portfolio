import { useMemo, useState } from 'react'
import ChildTabs from '../components/ChildTabs'
import DataTable from '../components/DataTable'
import StatusPill from '../components/StatusPill'
import Price from '../components/Price'
import { useScouts } from '../ScoutsProvider'
import { history, refunds, STATUS_LABELS } from '../data/history'
import './screens.css'

/* History rows are dated "DD/MM/YY" — pull the year for the year-filter. */
const yearOf = (h) => {
  const yy = h.date?.split('/')?.[2]
  return yy ? `20${yy}` : ''
}
/* Parse "DD/MM/YY" into a timestamp for chronological sorting. */
const dateOf = (h) => {
  const parts = h.date?.split('/')?.map(Number) || []
  const [d, m, y] = parts
  if (!d || !m || !y) return 0
  return new Date(2000 + y, m - 1, d).getTime()
}

export default function HistoryScreen() {
  const { roster } = useScouts()
  const [filter, setFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [yearFilter, setYearFilter] = useState('all')
  const [priceSort, setPriceSort] = useState('none') // 'none' | 'desc' | 'asc'

  /* Unique years present in the data, sorted newest first. */
  const years = useMemo(() => {
    const set = new Set(history.map(yearOf).filter(Boolean))
    return [...set].sort((a, b) => Number(b) - Number(a))
  }, [])

  const rows = useMemo(() => {
    let out = history
    if (filter !== 'all') out = out.filter((h) => h.childId === filter)
    if (statusFilter !== 'all')
      out = out.filter((h) => h.status === statusFilter)
    if (yearFilter !== 'all') out = out.filter((h) => yearOf(h) === yearFilter)
    if (priceSort === 'desc')
      return [...out].sort((a, b) => (b.amountILS || 0) - (a.amountILS || 0))
    if (priceSort === 'asc')
      return [...out].sort((a, b) => (a.amountILS || 0) - (b.amountILS || 0))
    /* Default ordering: "קרוב" rows surface at the top, sorted by closest
     * date first so the nearest event is the first thing the parent sees.
     * Past rows keep their natural (data-file) order behind the upcoming
     * block. */
    return [...out].sort((a, b) => {
      const aU = a.status === 'upcoming'
      const bU = b.status === 'upcoming'
      if (aU && !bU) return -1
      if (!aU && bU) return 1
      if (aU && bU) return dateOf(a) - dateOf(b)
      return 0
    })
  }, [filter, statusFilter, yearFilter, priceSort])

  /* Total only counts non-cancelled rows — money wasn't actually spent on
   * cancelled registrations. */
  const totalSpent = rows
    .filter((h) => h.status !== 'cancelled')
    .reduce((sum, h) => sum + (h.amountILS || 0), 0)

  const nameOf = (childId) => roster.find((c) => c.id === childId)?.firstName || ''

  /* Refunds follow the same child filter; status/year/price filters above
   * only apply to the registrations table. */
  const refundRows = useMemo(
    () =>
      filter === 'all'
        ? refunds
        : refunds.filter((r) => r.childId === filter),
    [filter],
  )
  const totalRefunds = refundRows.reduce(
    (sum, r) => sum + (r.amountILS || 0),
    0,
  )

  /* Matched column widths across both tables so the סכום column lines up
   * vertically. Width sums to 100%; the "child" column only appears in the
   * combined view (filter === 'all'), so its slice is conditional. */
  const W = filter === 'all'
    ? { title: '35%', child: '10%', middle: '17%', date: '13%', amount: '12%', trailing: '13%' }
    : { title: '40%', child: null, middle: '20%', date: '14%', amount: '12%', trailing: '14%' }

  const refundColumns = [
    { key: 'title', label: 'פעילות', width: W.title, render: (r) => <strong>{r.title}</strong> },
    ...(filter === 'all'
      ? [{ key: 'child', label: 'חניך', width: W.child, render: (r) => nameOf(r.childId) }]
      : []),
    { key: 'reason', label: 'סיבת הזיכוי', width: W.middle },
    {
      key: 'date',
      label: 'תאריך הזיכוי',
      width: W.date,
      render: (r) => <span className="scouts__ltr">{r.date}</span>,
    },
    {
      key: 'amount',
      label: 'סכום',
      width: W.amount,
      render: (r) => <Price amount={r.amountILS} muted showFreeLabel={false} />,
    },
    /* Empty trailing column matches the registrations table's סטטוס slot
     * so the סכום column lines up vertically across both tables. */
    { key: 'spacer', label: '', width: W.trailing, render: () => null },
  ]

  const columns = [
    { key: 'title', label: 'פעילות', width: W.title, render: (h) => <strong>{h.title}</strong> },
    ...(filter === 'all'
      ? [{ key: 'child', label: 'חניך', width: W.child, render: (h) => nameOf(h.childId) }]
      : []),
    { key: 'season', label: 'עונה', width: W.middle },
    { key: 'date', label: 'תאריך', width: W.date, render: (h) => <span className="scouts__ltr">{h.date}</span> },
    { key: 'amount', label: 'סכום', width: W.amount, render: (h) => <Price amount={h.amountILS} muted showFreeLabel={false} /> },
    { key: 'status', label: 'סטטוס', width: W.trailing, render: (h) => <StatusPill status={h.status} /> },
  ]

  return (
    <section className="s-section">
      <div className="s-section__head">
        <div>
          <h2 className="s-section__title">הרשמות</h2>
          <p className="s-section__subtitle">כל הפעילויות העתידיות והפעילות אליהן ילדכם נרשמו בעבר</p>
        </div>
      </div>

      <ChildTabs
        roster={roster}
        activeId={filter}
        onChange={setFilter}
        includeAll
        variant="pill"
      />

      <div className="history__filters">
        <label className="history__filter">
          <span className="history__filter-label">סטטוס</span>
          <select
            className="s-field__control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">כל הסטטוסים</option>
            <option value="completed">{STATUS_LABELS.completed}</option>
            <option value="cancelled">{STATUS_LABELS.cancelled}</option>
            <option value="upcoming">{STATUS_LABELS.upcoming}</option>
          </select>
        </label>

        <label className="history__filter">
          <span className="history__filter-label">תאריך</span>
          <select
            className="s-field__control"
            value={yearFilter}
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <option value="all">כל השנים</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>

        <label className="history__filter">
          <span className="history__filter-label">סכום</span>
          <select
            className="s-field__control"
            value={priceSort}
            onChange={(e) => setPriceSort(e.target.value)}
          >
            <option value="none">ללא מיון</option>
            <option value="desc">מהגבוה לנמוך</option>
            <option value="asc">מהנמוך לגבוה</option>
          </select>
        </label>

        {(statusFilter !== 'all' ||
          yearFilter !== 'all' ||
          priceSort !== 'none') && (
          <button
            type="button"
            className="history__filter-reset"
            onClick={() => {
              setStatusFilter('all')
              setYearFilter('all')
              setPriceSort('none')
            }}
          >
            איפוס סינון
          </button>
        )}
      </div>

      {rows.length === 0 ? (
        <div className="history__empty s-card">
          <img
            className="history__empty-illustration"
            src="/assets/no-history.svg"
            alt=""
          />
          <p>אין היסטוריית רישום לחניך בפורטל ההורים</p>
        </div>
      ) : (
        <div className="s-card s-card--flush s-cardrows">
          <DataTable
            columns={columns}
            rows={rows}
            getRowKey={(h) => h.id}
            empty="אין הרשמות קודמות להצגה."
            footer={
              <tr className="s-table__summary">
                <td colSpan={columns.length - 2}>סה״כ הוצאות</td>
                <td style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      transform: 'translateX(50px)',
                    }}
                  >
                    <Price amount={totalSpent} />
                  </span>
                </td>
                <td />
              </tr>
            }
          />
        </div>
      )}

      <h3 className="s-subsection__title">זיכויים</h3>
      {refundRows.length === 0 ? (
        <div className="history__empty s-card">
          <img
            className="history__empty-illustration"
            src="/assets/no-history.svg"
            alt=""
          />
          <p>אין זיכויים להצגה</p>
        </div>
      ) : (
        <div className="s-card s-card--flush s-cardrows">
          <DataTable
            columns={refundColumns}
            rows={refundRows}
            getRowKey={(r) => r.id}
            footer={
              <tr className="s-table__summary s-table__summary--credit">
                <td colSpan={refundColumns.length - 2}>סה״כ זיכויים</td>
                <td style={{ textAlign: 'center' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      transform: 'translateX(50px)',
                    }}
                  >
                    <Price amount={totalRefunds} />
                  </span>
                </td>
                <td />
              </tr>
            }
          />
        </div>
      )}
    </section>
  )
}
