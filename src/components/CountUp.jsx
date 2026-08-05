import { useEffect, useRef, useState } from 'react'
import { useInView } from '../hooks/useInView'

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/*
 * A number that counts up from 0 to `value` the first time it scrolls into
 * view (ease-out), then holds. `prefix`/`suffix` wrap the formatted number
 * (e.g. prefix "₪", suffix " million" or "+"). Respects reduced-motion by
 * showing the final value immediately.
 */
export default function CountUp({
  value,
  prefix = '',
  suffix = '',
  duration = 1700,
  className,
}) {
  const [ref, inView] = useInView({ threshold: 0.35 })
  const [display, setDisplay] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    if (!inView || started.current) return
    started.current = true

    if (prefersReducedMotion()) {
      setDisplay(value)
      return
    }

    let raf
    let startTime
    const step = (now) => {
      if (startTime === undefined) startTime = now
      const t = Math.min(1, (now - startTime) / duration)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      setDisplay(Math.round(value * eased))
      if (t < 1) raf = requestAnimationFrame(step)
      else setDisplay(value)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [inView, value, duration])

  return (
    <span ref={ref} className={className}>
      {prefix}
      {display.toLocaleString('en-US')}
      {suffix}
    </span>
  )
}
