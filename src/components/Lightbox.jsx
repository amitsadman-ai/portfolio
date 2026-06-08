import { useEffect } from 'react'
import { X } from 'lucide-react'
import './Lightbox.css'

export default function Lightbox({ src, alt = '', onClose }) {
  useEffect(() => {
    if (!src) return
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [src, onClose])

  if (!src) return null

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
      <img
        className="lightbox__img"
        src={src}
        alt={alt}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  )
}
