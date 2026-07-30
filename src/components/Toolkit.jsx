import { useState } from 'react'
import './Toolkit.css'

/* Tools shown under the hero on the desktop homepage — logo icons from the
 * Figma source. A tile falls back to a text chip if its logo fails to load. */
const TOOLS = [
  { name: 'Figma', logo: '/assets/tool-figma.webp' },
  { name: 'Claude', logo: '/assets/tool-claude.webp' },
  { name: 'Cursor', logo: '/assets/tool-cursor.webp' },
  { name: 'GitHub', logo: '/assets/tool-github.webp' },
  { name: 'Lovable', logo: '/assets/tool-lovable.webp' },
  { name: 'Mobbin', logo: '/assets/tool-mobbin.webp' },
  { name: 'ChatGPT', logo: '/assets/tool-chatgpt.webp' },
  { name: 'Gemini', logo: '/assets/tool-gemini.webp' },
  { name: 'Notion', logo: '/assets/tool-notion.webp' },
]

function ToolIcon({ name, logo }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return <span className="toolkit__chip">{name}</span>
  }
  return (
    <span className="toolkit__tile" title={name}>
      <img
        className="toolkit__logo"
        src={logo}
        alt={name}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    </span>
  )
}

export default function Toolkit() {
  return (
    <section className="toolkit" aria-label="My toolkit">
      <h2 className="toolkit__title">My Toolkit</h2>
      <div className="toolkit__grid">
        {TOOLS.map((t) => (
          <ToolIcon key={t.name} name={t.name} logo={t.logo} />
        ))}
      </div>
    </section>
  )
}
