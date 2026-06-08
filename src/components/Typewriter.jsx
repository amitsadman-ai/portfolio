import { useEffect, useRef, useState } from 'react'
import './Typewriter.css'

/**
 * Reveals `text` one character at a time when the element scrolls into view.
 * The cursor blinks while typing, then keeps blinking softly at the end.
 * Honors `prefers-reduced-motion` — shows the full text immediately if the
 * user has asked for less motion.
 */
export default function Typewriter({
  text,
  speed = 20, // ms per character
  startDelay = 150,
  className = '',
  as: Tag = 'span',
}) {
  const ref = useRef(null)
  const [started, setStarted] = useState(false)
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!ref.current) return
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setCount(text.length)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 }
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [text])

  useEffect(() => {
    if (!started) return
    let cancelled = false
    let i = 0
    let tid
    const tick = () => {
      if (cancelled) return
      i += 1
      setCount(i)
      if (i < text.length) tid = setTimeout(tick, speed)
    }
    const start = setTimeout(tick, startDelay)
    return () => {
      cancelled = true
      clearTimeout(start)
      clearTimeout(tid)
    }
  }, [started, text, speed, startDelay])

  const visible = text.slice(0, count)
  const done = count >= text.length

  return (
    <Tag ref={ref} className={`typewriter ${className}`}>
      {visible}
      <span
        className={`typewriter__cursor${done ? ' typewriter__cursor--done' : ''}`}
        aria-hidden="true"
      />
    </Tag>
  )
}
