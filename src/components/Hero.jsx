import FunFact from './FunFact'
import './Hero.css'

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="container hero__inner">
        <h1 className="hero__title">
          Big challenges create opportunities to lead, learn &amp; make meaningful impact.
        </h1>
        <p className="hero__sub">
          <span className="hero__greeting">Hey there, I'm Amit</span> — a detail-oriented
          Product Designer with{' '}
          <span className="hero__nowrap">4+ years of experience</span> building solutions
          that address today's needs{' '}
          <span className="hero__nowrap">while anticipating tomorrow's challenges.</span>
        </p>
        <FunFact />
      </div>
    </section>
  )
}
