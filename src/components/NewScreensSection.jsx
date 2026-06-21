import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import AutoGallery from './AutoGallery'
import PhoneScene from './PhoneScene'
import PhoneRow from './PhoneRow'
import OnboardingSteps from './OnboardingSteps'
import KeyActionsScroller from './KeyActionsScroller'

/** Navigation carousel: shows one image at a time inside a dotted-scene
 *  container, with prev/next arrows + dot indicators. Used for `gallery`
 *  rows inside a section's description (e.g. the checkout flow's 3
 *  desktop screenshots). */
function NavCarousel({ images, onExpand }) {
  const [idx, setIdx] = useState(0)
  if (!images || !images.length) return null
  const count = images.length
  const prev = () => setIdx((i) => (i - 1 + count) % count)
  const next = () => setIdx((i) => (i + 1) % count)
  /* Slide is 90% of the viewport — the active screenshot now fills
   * nearly the entire dotted carousel area. A tiny leftward nudge
   * leaves room for the next slide to peek in on the right. */
  const SLIDE_PCT = 90
  const NUDGE_PCT = 5
  const trackTransform = `translateX(calc(${50 - SLIDE_PCT / 2 - NUDGE_PCT}% - ${idx * SLIDE_PCT}%))`
  return (
    <div className="cs__navcarousel cs__dotted-scene">
      <button
        type="button"
        className="cs__navcarousel-arrow cs__navcarousel-arrow--prev"
        onClick={prev}
        aria-label="Previous screenshot"
        disabled={count < 2}
      >
        <ChevronLeft size={20} />
      </button>
      <div className="cs__navcarousel-viewport">
        <div
          className="cs__navcarousel-track"
          style={{ transform: trackTransform }}
        >
          {images.map((img, i) => {
            const src = typeof img === 'string' ? img : img.src
            const isActive = i === idx
            return (
              <button
                key={src}
                type="button"
                className={`cs__navcarousel-slide ${isActive ? 'is-active' : ''}`}
                onClick={() => (isActive ? onExpand && onExpand(src) : setIdx(i))}
                aria-label={isActive ? 'Expand screenshot' : `Go to screenshot ${i + 1}`}
                tabIndex={isActive ? 0 : -1}
              >
                <img src={src} alt="" loading="lazy" />
              </button>
            )
          })}
        </div>
      </div>
      <button
        type="button"
        className="cs__navcarousel-arrow cs__navcarousel-arrow--next"
        onClick={next}
        aria-label="Next screenshot"
        disabled={count < 2}
      >
        <ChevronRight size={20} />
      </button>
      <div className="cs__navcarousel-dots" role="tablist" aria-label="Screenshot navigation">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            role="tab"
            aria-selected={i === idx}
            aria-label={`Go to screenshot ${i + 1}`}
            className={`cs__navcarousel-dot ${i === idx ? 'is-active' : ''}`}
            onClick={() => setIdx(i)}
          />
        ))}
      </div>
    </div>
  )
}

/** Stack variant: 2+ images layered, one in front. Auto-swaps which is
 *  in front every 3 seconds with a smooth rotation+offset animation. */
function StackCards({ images, onExpand, offsetX = 60, offsetY = 0 }) {
  const [frontIdx, setFrontIdx] = useState(0)
  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => {
      setFrontIdx((i) => (i + 1) % images.length)
    }, 3000)
    return () => clearInterval(id)
  }, [images.length])

  // Override the CSS-default translateX(60px) so a stack can be nudged
  // anywhere from the data via { stackOffsetX, stackOffsetY }
  const style =
    offsetX !== 60 || offsetY !== 0
      ? { transform: `translate(${offsetX}px, ${offsetY}px)` }
      : undefined

  return (
    <div className="cs__sbs-stack" style={style}>
      {images.map((img, i) => {
        const src = typeof img === 'string' ? img : img.src
        const alt = typeof img === 'string' ? '' : img.alt || ''
        const isFront = i === frontIdx
        return (
          <button
            type="button"
            key={i}
            className={`cs__sbs-stack-card ${isFront ? 'is-front' : 'is-back'}`}
            style={{ zIndex: isFront ? 2 : 1 }}
            onClick={() => onExpand && onExpand(src)}
            aria-label={`Expand ${alt || `card ${i + 1}`}`}
          >
            <img src={src} alt={alt} loading="lazy" />
          </button>
        )
      })}
    </div>
  )
}

