import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './DreamCards.css'

/*
 * The three "dream" illustrations as a little deck that lives BEHIND the
 * reply bubble, peeking out ~half a card on the left. Click it and the
 * cards fan out into a row in the empty space to the left of the bubble
 * (or, when there isn't room — e.g. mobile — a centred row below it).
 * Click again to tuck them back. Positions are measured at runtime so the
 * open row always fits inside the chat window. GSAP drives the motion.
 */
export default function DreamCards({ cards }) {
  const rootRef = useRef(null)
  const [open, setOpen] = useState(false)
  const openRef = useRef(open)
  openRef.current = open
  const firstRef = useRef(true)

  useEffect(() => {
    const root = rootRef.current
    if (!root) return
    const els = Array.from(root.querySelectorAll('.fan-card'))
    if (!els.length) return
    const n = els.length
    const reduced =
      typeof window !== 'undefined' &&
      window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // resting position for card `i`, in px relative to the bubble's left
    // edge (x = 0) and vertical centre (yPercent -50).
    const positionFor = (i, isOpen) => {
      const CW = els[0].offsetWidth || 124
      const G = 12
      const behind = root.closest('.chat-msg__behind') || root
      const chat = root.closest('.about__chat')
      const bRect = behind.getBoundingClientRect()
      const cRect = chat
        ? chat.getBoundingClientRect()
        : { left: bRect.left, width: bRect.width }
      const available = Math.max(0, bRect.left - cRect.left - 14)

      if (!isOpen) {
        // tucked deck, peeking ~half a card out to the left
        return { x: -CW * 0.52 + i * 7, y: i * 5 - 4, rot: (i - 1) * 4, z: 1 + i }
      }

      // OPEN: a row anchored to the LEFT of the chat window. Full spacing
      // where there's room (a clean spread); it tightens (cards overlap a
      // little) only when the window is narrow, so it always stays a row.
      void available
      const pad = 16
      const rowMax = cRect.width * 0.74
      const step = Math.max(34, Math.min(CW + G, (rowMax - CW) / (n - 1)))
      const startAbs = cRect.left + pad
      return { x: startAbs + i * step - bRect.left, y: 0, rot: 0, z: 10 + i }
    }

    const apply = (isOpen, animate) => {
      els.forEach((el, i) => {
        const p = positionFor(i, isOpen)
        const props = {
          x: p.x,
          y: p.y,
          yPercent: -50,
          rotation: p.rot,
          scale: 1,
          zIndex: p.z,
          opacity: 1,
        }
        if (animate && !reduced) {
          gsap.to(el, {
            ...props,
            duration: 0.6,
            ease: 'elastic.out(1,.72)',
            delay: i * 0.05,
            overwrite: 'auto',
          })
        } else {
          gsap.set(el, props)
        }
      })
    }

    if (firstRef.current) {
      firstRef.current = false
      // entrance: rise up into the tucked (closed) deck
      if (!reduced) {
        els.forEach((el, i) =>
          gsap.set(el, {
            x: 0,
            y: 44,
            yPercent: -50,
            rotation: 0,
            scale: 0.5,
            opacity: 0,
            zIndex: 1 + i,
          })
        )
      }
      apply(false, !reduced)
    } else {
      apply(open, !reduced)
    }

    const onResize = () => apply(openRef.current, false)
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      gsap.killTweensOf(els)
    }
  }, [open])

  const toggle = () => setOpen((o) => !o)
  const onKey = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      toggle()
    }
  }

  return (
    <div
      ref={rootRef}
      className={`dreamdeck ${open ? 'is-open' : 'is-closed'}`}
    >
      {cards.map((c, i) => (
        <div
          className="fan-card"
          key={i}
          role="button"
          tabIndex={0}
          aria-label={open ? 'Tuck the dream photos away' : 'See Amit’s dreams'}
          onClick={toggle}
          onKeyDown={onKey}
        >
          <img src={c.src} alt={c.alt || ''} loading="lazy" draggable="false" />
        </div>
      ))}
    </div>
  )
}
