import './PhoneScene.css'

/**
 * Reference-style scene: 2–3 phone screens tilted over a colored backdrop
 * shape. Optimized for handing UI screens in a "presentation" frame, not a
 * scrollable strip.
 *
 * Each phone is clickable — opens in the Lightbox at full size.
 */
export default function PhoneScene({
  images,
  label,
  onExpand,
  backdrop = 'navy',
  arrow = null,
}) {
  const count = images.length
  return (
    <div className={`phone-scene phone-scene--${backdrop} phone-scene--${count}`}>
      <div className="phone-scene__backdrop" aria-hidden="true" />
      <div className="phone-scene__phones">
        {images.map((src, i) => (
          <button
            key={i}
            type="button"
            className={`phone-scene__phone phone-scene__phone--${i}`}
            onClick={() => onExpand?.(src)}
            aria-label={`${label} — screen ${i + 1}`}
          >
            <img src={src} alt="" loading="lazy" />
          </button>
        ))}
      </div>
      {arrow && (
        <img
          className="phone-scene__arrow"
          src="/assets/arrow.png"
          alt=""
          aria-hidden="true"
        />
      )}
    </div>
  )
}