/**
 * Render a paragraph with inline **bold** segments turned into <strong>.
 * (A paragraph that is ENTIRELY **bold** is handled upstream as a subhead.)
 */
function renderInlineBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    const m = /^\*\*(.+)\*\*$/.exec(part)
    return m ? <strong key={i}>{m[1]}</strong> : part
  })
}

/**
 * One "New screens" sub-section. If `section.tabs` is set, renders a pill
 * tab row under the title and shows the active tab's description + images.
 * Otherwise renders the section's own description + images.
 */
export default function NewScreensSection({ section, projectTitle, onExpand }) {
  const [activeTab, setActiveTab] = useState(0)

  // A "label" kind renders a top-level `app__label` eyebrow (same style
  // as "THE SYSTEM" above) plus an optional side-by-side image row.
  // Used as an inline section divider inside the newScreens flow.
  if (section.kind === 'label') {
    return (
      <div className="cs__new-screens-label-block">
        <span className="app__label">{section.label}</span>
        {Array.isArray(section.images) && section.images.length > 0 && (
          <div className="cs__new-screens-preview-row">
            {section.images.map((img, k) => {
              const path = typeof img === 'string' ? img : img.src
              const altText = typeof img === 'string' ? '' : img.alt || ''
              const cap = typeof img === 'string' ? '' : img.caption || ''
              return (
                <figure key={k} className="cs__new-screens-preview-figure">
                  <button
                    type="button"
                    className="cs__new-screens-preview-btn"
                    onClick={() => onExpand && onExpand(path)}
                    aria-label={`Expand ${altText || cap || 'preview'}`}
                  >
                    <img src={path} alt={altText} loading="lazy" />
                  </button>
                  {cap && <figcaption className="cs__new-screens-preview-caption">{cap}</figcaption>}
                </figure>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const tabs = section.tabs
  // tab-level fields override section-level when tabs are present
  const content = tabs ? { ...section, ...tabs[activeTab] } : section
  const description = content.description
  const images = content.images
  const arrow = content.arrow
  const layout = content.layout
  const backdrop = content.backdrop || 'navy'

  return (
    <div className="cs__new-screens-section">
      <h3 className="cs__new-screens-title">{section.title}</h3>

      {section.subtitle && (
        <p className="cs__new-screens-subtitle">{section.subtitle}</p>
      )}

      {section.tagline && (
        <p className="cs__new-screens-tagline">{section.tagline}</p>
      )}

      {tabs && tabs.length > 0 && (
        <div className="cs__tabs" role="tablist">
          {tabs.map((tab, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeTab}
              className={`cs__tab ${i === activeTab ? 'is-active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {tab.name}
            </button>
          ))}
        </div>
      )}

      {description &&
        (Array.isArray(description)
          ? description.map((para, j) => {
              // an object with { image } becomes an inline screenshot
              if (typeof para === 'object' && para !== null && para.image) {
                return (
                  <button
                    type="button"
                    key={j}
                    className="cs__new-screens-inline-img-btn"
                    onClick={() => onExpand && onExpand(para.image)}
                    aria-label={`Expand ${para.alt || 'screenshot'}`}
                  >
                    <img
                      className="cs__new-screens-inline-img"
                      src={para.image}
                      alt={para.alt || ''}
                      loading="lazy"
                    />
                  </button>
                )
              }
              // an object with { scrollItems } becomes a scroll-driven
              // sidebar layout (left: vertical labels, right: sticky image)
              if (
                typeof para === 'object' &&
                para !== null &&
                para.scrollItems &&
                Array.isArray(para.scrollItems.items)
              ) {
                return (
                  <KeyActionsScroller
                    key={j}
                    items={para.scrollItems.items}
                    defaultImage={para.scrollItems.defaultImage}
                    onExpand={onExpand}
                  />
                )
              }
              // an object with { steps: [...] } becomes a step layout
              // (tabs / rows / stepper — picked via para.variant)
              if (typeof para === 'object' && para !== null && Array.isArray(para.steps)) {
                return (
                  <OnboardingSteps
                    key={j}
                    steps={para.steps}
                    variant={para.variant || 'tabs'}
                    onExpand={onExpand}
                  />
                )
              }
              // an object with { bullets: [...] } becomes a bulleted list
              if (typeof para === 'object' && para !== null && Array.isArray(para.bullets)) {
                return (
                  <ul key={j} className="cs__new-screens-bullets">
                    {para.bullets.map((b, k) => (
                      <li key={k}>{renderInlineBold(b)}</li>
                    ))}
                  </ul>
                )
              }
              // a paragraph starting with #### becomes a section heading
              // (one level above bold-only subheads — used to group items)
              const sectionHead = /^####\s+(.+)$/.exec(para)
              if (sectionHead) {
                return (
                  <h4 key={j} className="cs__new-screens-section-head">
                    {sectionHead[1]}
                  </h4>
                )
              }
              // object form: { heading: 'X', offsetTop: N } — same as a
              // `#### Heading` string but with an extra top nudge. Used to
              // open up vertical space between a sub-section and the one
              // above without affecting OTHER headings on the page.
              if (typeof para === 'object' && para !== null && typeof para.heading === 'string') {
                const extra = para.offsetTop || 0
                return (
                  <h4
                    key={j}
                    className="cs__new-screens-section-head"
                    style={extra ? { marginTop: `${40 + extra}px` } : undefined}
                  >
                    {para.heading}
                  </h4>
                )
              }
              // an object with { sideBySide: { text, images, variant? } }
              // renders a 2-column row. `variant` controls how the images
              // are arranged in the right column:
              //   - undefined / 'column' (default): stacked vertically
              //   - 'stack': layered cards with auto-swap
              if (
                typeof para === 'object' &&
                para !== null &&
                para.sideBySide &&
                Array.isArray(para.sideBySide.images)
              ) {
                const { text, images: rowImages, variant, flip, stackOffsetX, stackOffsetY } = para.sideBySide
                const renderText = () =>
                  text &&
                  (Array.isArray(text)
                    ? text.map((t, k) => {
                        // bullet block embedded inside the text column
                        if (typeof t === 'object' && t !== null && Array.isArray(t.bullets)) {
                          return (
                            <ul key={k} className="cs__new-screens-bullets">
                              {t.bullets.map((b, bk) => (
                                <li key={bk}>{renderInlineBold(b)}</li>
                              ))}
                            </ul>
                          )
                        }
                        return (
                          <p key={k} className="cs__new-screens-desc">
                            {renderInlineBold(t)}
                          </p>
                        )
                      })
                    : (
                      <p className="cs__new-screens-desc">
                        {renderInlineBold(text)}
                      </p>
                    ))
                const renderImages = () => {
                  if (variant === 'stack')
                    return (
                      <StackCards
                        images={rowImages}
                        onExpand={onExpand}
                        offsetX={
                          typeof stackOffsetX === 'number' ? stackOffsetX : 60
                        }
                        offsetY={
                          typeof stackOffsetY === 'number' ? stackOffsetY : 0
                        }
                      />
                    )
                  // default 'column': stacked vertical buttons
                  return (
                    <div className="cs__new-screens-sidebyside-images">
                      {rowImages.map((src, k) => {
                        const path = typeof src === 'string' ? src : src.src
                        const altText = typeof src === 'string' ? '' : src.alt || ''
                        const offsetX =
                          typeof src === 'string' ? 0 : src.offsetX || 0
                        const offsetY =
                          typeof src === 'string' ? 0 : src.offsetY || 0
                        const width =
                          typeof src === 'string' ? null : src.width || null
                        const height =
                          typeof src === 'string' ? null : src.height || null
                        const btnStyle = {}
                        if (offsetX || offsetY) {
                          btnStyle.transform = `translate(${offsetX}px, ${offsetY}px)`
                        }
                        if (width) btnStyle.width = `${width}px`
                        const imgStyle = {}
                        if (width) imgStyle.width = `${width}px`
                        if (height) imgStyle.height = `${height}px`
                        return (
                          <button
                            type="button"
                            key={k}
                            className="cs__new-screens-sidebyside-img-btn"
                            onClick={() => onExpand && onExpand(path)}
                            aria-label={`Expand ${altText || 'screenshot'}`}
                            style={Object.keys(btnStyle).length ? btnStyle : undefined}
                          >
                            <img
                              src={path}
                              alt={altText}
                              loading="lazy"
                              style={Object.keys(imgStyle).length ? imgStyle : undefined}
                            />
                          </button>
                        )
                      })}
                    </div>
                  )
                }

                return (
                  <div
                    key={j}
                    className={`cs__new-screens-sidebyside ${flip ? 'is-flip' : ''}`}
                  >
                    <div className="cs__new-screens-sidebyside-text">{renderText()}</div>
                    {renderImages()}
                  </div>
                )
              }
              // an object with { images: [...] } becomes a side-by-side row.
              // `gallery: true` renders a NavCarousel with prev/next arrows
              // and dot indicators (one image visible at a time) so wide
              // screenshots don't overflow the column.
              if (typeof para === 'object' && para !== null && Array.isArray(para.images)) {
                if (para.gallery) {
                  return (
                    <NavCarousel
                      key={j}
                      images={para.images}
                      onExpand={onExpand}
                    />
                  )
                }
                return (
                  <div key={j} className="cs__new-screens-inline-row">
                    {para.images.map((src, k) => {
                      const path = typeof src === 'string' ? src : src.src
                      const altText = typeof src === 'string' ? '' : src.alt || ''
                      const width =
                        typeof src === 'string' ? null : src.width || null
                      const height =
                        typeof src === 'string' ? null : src.height || null
                      const offsetX =
                        typeof src === 'string' ? 0 : src.offsetX || 0
                      const offsetY =
                        typeof src === 'string' ? 0 : src.offsetY || 0
                      const btnStyle = {}
                      if (offsetX || offsetY) {
                        btnStyle.transform = `translate(${offsetX}px, ${offsetY}px)`
                      }
                      if (width) {
                        btnStyle.width = `${width}px`
                        // override max-width so a button wider than its
                        // grid column actually renders at its full width
                        btnStyle.maxWidth = 'none'
                        // override the row's default flex: 0 0 540px so the
                        // button's layout box shrinks to the actual width
                        // (otherwise it occupies 540px and creates horizontal
                        // overflow when many are placed in the row)
                        btnStyle.flex = `0 0 ${width}px`
                      }
                      const imgStyle = {}
                      if (width) {
                        imgStyle.width = `${width}px`
                        // override the global `img { max-width: 100% }`
                        // — otherwise the img collapses to the parent's
                        // (column-constrained) width and the aspect ratio
                        // breaks
                        imgStyle.maxWidth = 'none'
                      }
                      if (height) imgStyle.height = `${height}px`
                      return (
                        <button
                          type="button"
                          key={k}
                          className="cs__new-screens-inline-row-btn"
                          onClick={() => onExpand && onExpand(path)}
                          aria-label={`Expand ${altText || 'screenshot'}`}
                          style={Object.keys(btnStyle).length ? btnStyle : undefined}
                        >
                          <img
                            src={path}
                            alt={altText}
                            loading="lazy"
                            style={Object.keys(imgStyle).length ? imgStyle : undefined}
                          />
                        </button>
                      )
                    })}
                  </div>
                )
              }
              // a paragraph that is ONLY **bold text** becomes a subhead
              const boldOnly = /^\*\*(.+)\*\*$/.exec(para)
              if (boldOnly) {
                return (
                  <h4 key={j} className="cs__new-screens-subhead">
                    {boldOnly[1]}
                  </h4>
                )
              }
              return (
                <p key={j} className="cs__new-screens-desc">
                  {renderInlineBold(para)}
                </p>
              )
            })
          : (
            <p className="cs__new-screens-desc">
              {renderInlineBold(description)}
            </p>
          ))}

      {images && images.length > 0 && (
        layout === 'phone-scene' ? (
          <PhoneScene
            images={images}
            onExpand={onExpand}
            label={`${projectTitle} — ${section.title}`}
            backdrop={backdrop}
            arrow={arrow}
          />
        ) : layout === 'phone-row' ? (
          <PhoneRow
            images={images}
            onExpand={onExpand}
            label={`${projectTitle} — ${section.title}`}
          />
        ) : (
          /* gallery layout — keep the running carousel inside the same
             dotted scene container used by PhoneScene / PhoneRow */
          <div className="cs__dotted-scene">
            <AutoGallery
              images={images}
              onExpand={onExpand}
              label={`${projectTitle} — ${section.title}`}
            />
          </div>
        )
      )}
    </div>
  )
}
