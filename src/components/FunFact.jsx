import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import './FunFact.css'

export default function FunFact() {
  const [revealed, setRevealed] = useState(false)

  return (
    <div className="funfact">
      <button
        className="funfact__btn"
        onClick={() => setRevealed((v) => !v)}
        aria-expanded={revealed}
      >
        <Sparkles size={16} />
        Fun fact about me
      </button>

      {revealed && (
        <p className="funfact__answer">
          My Favourite Animal is a Sloth
          <span className="funfact__icon" role="img" aria-label="sloth">
            🦥
          </span>
        </p>
      )}
    </div>
  )
}
