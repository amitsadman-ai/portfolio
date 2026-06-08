import './PhoneRow.css'

/**
 * Clean horizontal row of phone screens — no tilt, no overlap.
 * Sits on a soft cream-yellow strip so it reads differently from the
 * navy-dotted PhoneScene layout used in other sections.
 */
export default function PhoneRow({ images, label, onExpand }) {
  return (
    <div className="phone-row">
      <div className="phone-row__phones">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            className="phone-row__phone"
            onClick={() => onExpand?.(src)}
            aria-label={`${label} — screen ${i + 1}`}
          >
            <img src={src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
    </div>
  )
}
