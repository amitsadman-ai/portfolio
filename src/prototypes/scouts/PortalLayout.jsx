import { useState } from 'react'
import { Outlet, useLocation, Navigate } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import CartDrawer from './components/CartDrawer'
import CartBar from './components/CartBar'
import { useScouts } from './ScoutsProvider'
import { TITLES, path } from './routes'

/**
 * Authenticated portal shell: sidebar + topbar + routed content,
 * with the cart drawer (overlay) and mobile cart bar always available.
 * Redirects to the login screen if not "logged in".
 */
export default function PortalLayout() {
  const { loggedIn } = useScouts()
  const [navOpen, setNavOpen] = useState(false)
  const location = useLocation()

  if (!loggedIn) return <Navigate to={path()} replace />

  const segment = location.pathname.split('/').filter(Boolean).pop()
  const title = TITLES[segment] || 'פורטל הורים'

  return (
    <div className="scouts-shell">
      <Sidebar open={navOpen} onClose={() => setNavOpen(false)} />

      <div className="scouts-shell__main">
        <Topbar title={title} onMenu={() => setNavOpen(true)} />
        <main className="scouts-shell__content">
          <Outlet />
        </main>
        <CartBar />
      </div>

      <CartDrawer />
    </div>
  )
}
