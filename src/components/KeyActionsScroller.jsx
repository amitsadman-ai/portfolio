import { useEffect, useRef, useState } from 'react'

/**
 * Render a paragraph with inline **bold** segments turned into <strong>.
 */
function renderInlineBold(text) {
  if (!text) return null
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    const m = /^\*\*(.+)\*\*$/.exec(part)
    return m ? <strong key={i}>{m[1]}</strong> : part
  })
}

/**
 * Scroll-driven sidebar layout for Skeep's "Key Actions" section.
 *
 * Layout:
 *   ┌────────────────────────┬────────────────────────┐
 *   │ Active label           │                        │
 *   │   description...       │                        │
 *   │ Inactive 2 (50%)       │  sticky screenshot     │
 *   │ Inactive 3 (50%)       │  (cycles on last item) │
 *   │ Inactive 4 (50%)       │                        │
 *   │ ...                    │                        │
 *   └────────────────────────┴────────────────────────┘
 *
 * The left column shows ALL 6 labels stacked tightly (the active one
 * with its description expanded). The pinned stack stays in view while
 * a column of invisible scroll-anchors below it drives the activation:
 * as the user scrolls, each anchor enters a middle activation band and
 * the corresponding label "opens" while the others collapse.
 *
 * For the last item ("Implementation Type & Placement") the screenshot
 * cycles through 3 images on a 2-second interval while active.
 */
