import FunFact from './FunFact'
import PistachioRain from './PistachioRain'
import './Hero.css'

export default function Hero() {
  return (
    <section id="hero" className="hero">
      <div className="container hero__inner">
        <h1 className="hero__title">
          Some people think I'm obsessed with Figma.
          <br />
          I'm actually{' '}
          <span className="hero__perched">
            obsessed
            <img
              className="hero__perched-img"
              src="/assets/pistachio-shell.webp"
              alt=""
              aria-hidden="true"
            />
          </span>{' '}
          <span className="hero__nowrap">with pistachios.</span>
        </h1>
        {/* Pile sits behind the title via z-index. The rain layer itself
            extends well above the hero, so pistachios appear to fall
            from the sky into a pile that comes to rest under the title. */}
        <div className="hero__pile-zone">
          <PistachioRain />
        </div>
        <p className="hero__sub">
          <span className="hero__greeting">Hey there, I'm Amit</span> — a Product Designer
          with{' '}
          <span className="hero__nowrap">4+ years of experience</span> building{' '}
          <span className="hero__nowrap">
            solutions that address today's needs while anticipating tomorrow's challenges.
          </span>
        </p>
        <FunFact />
      </div>
    </section>
  )
}
