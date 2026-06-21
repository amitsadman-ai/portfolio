import { NavLink, useNavigate } from 'react-router-dom'
import {
  FileSearch2,
  Users,
  History,
  MessageSquare,
  BadgePercent,
  LogOut,
  X,
} from 'lucide-react'
import { NAV, path } from '../routes'
import { useScouts } from '../ScoutsProvider'
import { FAMILY_NAME } from '../data/children'
import './Sidebar.css'

const ICONS = { FileSearch2, Users, History, MessageSquare, BadgePercent }

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate()
  const { logout } = useScouts()

  const handleLogout = () => {
    logout()
    navigate(path())
  }

  return (
    <>
      <div
        className={`s-sidebar__scrim ${open ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside className={`s-sidebar ${open ? 'is-open' : ''}`}>
        <button className="s-sidebar__close" onClick={onClose} aria-label="סגירת תפריט">
          <X size={20} />
        </button>

        <div className="s-sidebar__brand">
          <img src="/assets/zofim-logo.png" alt="צופי ישראל" />
          <span>פורטל הורים</span>
        </div>

        <p className="s-sidebar__greeting">
          <span className="s-sidebar__greeting-hello">שלום,</span>
          <br />
          משפחת {FAMILY_NAME}
        </p>

        <nav className="s-sidebar__nav">
          {NAV.map((item) => {
            const Icon = ICONS[item.icon]
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `s-sidebar__link ${isActive ? 'is-active' : ''}`
                }
              >
                <Icon size={19} />
                <span>{item.label}</span>
              </NavLink>
            )
          })}
        </nav>

        <button className="s-sidebar__logout" onClick={handleLogout}>
          <LogOut size={19} />
          <span>התנתקות</span>
        </button>
      </aside>
    </>
  )
}
