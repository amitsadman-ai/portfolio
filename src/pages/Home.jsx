import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import Hero from '../components/Hero'
import ProjectsSection from '../components/ProjectsSection'
import QuoteSection from '../components/QuoteSection'

export default function Home() {
  const location = useLocation()

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
      <Hero />
      <ProjectsSection />
      <QuoteSection />
    </>
  )
}
