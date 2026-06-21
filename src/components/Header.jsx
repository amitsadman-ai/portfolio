import { useRef, useState } from 'react'
import { useNavigate, useLocation, Link } from 'react-router-dom'
import { Linkedin, Mail, Phone, Menu, X } from 'lucide-react'
import { CONTACT } from '../data/contact'
import { projects } from '../data/projects'
import './Header.css'

const NAV = [
  { label: 'Home', id: 'hero' },
  { label: 'Work', id: 'work' },
  { label: 'About', id: 'about' },
]

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('hero')
  const [workOpen, setWorkOpen] = useState(false)
  const workCloseTimer = useRef(null)
  const openWorkMenu = () => {
    clearTimeout(workCloseTimer.current)
    setWorkOpen(true)
  }
  const closeWorkMenu = () => {
    workCloseTimer.current = setTimeout(() => setWorkOpen(false), 140)
  }

  const goToSection = (id) => {
    setOpen(false)
    setActive(id)
    if (location.pathname !== '/') {
      navigate('/', { state: { scrollTo: id } })
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="header">
      <div className="container header__inner">
        <a
          className="header__logo"
          href="/"
          onClick={(e) => {
            e.preventDefault()
            goToSection('hero')
          }}
        >
          Amit Mittlman
        </a>

        <nav className={`header__nav ${open ? 'is-open' : ''}`}>
          {NAV.map((item) =>
            item.id === 'work' ? (
              <div
                key={item.id}
                className="header__work-wrap"
                onMouseEnter={openWorkMenu}
                onMouseLeave={closeWorkMenu}
              >
                <button
                  className={`header__link ${
                    location.pathname === '/' && active === item.id ? 'is-active' : ''
                  }`}
                  aria-expanded={workOpen}
                  onClick={() => {
                    clearTimeout(workCloseTimer.current)
                    setWorkOpen((v) => !v)
                  }}
                >
                  {item.label}
                </button>
                {workOpen && (
                  <div
                    className="header__work-panel"
                    role="menu"
                    onMouseEnter={openWorkMenu}
                    onMouseLeave={closeWorkMenu}
                  >
                    {projects.map((p) =>
                      p.comingSoon ? (
                        <div
                          key={p.slug}
                          className="header__work-card header__work-card--disabled"
                          aria-disabled="true"
                        >
                          <span className="header__work-card-thumb-wrap">
                            {p.image ? (
                              <img className="header__work-card-thumb" src={p.image} alt="" />
                            ) : (
                              <span className="header__work-card-thumb header__work-card-thumb--ph" />
                            )}
                            <span className="header__work-card-badge">coming soon</span>
                          </span>
                          <span className="header__work-card-name">
                            {p.shortName || p.title}
                          </span>
                        </div>
                      ) : (
                        <Link
                          key={p.slug}
                          to={`/work/${p.slug}`}
                          className="header__work-card"
                          onClick={() => {
                            setWorkOpen(false)
                            setOpen(false)
                          }}
                        >
                          {p.image ? (
                            <img className="header__work-card-thumb" src={p.image} alt="" />
                          ) : (
                            <span className="header__work-card-thumb header__work-card-thumb--ph" />
                          )}
                          <span className="header__work-card-name">
                            {p.shortName || p.title}
                          </span>
                        </Link>
                      ),
                    )}
                  </div>
                )}
              </div>
            ) : item.id === 'about' ? (
              <Link
                key={item.id}
                to="/about"
                className={`header__link ${
                  location.pathname === '/about' ? 'is-active' : ''
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={item.id}
                className={`header__link ${
                  location.pathname === '/' && active === item.id ? 'is-active' : ''
                }`}
                onClick={() => goToSection(item.id)}
              >
                {item.label}
              </button>
            )
          )}
          <a
            className="header__link header__resume"
            href="/resume.pdf"
            target="_blank"
            rel="noreferrer"
            onClick={() => setOpen(false)}
          >
            Resume
          </a>

          <div className="header__icons header__icons--mobile">
            <SocialIcons />
          </div>
        </nav>

        <div className="header__icons header__icons--desktop">
          <SocialIcons />
        </div>

        <button
          className="header__burger"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>
    </header>
  )
}

function SocialIcons() {
  return (
    <>
      <a
        className="header__icon"
        href={CONTACT.linkedin}
        target="_blank"
        rel="noreferrer"
        aria-label="LinkedIn"
      >
        <Linkedin size={18} />
      </a>
      <a className="header__icon" href={`mailto:${CONTACT.email}`} aria-label="Email">
        <Mail size={18} />
      </a>
      <a className="header__icon" href={`tel:${CONTACT.phoneHref}`} aria-label="Phone">
        <Phone size={18} />
      </a>
    </>
  )
}
