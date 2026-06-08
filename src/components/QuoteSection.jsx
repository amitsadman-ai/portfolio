import Reveal from './Reveal'
import './QuoteSection.css'

export default function QuoteSection() {
  return (
    <section className="quote">
      <div className="container">
        <Reveal as="blockquote" className="quote__inner">
          <span className="quote__grid" aria-hidden="true" />
          <p className="quote__text">Curiosity isn't just encouraged — it's rewarded.</p>
        </Reveal>
      </div>
    </section>
  )
}
