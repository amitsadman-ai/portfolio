import { useEffect, useRef } from 'react'
import { projects } from '../data/projects'
import ProjectCard from './ProjectCard'
import Reveal from './Reveal'
import './ProjectsSection.css'

export default function ProjectsSection() {
  const listRef = useRef(null)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) return

    const cards = Array.from(listRef.current?.querySelectorAll('.card') || [])
    let raf = 0

    const update = () => {
      raf = 0
      for (let i = 0; i < cards.length; i++) {
        let covered
        if (i === cards.length - 1) {
          // The last card is never covered by a following card, so it can't recede the same
          // way. Instead, recede it to the stack's size as it rises past its pin position,
          // so it ends up the same size as the cards stacked behind it.
          const top = cards[i].getBoundingClientRect().top
          const pinTop = parseFloat(getComputedStyle(cards[i].parentElement).top) || 0
          covered = Math.min(Math.max((pinTop - top) / 180, 0), 1)
        } else {
          const here = cards[i].getBoundingClientRect()
          const next = cards[i + 1].getBoundingClientRect()
          // How much the next card has slid over this (pinned) one: 0 = not yet, 1 = fully covered
          const gap = next.top - here.top
          covered = Math.min(Math.max(1 - (gap - 16) / here.height, 0), 1)
        }
        const scale = 1 - covered * 0.06
        cards[i].style.transform = `scale(${scale.toFixed(4)})`
        cards[i].style.filter =
          covered > 0.001 ? `brightness(${(1 - covered * 0.07).toFixed(3)})` : ''
      }
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    // Give every card the same height so a taller card stacked behind a shorter one
    // can't peek out below it. Only needed in the 2-column (desktop) stacking layout.
    const equalize = () => {
      cards.forEach((c) => (c.style.minHeight = ''))
      if (window.matchMedia('(min-width: 861px)').matches) {
        const max = Math.max(...cards.map((c) => c.offsetHeight))
        cards.forEach((c) => (c.style.minHeight = `${max}px`))
      }
    }

    const recalc = () => {
      equalize()
      update()
    }

    recalc()
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(recalc)
    window.addEventListener('load', recalc)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', recalc)
    return () => {
      window.removeEventListener('load', recalc)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', recalc)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="work" className="work">
      <div className="container">
        <Reveal as="header" className="work__head">
          <h2 className="work__heading">Projects along the way</h2>
        </Reveal>

        <div className="work__list" ref={listRef}>
          {projects.map((project, i) => (
            <div
              className="work__item"
              key={project.slug}
              style={{ '--i': i, '--n': projects.length }}
            >
              <ProjectCard project={project} index={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
