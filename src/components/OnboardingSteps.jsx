import { useEffect, useState } from 'react'
import AutoGallery from './AutoGallery'
import { useInView } from '../hooks/useInView'

/** Fixed-size auto-cycling cross-fade — shows ONE image at a time
 *  inside a 585×355 box, cycling every 3 seconds. Used as the Step's
 *  `layout: 'gallery'` renderer to keep the step layout compact. */
function StepImageCycle({ images, onExpand, stepName, intervalMs = 3000 }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (images.length <= 1) return
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % images.length)
    }, intervalMs)
    return () => clearInterval(id)
  }, [images.length, intervalMs])
  const activeSrc = images[idx]?.src || images[idx]
  return (
    <button
      type="button"
      className="cs__step-img-cycle"
      onClick={() => onExpand && onExpand(activeSrc)}
      aria-label={`Expand ${stepName}`}
    >
      {images.map((img, i) => {
        const src = typeof img === 'string' ? img : img.src
        const alt = typeof img === 'string' ? '' : img.alt || ''
        return (
          <img
            key={src}
            src={src}
            alt={i === idx ? alt : ''}
            loading={i === 0 ? 'eager' : 'lazy'}
            className={`cs__step-img-cycle-img ${i === idx ? 'is-visible' : ''}`}
          />
        )
      })}
    </button>
  )
}

/** Render a paragraph with inline **bold** segments turned into <strong>. */
function renderInlineBold(text) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    const m = /^\*\*(.+)\*\*$/.exec(part)
    return m ? <strong key={i}>{m[1]}</strong> : part
  })
}

/** Click-to-expand button wrapping one step screenshot. */
function StepImageButton({ src, alt, ariaLabel, overlay, width, height, onExpand }) {
  const btnStyle = {}
  if (width) {
    btnStyle.width = `${width}px`
    btnStyle.maxWidth = 'none'
  }
  const imgStyle = {}
  if (width) {
    imgStyle.width = `${width}px`
    imgStyle.maxWidth = 'none'
  }
  if (height) imgStyle.height = `${height}px`
  return (
    <button
      type="button"
      className={`cs__step-img-btn${overlay ? ' cs__step-img-btn--has-overlay' : ''}`}
      onClick={() => onExpand && onExpand(src)}
      aria-label={`Expand ${ariaLabel}`}
      style={Object.keys(btnStyle).length ? btnStyle : undefined}
    >
      <img
        src={src}
        alt={alt}
        loading="lazy"
        style={Object.keys(imgStyle).length ? imgStyle : undefined}
      />
      {overlay && (
        <img
          className="cs__step-img-overlay"
          src={overlay.src}
          alt={overlay.alt || ''}
          loading="lazy"
        />
      )}
    </button>
  )
}

/** Render one step's screenshot(s) — single, side-by-side row, or
 *  auto-scrolling gallery (when layout === 'gallery'). */
function StepImages({ images, onExpand, stepName, layout }) {
  if (!images || images.length === 0) return null
  const normalized = images.map((img) =>
    typeof img === 'string'
      ? { src: img, alt: '' }
      : {
          src: img.src,
          alt: img.alt || '',
          overlay: img.overlay,
          width: img.width,
          height: img.height,
        }
  )
  if (layout === 'gallery') {
    return (
      <StepImageCycle
        images={normalized}
        onExpand={onExpand}
        stepName={stepName}
      />
    )
  }
  if (normalized.length === 1) {
    const { src, alt, overlay, width, height } = normalized[0]
    return (
      <StepImageButton
        src={src}
        alt={alt}
        ariaLabel={alt || stepName}
        overlay={overlay}
        width={width}
        height={height}
        onExpand={onExpand}
      />
    )
  }
  return (
    <div className="cs__step-img-row">
      {normalized.map(({ src, alt, overlay, width, height }, i) => (
        <StepImageButton
          key={i}
          src={src}
          alt={alt}
          ariaLabel={alt || `${stepName} image ${i + 1}`}
          overlay={overlay}
          width={width}
          height={height}
          onExpand={onExpand}
        />
      ))}
    </div>
  )
}

/** Render one step's description paragraphs. */
function StepDescription({ description }) {
  if (!description) return null
  const paras = Array.isArray(description) ? description : [description]
  return (
    <>
      {paras.map((p, i) => (
        <p key={i} className="cs__step-desc">
          {renderInlineBold(p)}
        </p>
      ))}
    </>
  )
}

/* ============================================================
 * NEW DESIGN OPTION — D. Tabs (pill row, single-focus)
 * ============================================================ */
