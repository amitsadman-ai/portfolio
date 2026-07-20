import './EvolutionTimeline.css'

/**
 * "The App's Evolution" — a two-milestone timeline for a case study.
 * Left milestone shows a pipeline of early concept screens; the right
 * milestone shows where the app landed. Every screen opens in the Lightbox
 * (the early set is navigable with prev/next; the final opens on its own).
 */
export default function EvolutionTimeline({ data, onExpand, projectTitle = '' }) {
  if (!data) return null
  const { start, end, startCaption, endCaption, early = [], final } = data

  return (
    <div className="cs__evo">
      <div className="cs__evo-track" aria-hidden="true" />

      <div className="cs__evo-cols">
        {/* ---- start milestone: pipeline of early concepts ---- */}
        <div className="cs__evo-col cs__evo-col--start">
          <div className="cs__evo-head">
            <span className="cs__evo-year">{start}</span>
            {startCaption && <span className="cs__evo-cap">{startCaption}</span>}
          </div>
          <div className="cs__evo-pipeline">
            <div
              className="cs__evo-pipeline-track"
              style={{ animationDuration: `${Math.max(28, early.length * 4)}s` }}
            >
              {[...early, ...early].map((src, i) => {
                const clone = i >= early.length
                const idx = i % early.length
                return (
                  <button
                    key={i}
                    type="button"
                    className="cs__evo-phone"
                    onClick={() => onExpand?.(early, idx)}
                    tabIndex={clone ? -1 : 0}
                    aria-hidden={clone ? 'true' : undefined}
                    aria-label={`Expand ${projectTitle} — ${start} concept ${idx + 1}`}
                  >
                    <img src={src} alt="" loading="lazy" draggable="false" />
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        <div className="cs__evo-arrow" aria-hidden="true">
          <img className="cs__evo-arrow-img" src="/assets/arrow.png" alt="" />
        </div>

        {/* ---- end milestone: where it landed ---- */}
        <div className="cs__evo-col cs__evo-col--end">
          <div className="cs__evo-head">
            <span className="cs__evo-year">{end}</span>
            {endCaption && <span className="cs__evo-cap">{endCaption}</span>}
          </div>
          {final && (
            <button
              type="button"
              className="cs__evo-phone cs__evo-phone--final"
              onClick={() => onExpand?.([final], 0)}
              aria-label={`Expand ${projectTitle} — ${end}`}
            >
              <img src={final} alt="" loading="lazy" draggable="false" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
