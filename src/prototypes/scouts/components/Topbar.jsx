import { useEffect, useRef, useState } from 'react'
import { Menu, ShoppingCart, Globe, Check } from 'lucide-react'
import { useScouts } from '../ScoutsProvider'
import './Topbar.css'

const LANGUAGES = [
  { code: 'he', label: 'עברית' },
  { code: 'en', label: 'English' },
]

export default function Topbar({ title, onMenu }) {
  const { cartCount, openCart } = useScouts()
  const [lang, setLang] = useState('he')
  const [langOpen, setLangOpen] = useState(false)
  const langWrapRef = useRef(null)

  /* Close the language dropdown on outside-click and on Escape. */
  useEffect(() => {
    if (!langOpen) return
    const onClick = (e) => {
      if (!langWrapRef.current?.contains(e.target)) setLangOpen(false)
    }
    const onKey = (e) => e.key === 'Escape' && setLangOpen(false)
    window.addEventListener('mousedown', onClick)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('mousedown', onClick)
      window.removeEventListener('keydown', onKey)
    }
  }, [langOpen])

  return (
    <header className="s-topbar">
      <button className="s-topbar__menu" onClick={onMenu} aria-label="פתיחת תפריט">
        <Menu size={22} />
      </button>

      <h1 className="s-topbar__title">{title}</h1>

      <div className="s-topbar__actions">
        <div className="s-topbar__lang" ref={langWrapRef}>
          <button
            className="s-topbar__icon"
            aria-label="שפה"
            aria-haspopup="menu"
            aria-expanded={langOpen}
            type="button"
            onClick={() => setLangOpen((v) => !v)}
          >
            <Globe size={20} />
          </button>
          {langOpen && (
            <ul className="s-topbar__lang-menu" role="menu">
              {LANGUAGES.map((l) => (
                <li key={l.code} role="none">
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={lang === l.code}
                    className={`s-topbar__lang-option ${
                      lang === l.code ? 'is-active' : ''
                    }`}
                    onClick={() => {
                      setLang(l.code)
                      setLangOpen(false)
                    }}
                  >
                    <span>{l.label}</span>
                    {lang === l.code && <Check size={15} />}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          className="s-topbar__cart"
          onClick={openCart}
          aria-label={`סל הרשמה, ${cartCount} פריטים`}
        >
          <ShoppingCart size={20} />
          {cartCount > 0 && <span className="s-topbar__badge">{cartCount}</span>}
        </button>
      </div>
    </header>
  )
}
