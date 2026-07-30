import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import Toolkit from '../components/Toolkit'
import ProjectsRail from '../components/ProjectsRail'
import ProjectsSection from '../components/ProjectsSection'
import './Home.css'

const DESKTOP_MQ = '(min-width: 861px)'

/* Curated homepage subset — merges Fast/Self Learner and drops Creativity &
 * Teamwork so the pills sit on two lines. The About page keeps the full SKILLS. */
const HOME_SKILLS = [
  'Time Management',
  'Multitasking',
  'Fast & Self Learner',
  'Problem Solving',
  'Leadership & responsibility',
  'Ability to work under pressure',
]

function SkillPills() {
  return (
    <div className="home-pills">
      <h2 className="home-pills__title">Turning Complex Challenges into Intuitive Experiences by</h2>
      <div className="home-pills__list">
        {HOME_SKILLS.map((skill) => (
          <span key={skill} className="home-pill">
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  const location = useLocation()
  const [isDesktop, setIsDesktop] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(DESKTOP_MQ).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(DESKTOP_MQ)
    const onChange = () => setIsDesktop(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    const id = location.state?.scrollTo
    if (id) {
      requestAnimationFrame(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
      })
    }
  }, [location.state])

  return (
    <>
      <span id="about" className="anchor-about" aria-hidden="true" />
      {isDesktop ? (
        <div className="home-split">
          <aside className="home-split__left">
            <Hero pistachios={false} />
            <Toolkit />
            <SkillPills />
          </aside>
          <section id="work" className="home-split__right">
            <ProjectsRail />
          </section>
        </div>
      ) : (
        <>
          <Hero />
          <ProjectsSection />
        </>
      )}
    </>
  )
}