export default function KeyActionsScroller({ items, defaultImage, onExpand }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [cycleIndex, setCycleIndex] = useState(0)
  const leftColRef = useRef(null)

  // Drive activation from scroll-position math (more stable than
  // IntersectionObserver, which would flicker between adjacent anchors
  // when their visibility ratios are nearly equal). rAF-throttled so we
  // run the calculation at most once per frame.
  useEffect(() => {
    if (!items.length) return
    let raf = 0

    const update = () => {
      raf = 0
      const el = leftColRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      const viewportH = window.innerHeight
      // The "scrub line" — point in the viewport that determines which
      // item is active. We use 40% from the top of the viewport because
      // most users' eyes are drawn slightly above center.
      const scrubLine = viewportH * 0.4
      // 0 when the top of the section is at the scrub line, 1 when the
      // bottom of the section is at the scrub line.
      const sectionH = rect.height
      const scrolled = scrubLine - rect.top
      const progress = Math.max(0, Math.min(0.9999, scrolled / sectionH))

      // Carve out dedicated reading zones for the TWO trailing items
      // (the second-to-last + last — both typically have cycling images
      // and longer bodies). The "regular" items (0..N-3) share the
      // first 35% of progress, the second-to-last gets 35-60%, and the
      // last gets 60-100%. This keeps the user on each detail-rich
      // item long enough to read it AND see the image cycle.
      const lastIdx = items.length - 1
      const secondLastIdx = lastIdx - 1
      let idx
      if (items.length === 1) {
        idx = 0
      } else if (items.length === 2) {
        idx = progress >= 0.5 ? 1 : 0
      } else if (progress >= 0.6) {
        idx = lastIdx
      } else if (progress >= 0.35) {
        idx = secondLastIdx
      } else {
        // regular items (0..secondLastIdx-1) split the first 35%
        const regularCount = secondLastIdx
        idx = Math.min(
          regularCount - 1,
          Math.floor((progress / 0.35) * regularCount)
        )
      }
      setActiveIndex((prev) => (prev === idx ? prev : idx))
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [items.length])

  // Cycling — any item with an `images` array (length > 1) auto-cycles
  // through them while it's active, every `item.cycleMs` ms (default 2000).
  const activeItem = items[activeIndex]
  const cycleImages =
    activeItem && Array.isArray(activeItem.images) && activeItem.images.length > 1
      ? activeItem.images
      : null
  const cycleMs = (activeItem && activeItem.cycleMs) || 2000

  useEffect(() => {
    // Reset to the first frame whenever the active item changes
    setCycleIndex(0)
  }, [activeIndex])

  useEffect(() => {
    if (!cycleImages) return
    const id = setInterval(() => {
      setCycleIndex((i) => (i + 1) % cycleImages.length)
    }, cycleMs)
    return () => clearInterval(id)
  }, [cycleImages, cycleMs])

  const activeImage = cycleImages
    ? cycleImages[cycleIndex]
    : activeItem.image || defaultImage

  // Click a label → smooth-scroll the page to the position that would
  // naturally activate that item via scroll, AND set the active index
  // immediately so the UI responds before the smooth scroll lands.
  const handleLabelClick = (idx) => {
    setActiveIndex(idx)
    const el = leftColRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const viewportH = window.innerHeight
    const scrubLine = viewportH * 0.4
    const sectionH = rect.height

    const lastIdx = items.length - 1
    let targetProgress
    if (items.length === 1) {
      targetProgress = 0
    } else if (idx === lastIdx) {
      // back half of progress → middle of that zone
      targetProgress = 0.75
    } else {
      // first half of progress is split across items 0..lastIdx-1.
      // Aim for the middle of this item's slot.
      targetProgress = ((idx + 0.5) / lastIdx) * 0.5
    }

    const absoluteTopY = window.scrollY + rect.top
    const targetScrollY = absoluteTopY - scrubLine + targetProgress * sectionH
    window.scrollTo({ top: targetScrollY, behavior: 'smooth' })
  }

  // Build the de-duped list of every image that could appear in the
  // sticky pane — pre-rendered as a stack so cross-fading is a pure CSS
  // opacity transition (no mount/unmount flash).
  const allImages = []
  const seen = new Set()
  const addImage = (src) => {
    if (!src || seen.has(src)) return
    seen.add(src)
    allImages.push(src)
  }
  if (defaultImage) addImage(defaultImage)
  items.forEach((item) => {
    if (item.image) addImage(item.image)
    if (Array.isArray(item.images)) item.images.forEach(addImage)
  })

  return (
    <div className="cs__keyactions">
      {/* LEFT column wraps the pinned label stack + invisible anchors */}
      <div className="cs__keyactions-left" ref={leftColRef}>
        {/* Pinned label stack — sticks at the top of the viewport while
            the user scrolls through the anchors below it. All 6 labels
            are always visible; only the active one expands its body. */}
        <div className="cs__keyactions-pinned">
          {items.map((item, i) => {
            const isActive = i === activeIndex
            return (
              <div
                key={i}
                className={`cs__keyactions-item ${isActive ? 'is-active' : ''}`}
              >
                <button
                  type="button"
                  className="cs__keyactions-name-btn"
                  onClick={() => handleLabelClick(i)}
                  aria-pressed={isActive}
                  aria-label={`Activate ${item.name}`}
                >
                  <h4 className="cs__keyactions-name">{item.name}</h4>
                </button>
                <div className="cs__keyactions-body" aria-hidden={!isActive}>
                  {/* Inner wrapper — the grid-rows collapse trick on the
                      parent only sizes the FIRST explicit row, so the body
                      needs exactly one grid child for the collapse to work
                      when there are multiple content pieces. */}
                  <div className="cs__keyactions-body-inner">
                    {item.description &&
                      (Array.isArray(item.description)
                        ? item.description.map((p, k) => (
                            <p key={k} className="cs__keyactions-desc">
                              {renderInlineBold(p)}
                            </p>
                          ))
                        : (
                          <p className="cs__keyactions-desc">
                            {renderInlineBold(item.description)}
                          </p>
                        ))}
                    {Array.isArray(item.bullets) && item.bullets.length > 0 && (
                      <ul className="cs__keyactions-bullets">
                        {item.bullets.map((b, k) => (
                          <li key={k}>{renderInlineBold(b)}</li>
                        ))}
                      </ul>
                    )}
                    {item.outro &&
                      (Array.isArray(item.outro)
                        ? item.outro.map((p, k) => (
                            <p key={k} className="cs__keyactions-desc">
                              {renderInlineBold(p)}
                            </p>
                          ))
                        : (
                          <p className="cs__keyactions-desc">
                            {renderInlineBold(item.outro)}
                          </p>
                        ))}
                  </div>
                </div>
                {/* Mobile-only: each item carries its own screenshot
                 *  inline beneath the description. CSS hides this on
                 *  desktop and hides the sticky pane on mobile so the
                 *  layout collapses into a clean read-and-scroll list.
                 *  Falls back to the section's defaultImage when an
                 *  item doesn't ship its own screenshot. */}
                {(() => {
                  const inlineSrc =
                    item.image ||
                    (Array.isArray(item.images) && item.images[0]) ||
                    defaultImage
                  if (!inlineSrc) return null
                  return (
                    <button
                      type="button"
                      className="cs__keyactions-inline-img-btn"
                      onClick={() => onExpand && onExpand(inlineSrc)}
                      aria-label={`Expand ${item.name} screenshot`}
                    >
                      <img
                        className="cs__keyactions-inline-img"
                        src={inlineSrc}
                        alt=""
                        loading="lazy"
                      />
                    </button>
                  )
                })()}
              </div>
            )
          })}
        </div>

        {/* Invisible scroll-anchors — define the vertical scroll distance
            of the section. (We no longer observe them individually; the
            section's total height drives the scroll-position math above.) */}
        <div className="cs__keyactions-anchors" aria-hidden="true">
          {items.map((_, i) => (
            <div key={i} className="cs__keyactions-anchor" />
          ))}
        </div>
      </div>

      {/* RIGHT column — sticky screenshot. All possible images are
          rendered as a stack; only the active one has opacity 1. CSS
          opacity transitions handle the cross-fade so there's no
          mount/unmount flash on swap. */}
      <div className="cs__keyactions-sticky">
        <button
          type="button"
          className="cs__keyactions-img-btn"
          onClick={() => onExpand && onExpand(activeImage)}
          aria-label="Expand current screenshot"
        >
          <div className="cs__keyactions-img-stack">
            {allImages.map((src, i) => (
              <img
                key={src}
                src={src}
                alt=""
                loading={i === 0 ? 'eager' : 'lazy'}
                className={`cs__keyactions-img ${src === activeImage ? 'is-visible' : ''}`}
              />
            ))}
          </div>
        </button>
      </div>
    </div>
  )
}
