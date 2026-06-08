import { Fragment } from 'react'
import { ArrowRight } from 'lucide-react'
import Reveal from './Reveal'
import AutoGallery from './AutoGallery'
import PlatformMoodboard from './PlatformMoodboard'

// Render a subtitle paragraph, wrapping any leading "•" markers in a styled
// span so they can be colored independently of the surrounding text.
function renderSubtitleParagraph(text) {
  if (!text.includes('• ')) return text
  return text.split('\n').map((line, i) => (
    <Fragment key={i}>
      {i > 0 && '\n'}
      {line.startsWith('• ') ? (
        <>
          <span className="app__subtitle-bullet">•</span>
          {line.slice(2)}
        </>
      ) : (
        line
      )}
    </Fragment>
  ))
}

function BulletList({ items, nested = false }) {
  return (
    <ul className={`app__list${nested ? ' app__list--nested' : ''}`}>
      {items.map((item, i) => {
        const text = typeof item === 'string' ? item : item.text
        const children = typeof item === 'string' ? null : item.children
        return (
          <li key={i} className="app__list-item">
            <img className="app__bullet" src="/assets/newgift.svg" alt="" aria-hidden="true" />
            <div className="app__list-content">
              <span>{text}</span>
              {children && children.length > 0 && <BulletList items={children} nested />}
            </div>
          </li>
        )
      })}
    </ul>
  )
}

export default function AppSection({ app, onExpand }) {
  const { name, title, subtitle, problem, today, solution, gallery, cta, flowName, flow2Name, flow2Image } = app

  return (
    <article className="app">
      <Reveal>
        <h2 className="app__title">{title}</h2>
        {subtitle &&
          (Array.isArray(subtitle) ? (
            subtitle.map((p, i) => (
              <p key={i} className="app__subtitle">
                {renderSubtitleParagraph(p)}
              </p>
            ))
          ) : (
            <p className="app__subtitle">{renderSubtitleParagraph(subtitle)}</p>
          ))}
      </Reveal>

      <Reveal className="app__block">
        <span className="app__label">The problem</span>
        {Array.isArray(problem) ? (
          problem.map((p, i) => (
            <p key={i} className="app__text">
              {p}
            </p>
          ))
        ) : (
          <p className="app__text">{problem}</p>
        )}
      </Reveal>

      {today && today.length > 0 && (
        <Reveal className="app__block">
          <span className="app__label">How it looks today</span>
          <div className="app__today">
            {today.map((src, i) => (
              <img
                key={i}
                className="app__today-img"
                src={src}
                alt={`${name} — current screen ${i + 1}`}
                loading="lazy"
              />
            ))}
          </div>
        </Reveal>
      )}

      <Reveal className="app__block">
        <span className="app__label">The solution</span>
        {Array.isArray(solution) ? (
          <BulletList items={solution} />
        ) : solution && typeof solution === 'object' ? (
          <>
            {Array.isArray(solution.intro) ? (
              solution.intro.map((p, i) => (
                <p key={i} className="app__text">
                  {p}
                </p>
              ))
            ) : (
              <p className="app__text">{solution.intro}</p>
            )}
            <PlatformMoodboard platforms={solution.platforms} onExpand={onExpand} />
          </>
        ) : (
          <p className="app__text">{solution}</p>
        )}
      </Reveal>

      <Reveal className="app__block">
        <span className="app__label">New screens</span>
        {flowName && <p className="app__flow-name">{flowName}</p>}
        {cta && (
          <a className="app__cta" href={cta.href} target="_blank" rel="noreferrer">
            {cta.label}
            <ArrowRight size={18} />
          </a>
        )}
        <AutoGallery images={gallery} onExpand={onExpand} label={`${name} new screens`} />

        {flow2Name && flow2Image && (
          <div className="app__flow2">
            <p className="app__flow-name">{flow2Name}</p>
            <button
              type="button"
              className="app__flow2-btn"
              onClick={() => onExpand(flow2Image)}
              aria-label={`Expand ${name} ${flow2Name} screen`}
            >
              <img
                className="app__flow2-img"
                src={flow2Image}
                alt={`${name} ${flow2Name}`}
                loading="lazy"
              />
            </button>
          </div>
        )}
      </Reveal>
    </article>
  )
}
