import { useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import './Lightbox.css'

export default function Lightbox({ src, images, index = 0, alt = '', onClose }) {
  // Accept either a single `src` (legacy callers) or an `images` array with a
  // starting `index` (galleries that support prev/next navigation).
  const list = images && images.length ? images : src ? [src] : []
  const [i, setI] = useState(index)

  // Re-sync the active index whenever a new set/starting index is opened.
  useEffect(() => {
    setI(index)
  }, [index, images, src])

  const count = list.length
  const hasNav = count > 1

  useEffect(() => {
    if (!count) return
    const go = (delta) => setI((v) => (v + delta + count) % count)
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (hasNav && e.key === 'ArrowRight') go(1)
      else if (hasNav && e.key === 'ArrowLeft') go(-1)
    }
    document.addEventListener('keydown', onKey)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    // Flag the open state so the background auto-scrolling gallery pauses.
    document.body.classList.add('lightbox-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prevOverflow
      document.body.classList.remove('lightbox-open')
    }
  }, [count, hasNav, onClose])

  if (!count) return null

  const prev = (e) => {
    e.stopPropagation()
    setI((v) => (v - 1 + count) % count)
  }
  const next = (e) => {
    e.stopPropagation()
    setI((v) => (v + 1) % count)
  }

  return (
    <div
      className="lightbox"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Expanded image"
    >
      <button className="lightbox__close" onClick={onClose} aria-label="Close">
        <X size={22} />
      </button>

      {hasNav && (
        <button
          className="lightbox__nav lightbox__nav--prev"
          onClick={prev}
          aria-label="Previous image"
        >
          <ChevronLeft size={28} />
        </button>
      )}

      <img
        className="lightbox__img"
        src={list[i]}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
      />

      {hasNav && (
        <button
          className="lightbox__nav lightbox__nav--next"
          onClick={next}
          aria-label="Next image"
        >
          <ChevronRight size={28} />
        </button>
      )}

      {hasNav && (
        <div className="lightbox__counter" onClick={(e) => e.stopPropagation()}>
          {i + 1} / {count}
        </div>
      )}
    </div>
  )
}
