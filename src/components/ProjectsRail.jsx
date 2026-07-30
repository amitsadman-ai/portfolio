import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { projects } from '../data/projects'
import './ProjectsRail.css'

/* Desktop-only right column: a scrolling stack of large project-image cards.
 * Mirrors the reference layout (matanfeder.com) — image-forward cards that
 * link to each case study; the coming-soon project is non-clickable.
 * Cards slide in from the right as they scroll into view. */
export default function ProjectsRail() {
  const railRef = useRef(null)

  useEffect(() => {
    const cards = railRef.current?.querySelectorAll('.rail__card')
    if (!cards?.length) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const settle = (e) => e.currentTarget.classList.add('is-settled')
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('is-in')
          entry.target.addEventListener('animationend', settle, { once: true })
          io.unobserve(entry.target)
        })
      },
      { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
    )
    cards.forEach((card) => io.observe(card))
    return () => io.disconnect()
  }, [])

  return (
    <div className="rail" ref={railRef}>
      {projects.map((project) => {
        const { slug, tag, title, cardTitle, image, comingSoon } = project
        const headline = cardTitle || title

        const inner = (
          <>
            <div className="rail__media">
              {image && (
                <img className="rail__img" src={image} alt={title} loading="lazy" />
              )}
              <div className="rail__badges">
                <span className="rail__tag">{tag}</span>
                {comingSoon && (
                  <span className="rail__tag rail__tag--soon">Coming soon..</span>
                )}
              </div>
              <h3 className="rail__title rail__title--overlay">{headline}</h3>
            </div>
          </>
        )

        if (comingSoon) {
          return (
            <div key={slug} className="rail__card rail__card--soon" aria-disabled="true">
              {inner}
            </div>
          )
        }
        return (
          <Link key={slug} className="rail__card" to={`/work/${slug}`}>
            {inner}
          </Link>
        )
      })}
    </div>
  )
}
