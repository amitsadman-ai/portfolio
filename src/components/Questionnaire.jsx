import { useEffect, useRef, useState } from 'react'
import './Questionnaire.css'

/* Portfolio-palette colors for donut segments (navy spectrum + cream accent).
   Ordered darkest → lightest; the LARGEST segment gets the darkest color
   so the dominant slice always reads as the hero of the chart. */
const SEGMENT_COLORS = [
  '#2d3359', // primary navy
  '#5e6da3', // mid blue
  '#9aafce', // soft blue
  '#cfdcef', // pale blue
  '#fcf1b5', // cream-yellow accent
]

/* Returns a {srcIndex → color} map: the segment with the largest value gets
   SEGMENT_COLORS[0] (navy), next-largest gets [1], etc. Ties broken by source
   order so the result is deterministic. */
function colorsByRank(segments) {
  return [...segments]
    .map((s, i) => ({ value: s.value, srcIdx: i }))
    .sort((a, b) => b.value - a.value || a.srcIdx - b.srcIdx)
    .reduce((acc, s, rank) => {
      acc[s.srcIdx] = SEGMENT_COLORS[rank % SEGMENT_COLORS.length]
      return acc
    }, {})
}

/* Picks readable text color (navy or white) for a given chip background. */
function chipTextColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return lum > 0.55 ? '#171a2d' : '#ffffff'
}

/* ---------- hooks ---------- */
function useInView(threshold = 0.3) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold }
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [threshold])
  return [ref, inView]
}

function useCountUp(target, duration, run) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!run) return
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setValue(target)
      return
    }
    let raf
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setValue(target * eased)
      if (t < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, duration, run])
  return value
}

/* ---------- donut ---------- */
const DONUT_DURATION = 2.2 // seconds per arc sweep
const DONUT_STAGGER = 0.22 // seconds between segments

function Donut({ segments, animate }) {
  const r = 70
  const c = 2 * Math.PI * r
  const total = segments.reduce((s, x) => s + x.value, 0) || 100
  const colorMap = colorsByRank(segments)
  const chipR = 95 // chip distance from donut center (just outside the ring)
  // Compute every segment's geometry in source order so offsets cumulate
  // correctly, then sort by value DESCENDING for paint order — that way
  // big segments paint first (bottom) and small ones paint last (top),
  // so no small slice ever gets covered by a larger neighbor's round cap.
  const computed = []
  const chips = []
  let offset = 0
  segments.forEach((seg, i) => {
    const pct = seg.value / total
    const dash = pct * c
    // explicit per-segment color (in data) wins over the rank fallback
    const segColor = seg.color || colorMap[i]
    computed.push({
      key: i,
      value: seg.value,
      finalOff: -offset,
      startOff: -offset - c,
      adjustedDash: Math.max(0, dash - 4),
      color: segColor,
      delay: i * DONUT_STAGGER,
    })
    // chip for every segment, including 0% (so all answers are visible)
    const midAngle = ((offset + dash / 2) / c) * 2 * Math.PI
    chips.push({
      key: i,
      angle: midAngle,
      value: seg.value,
      color: segColor,
      offsetX: seg.chipOffset?.x || 0,
      offsetY: seg.chipOffset?.y || 0,
    })
    offset += dash
  })
  // Anti-collision: if two chips are closer than MIN_GAP_RAD, push them
  // apart symmetrically so a tiny segment + a 0% segment don't pile up.
  const MIN_GAP_RAD = 0.36 // ~20.6° — fits 2 chips with breathing room
  const sortedChips = [...chips].sort((a, b) => a.angle - b.angle)
  for (let pass = 0; pass < 3; pass++) {
    for (let j = 1; j < sortedChips.length; j++) {
      const prev = sortedChips[j - 1]
      const curr = sortedChips[j]
      const gap = curr.angle - prev.angle
      if (gap < MIN_GAP_RAD) {
        const shift = (MIN_GAP_RAD - gap) / 2
        prev.angle -= shift
        curr.angle += shift
      }
    }
  }
  // Project final positions from the adjusted angles, then apply any
  // explicit per-segment chip offset (in viewBox units)
  chips.forEach((ch) => {
    ch.cx = 100 + chipR * Math.sin(ch.angle) + ch.offsetX
    ch.cy = 100 - chipR * Math.cos(ch.angle) + ch.offsetY
  })
  const paintOrder = [...computed].sort((a, b) => b.value - a.value)
  // chips fade in just before the donut sweep finishes so they arrive together
  const chipDelay = Math.max(
    0,
    (segments.length - 1) * DONUT_STAGGER + DONUT_DURATION - 0.4
  )
  return (
    <div className="dq__donut-wrap">
      <svg
        className="dq__donut"
        viewBox="-30 -30 260 260"
        aria-hidden="true"
      >
        <g transform="rotate(-90 100 100)">
          {paintOrder.map((s) => (
            <circle
              key={s.key}
              cx="100"
              cy="100"
              r={r}
              fill="none"
              stroke={s.color}
              strokeWidth={26}
              strokeLinecap="round"
              strokeDasharray={`${s.adjustedDash} ${c}`}
              style={{
                strokeDashoffset: animate ? s.finalOff : s.startOff,
                transition: `stroke-dashoffset ${DONUT_DURATION}s cubic-bezier(0.22, 1, 0.36, 1) ${s.delay}s`,
              }}
            />
          ))}
        </g>
        <g className="dq__donut-chips">
          {chips.map((chip) => (
            <g
              key={chip.key}
              transform={`translate(${chip.cx} ${chip.cy})`}
              style={{
                opacity: animate ? 1 : 0,
                transition: `opacity 0.5s ease ${chipDelay}s`,
              }}
            >
              <g
                className="dq__donut-chip-float"
                style={{ animationDelay: `${(chip.key * 0.45).toFixed(2)}s` }}
              >
                <rect
                  x={-23}
                  y={-13}
                  width={46}
                  height={26}
                  rx={13}
                  fill={chip.color}
                />
                <text
                  x={0}
                  y={0}
                  fill={chipTextColor(chip.color)}
                  textAnchor="middle"
                  dy="0.35em"
                  fontSize={13}
                  fontWeight={700}
                >
                  {chip.value}%
                </text>
              </g>
            </g>
          ))}
        </g>
      </svg>
    </div>
  )
}