function TabsLayout({ steps, onExpand, activeIndex, setActiveIndex }) {
  const active = steps[activeIndex]
  const activeName = active.name.replace(/^\d+\.\s*/, '')
  return (
    <div className="cs__steps cs__steps--tabs">
      <div className="cs__steps-tabs" role="tablist" aria-label="Steps">
        {steps.map((step, i) => {
          const isActive = i === activeIndex
          const shortName = step.name.replace(/^\d+\.\s*/, '')
          return (
            <button
              type="button"
              key={i}
              role="tab"
              aria-selected={isActive}
              className={`cs__steps-tab ${isActive ? 'is-active' : ''}`}
              onClick={() => setActiveIndex(i)}
            >
              {shortName}
            </button>
          )
        })}
      </div>
      <div key={activeIndex} className="cs__step cs__step--active">
        <h4 className="cs__step-name">{activeName}</h4>
        <StepDescription description={active.description} />
        <StepImages
          images={active.images}
          onExpand={onExpand}
          stepName={active.name}
          layout={active.layout}
        />
      </div>
    </div>
  )
}

/* ============================================================
 * TIMELINE E1 — Classic vertical (cream-yellow circle nodes)
 * ============================================================ */
function TimelineClassic({ steps, onExpand }) {
  return (
    <div className="cs__steps cs__steps--timeline cs__steps--timeline-classic">
      {steps.map((step, i) => {
        const shortName = step.name.replace(/^\d+\.\s*/, '')
        const isLast = i === steps.length - 1
        return (
          <div className="cs__timeline-row" key={i}>
            <div className="cs__timeline-spine">
              <div className="cs__timeline-node">
                <span>{String(i + 1).padStart(2, '0')}</span>
              </div>
              {!isLast && <div className="cs__timeline-line" />}
            </div>
            <div className="cs__timeline-content">
              <h4 className="cs__step-name">{shortName}</h4>
              <StepDescription description={step.description} />
              <StepImages
                images={step.images}
                onExpand={onExpand}
                stepName={step.name}
                layout={step.layout}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ============================================================
 * TIMELINE E2 — Big handwritten numbers (no circles)
 *  Editorial / magazine feel. Numbers in OoohBaby script act as
 *  the timeline anchors instead of solid circles.
 * ============================================================ */
function TimelineScript({ steps, onExpand }) {
  return (
    <div className="cs__steps cs__steps--timeline cs__steps--timeline-script">
      {steps.map((step, i) => {
        const shortName = step.name.replace(/^\d+\.\s*/, '')
        const isLast = i === steps.length - 1
        return (
          <div className="cs__timeline-row" key={i}>
            <div className="cs__timeline-spine">
              <span className="cs__timeline-script-num">
                {String(i + 1).padStart(2, '0')}
              </span>
              {!isLast && <div className="cs__timeline-line" />}
            </div>
            <div className="cs__timeline-content">
              <h4 className="cs__step-name">{shortName}</h4>
              <StepDescription description={step.description} />
              <StepImages
                images={step.images}
                onExpand={onExpand}
                stepName={step.name}
                layout={step.layout}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/* ============================================================
 * TIMELINE E3 — Alternating zigzag (central spine)
 *  Central vertical line with nodes; content alternates left/right
 *  for a more dynamic, magazine-spread rhythm.
 * ============================================================ */
/* Render the spine column for a single row. spineVariant picks the
 * visual treatment of the node + connector line.
 *   - 'bold'    : large cream-filled badge + solid thick line
 *   - 'ring'    : outlined ring with halo + dashed line
 *   - 'pill'    : vertical pill capsule with "STEP" + number, rounded line */
function ZigzagSpine({ index, isLast, spineVariant = 'bold' }) {
  const numStr = String(index + 1).padStart(2, '0')
  return (
    <div className={`cs__zigzag-spine cs__zigzag-spine--${spineVariant}`}>
      {spineVariant === 'pill' ? (
        <div className="cs__timeline-node cs__timeline-node--pill">
          <span className="cs__timeline-pill-label">STEP</span>
          <span className="cs__timeline-pill-num">{numStr}</span>
        </div>
      ) : (
        <div className={`cs__timeline-node cs__timeline-node--${spineVariant}`}>
          <span>{numStr}</span>
        </div>
      )}
      {!isLast && (
        <div className={`cs__timeline-line cs__timeline-line--${spineVariant}`} />
      )}
    </div>
  )
}

/* Single zigzag row — uses its own IntersectionObserver so the step
 * stays "closed" (text + image hidden, pill muted) until it scrolls
 * into the middle of the viewport, then "opens" with a soft fade +
 * slide-in. Once opened it stays open (no flicker if the user
 * scrolls back up). */
function ZigzagRow({ step, index, isLast, flip, onExpand, spineVariant }) {
  const shortName = step.name.replace(/^\d+\.\s*/, '')
  // Trigger when the row's middle band touches the middle band of the
  // viewport — i.e. the pill is near the screen center.
  const [ref, inView] = useInView({
    threshold: 0,
    once: true,
    rootMargin: '-35% 0px -35% 0px',
    safetyMs: 0, // do NOT pre-open; we want this to stay closed until scrolled to
  })
  return (
    <div
      ref={ref}
      className={`cs__zigzag-row ${flip ? 'is-flip' : ''} ${
        inView ? 'is-open' : 'is-closed'
      }`}
    >
      <div className="cs__zigzag-side cs__zigzag-content">
        <h4 className="cs__step-name">{shortName}</h4>
        <StepDescription description={step.description} />
      </div>
      <ZigzagSpine
        index={index}
        isLast={isLast}
        spineVariant={spineVariant}
      />
      <div className="cs__zigzag-side cs__zigzag-image">
        <StepImages
          images={step.images}
          onExpand={onExpand}
          stepName={step.name}
          layout={step.layout}
        />
      </div>
    </div>
  )
}

function TimelineZigzag({ steps, onExpand, spineVariant = 'bold' }) {
  return (
    <div
      className={`cs__steps cs__steps--timeline cs__steps--timeline-zigzag cs__steps--spine-${spineVariant}`}
    >
      {steps.map((step, i) => (
        <ZigzagRow
          key={i}
          step={step}
          index={i}
          isLast={i === steps.length - 1}
          flip={i % 2 === 1}
          onExpand={onExpand}
          spineVariant={spineVariant}
        />
      ))}
    </div>
  )
}

/* Mini comparison preview — renders 3 abbreviated zigzag timelines
 * (no images, short text) side-by-side so the user can compare the
 * 3 spine designs at a glance. */
function SpineComparePreview({ steps }) {
  const variants = [
    { key: 'bold', label: 'S1 — Bold cream badge' },
    { key: 'ring', label: 'S2 — Outlined ring + dashed' },
    { key: 'pill', label: 'S3 — Pill marker w/ label' },
  ]
  return (
    <div className="cs__spine-compare">
      {variants.map((v) => (
        <div key={v.key} className="cs__spine-compare-block">
          <h4 className="cs__steps-compare-label">{v.label}</h4>
          <div
            className={`cs__steps cs__steps--timeline cs__steps--timeline-zigzag cs__steps--spine-${v.key} cs__steps--spine-preview`}
          >
            {steps.map((step, i) => {
              const shortName = step.name.replace(/^\d+\.\s*/, '')
              const isLast = i === steps.length - 1
              const flip = i % 2 === 1
              return (
                <div
                  className={`cs__zigzag-row ${flip ? 'is-flip' : ''}`}
                  key={i}
                >
                  <div className="cs__zigzag-side cs__zigzag-content">
                    <h4 className="cs__step-name">{shortName}</h4>
                  </div>
                  <ZigzagSpine
                    index={i}
                    isLast={isLast}
                    spineVariant={v.key}
                  />
                  <div className="cs__zigzag-side cs__zigzag-image" />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}

/* Public TimelineLayout — kept as a default that points at the
 * classic style, so existing `variant: 'timeline'` still works. */
function TimelineLayout(props) {
  return <TimelineClassic {...props} />
}

/* ============================================================
 * NEW DESIGN OPTION — F. Cards Grid (2×2 overview)
 * ============================================================ */
function CardsLayout({ steps, onExpand }) {
  return (
    <div className="cs__steps cs__steps--cards">
      {steps.map((step, i) => {
        const shortName = step.name.replace(/^\d+\.\s*/, '')
        return (
          <div className="cs__card-step" key={i}>
            <div className="cs__card-head">
              <span className="cs__card-num">{String(i + 1).padStart(2, '0')}</span>
              <h4 className="cs__step-name cs__card-name">{shortName}</h4>
            </div>
            <StepDescription description={step.description} />
            <div className="cs__card-img">
              <StepImages
                images={step.images}
                onExpand={onExpand}
                stepName={step.name}
                layout={step.layout}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

/**
 * Renders a multi-step flow in one of several layouts:
 *   - 'rows'     : alternating two-column rows, all visible
 *   - 'stepper'  : numbered horizontal stepper + content swap
 *   - 'tabs'     : pill-tab row + content swap                 [NEW]
 *   - 'timeline' : vertical timeline with all steps visible    [NEW]
 *   - 'cards'    : 2×2 card grid, all steps visible            [NEW]
 *   - 'compare'  : renders the 3 NEW variants stacked + labeled,
 *                  so the user can pick one live
 */
export default function OnboardingSteps({ steps, variant = 'rows', onExpand }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [activeTabIndex, setActiveTabIndex] = useState(0)

  // -------- COMPARE MODE — render the 3 TIMELINE options stacked --------
  if (variant === 'compare') {
    return (
      <div className="cs__steps-compare">
        <div className="cs__steps-compare-block">
          <h4 className="cs__steps-compare-label">
            Option E1 — Classic vertical timeline
          </h4>
          <TimelineClassic steps={steps} onExpand={onExpand} />
        </div>
        <div className="cs__steps-compare-block">
          <h4 className="cs__steps-compare-label">
            Option E2 — Big handwritten numbers
          </h4>
          <TimelineScript steps={steps} onExpand={onExpand} />
        </div>
        <div className="cs__steps-compare-block">
          <h4 className="cs__steps-compare-label">
            Option E3 — Alternating zigzag
          </h4>
          <TimelineZigzag steps={steps} onExpand={onExpand} />
        </div>
      </div>
    )
  }

  // -------- COMPARE SPINES MODE — preview 3 zigzag spine designs --------
  if (variant === 'compare-spines') {
    return <SpineComparePreview steps={steps} />
  }

  // -------- NEW variants --------
  if (variant === 'tabs') {
    return (
      <TabsLayout
        steps={steps}
        onExpand={onExpand}
        activeIndex={activeTabIndex}
        setActiveIndex={setActiveTabIndex}
      />
    )
  }
  if (variant === 'timeline' || variant === 'timeline-classic')
    return <TimelineClassic steps={steps} onExpand={onExpand} />
  if (variant === 'timeline-script')
    return <TimelineScript steps={steps} onExpand={onExpand} />
  if (
    variant === 'timeline-zigzag' ||
    variant === 'timeline-zigzag-bold' ||
    variant === 'timeline-zigzag-ring' ||
    variant === 'timeline-zigzag-pill'
  ) {
    const spineVariant =
      variant === 'timeline-zigzag-ring'
        ? 'ring'
        : variant === 'timeline-zigzag-pill'
        ? 'pill'
        : 'bold'
    return (
      <TimelineZigzag
        steps={steps}
        onExpand={onExpand}
        spineVariant={spineVariant}
      />
    )
  }
  if (variant === 'cards') return <CardsLayout steps={steps} onExpand={onExpand} />

  // -------- VARIANT C — horizontal numbered stepper --------
  if (variant === 'stepper') {
    const active = steps[activeIndex]
    const activeName = active.name.replace(/^\d+\.\s*/, '')
    return (
      <div className="cs__steps cs__steps--stepper">
        <div className="cs__stepper" role="tablist" aria-label="Steps">
          {steps.map((step, i) => {
            const isActive = i === activeIndex
            const shortName = step.name.replace(/^\d+\.\s*/, '')
            return (
              <button
                type="button"
                key={i}
                role="tab"
                aria-selected={isActive}
                className={`cs__stepper-step ${isActive ? 'is-active' : ''}`}
                onClick={() => setActiveIndex(i)}
              >
                <span className="cs__stepper-num">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="cs__stepper-name">{shortName}</span>
              </button>
            )
          })}
        </div>
        <div key={activeIndex} className="cs__step cs__step--active">
          <h4 className="cs__step-name">{activeName}</h4>
          <StepDescription description={active.description} />
          <StepImages
            images={active.images}
            onExpand={onExpand}
            stepName={active.name}
            layout={active.layout}
          />
        </div>
      </div>
    )
  }

  // -------- VARIANT B (default) — alternating two-column rows --------
  return (
    <div className="cs__steps cs__steps--rows">
      {steps.map((step, i) => {
        const flip =
          typeof step.flip === 'boolean' ? step.flip : i % 2 === 1
        return (
          <div
            key={i}
            className={`cs__step ${flip ? 'cs__step--flip' : ''}`}
          >
            <div className="cs__step-body">
              <h4 className="cs__step-name">{step.name}</h4>
              <StepDescription description={step.description} />
            </div>
            <div className="cs__step-images">
              <StepImages
                images={step.images}
                onExpand={onExpand}
                stepName={step.name}
                layout={step.layout}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}
