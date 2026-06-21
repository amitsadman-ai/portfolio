import { useEffect, useRef, useState } from 'react'

export function useInView({
  threshold = 0.15,
  once = true,
  rootMargin = '0px',
  safetyMs = 1500,
} = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    // Safety net: if for any reason the IntersectionObserver never fires
    // (browser quirk, parent has overflow:clip ancestor, layout race,
    // etc.) — force the element visible after a short delay so the page
    // is NEVER stuck blank below "The Solution".
    // Per-row use cases (e.g. timeline rows that intentionally start
    // hidden until scrolled to) can opt out by passing safetyMs: 0.
    const safetyTimer =
      safetyMs > 0 ? setTimeout(() => setInView(true), safetyMs) : null

    // If the element is ALREADY inside the viewport on mount (very
    // common for sections near the top of the page), fire immediately
    // — IntersectionObserver only triggers on a state CHANGE, so an
    // element that mounts already-in-view sometimes never fires.
    const rect = node.getBoundingClientRect()
    const initiallyInView =
      rect.top < window.innerHeight && rect.bottom > 0
    if (initiallyInView && !rootMargin.includes('-')) setInView(true)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (once) observer.unobserve(entry.target)
        } else if (!once) {
          setInView(false)
        }
      },
      { threshold, rootMargin }
    )

    observer.observe(node)
    return () => {
      if (safetyTimer) clearTimeout(safetyTimer)
      observer.disconnect()
    }
  }, [threshold, once, rootMargin, safetyMs])

  return [ref, inView]
}
