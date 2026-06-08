import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { ImagePlaceholder, LogoPlaceholder } from './Placeholder'
import './ProjectCard.css'

export default function ProjectCard({ project, index }) {
  const { slug, tag, logos, image, title, cardTitle, body } = project
  // homepage card can show a shorter/punchier title than the case study page
  const headline = cardTitle || title

  return (
    <Link className="card" to={`/work/${slug}`} style={{ '--i': index }}>
      <div className="card__text">
        <span className="card__tag">{tag}</span>

        <div className="card__logos">
          {logos.map((logo) =>
            logo.src ? (
              <img key={logo.label} className="card__logo" src={logo.src} alt={logo.label} />
            ) : (
              <LogoPlaceholder key={logo.label} label={logo.label} />
            )
          )}
        </div>

        <h3 className="card__title">{headline}</h3>
        <p className="card__body">{body}</p>

        <span className="card__cta">
          Read more
          <ArrowRight size={18} />
        </span>
      </div>

      <div className="card__media">
        {image ? (
          <img className="card__image" src={image} alt={title} loading="lazy" />
        ) : (
          <ImagePlaceholder label={tag} />
        )}
      </div>
    </Link>
  )
}