function DonutLegend({ segments }) {
  const colorMap = colorsByRank(segments)
  return (
    <ul className="dq__legend dq__legend--below">
      {segments.map((seg, i) => {
        const color = seg.color || colorMap[i]
        return (
          <li key={i} className="dq__legend-row">
            <span className="dq__legend-dot" style={{ background: color }} />
            <span className="dq__legend-label">{seg.label}</span>
          </li>
        )
      })}
    </ul>
  )
}

/* ---------- percent (count-up) ---------- */
const PERCENT_DURATION = 2400 // ms — matches the donut sweep tempo

function PercentValue({ value, run }) {
  const num = parseFloat(value)
  const decimals = (value.match(/\.\d+/) || [''])[0].length
    ? value.match(/\.\d+/)[0].length - 1
    : 0
  const current = useCountUp(num, PERCENT_DURATION, run)
  return (
    <p className="dq__percent">
      {current.toFixed(decimals)}
      <span className="dq__percent-suffix">%</span>
    </p>
  )
}

/* ---------- card ---------- */
function PercentCell({ stat, run }) {
  return (
    <div className="dq__percent-cell">
      <h4 className="dq__q-text">{stat.question}</h4>
      <div className="dq__percent-cell-body">
        <PercentValue value={stat.value} run={run} />
        <p className="dq__percent-caption">
          <span className="dq__highlight">respondents answered YES</span>
        </p>
      </div>
    </div>
  )
}

function Card({ item, inView }) {
  // combined card: two percent stats stacked in one card
  if (item.type === 'percents') {
    return (
      <div className={`dq__item dq__item--percents ${inView ? 'is-in' : ''}`}>
        <div className="dq__card">
          <div className="dq__percent-pair">
            {item.stats.map((stat, j) => (
              <PercentCell key={j} stat={stat} run={inView} />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`dq__item dq__item--${item.type} ${inView ? 'is-in' : ''}`}>
      <div className="dq__card">
        <h4 className="dq__q-text">{item.question}</h4>
        <div className="dq__card-body">
          {item.type === 'donut' && (
            <>
              <DonutLegend segments={item.segments} />
              <Donut segments={item.segments} animate={inView} />
            </>
          )}
          {item.type === 'percent' && (
            <>
              <PercentValue value={item.value} run={inView} />
              <p className="dq__percent-caption">
                <span className="dq__highlight">respondents answered YES</span>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

/* ---------- root ---------- */
export default function Questionnaire({ data }) {
  // Observer on the GRID (not the whole section), at a higher threshold —
  // so animations only trigger when the user has scrolled far enough that
  // the cards themselves are properly in view, instead of firing the
  // instant the section's title peeks above the fold.
  const [gridRef, inView] = useInView(0.35)
  return (
    <div className="dq">
      <div className="dq__title-wrap">
        <span className="app__label dq__title-label">{data.title}</span>
        <span className="app__label dq__title-subtitle">({data.subtitle})</span>
      </div>
      <div ref={gridRef} className="dq__grid">
        {data.items.map((it, i) => (
          <Card key={i} item={it} inView={inView} />
        ))}
      </div>
    </div>
  )
}
