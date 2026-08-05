import './AutoGallery.css'

export default function AutoGallery({ images = [], onExpand, label = 'screens', static: isStatic = false }) {
  if (!images.length) return null
  // Auto-scroll mode duplicates the set so translateX(-50%) loops seamlessly.
  // Static mode shows each screen once as a plain, manually-scrollable row.
  const loop = isStatic ? images : [...images, ...images]
  // Slower for short sets, faster for long ones so each screen reads.
  const duration = Math.max(36, images.length * 8)

  return (
    <div
      className={`gallery${isStatic ? ' gallery--static' : ''}`}
      role="group"
      aria-label={label}
    >
      <ul
        className="gallery__track"
        style={isStatic ? undefined : { animationDuration: `${duration}s` }}
      >
        {loop.map((src, i) => {
          const clone = i >= images.length
          const isSetEnd = !isStatic && (i === images.length - 1 || i === loop.length - 1)
          const indexInSet = (i % images.length) + 1
          return (
            <li
              key={i}
              className={`gallery__item${isSetEnd ? ' gallery__item--end' : ''}`}
              aria-hidden={clone ? 'true' : undefined}
            >
              <button
                type="button"
                className="gallery__btn"
                onClick={() => onExpand(images, i % images.length)}
                tabIndex={clone ? -1 : 0}
                aria-label={`Expand ${label} ${indexInSet}`}
              >
                <img
                  src={src}
                  alt={clone ? '' : `${label} ${indexInSet}`}
                  loading="lazy"
                  draggable="false"
                />
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
