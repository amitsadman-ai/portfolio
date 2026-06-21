import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import ScoutsApp from './prototypes/scouts/ScoutsApp.jsx'
import './styles/tokens.css'
import './styles/global.css'

/* Standalone entry for the Scouts parent-portal prototype.
 * Mounts ScoutsApp at the site root — vite.scouts.config.js sets
 * VITE_SCOUTS_STANDALONE so routes.js drops the /work/... prefix. */
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <ScoutsApp />
    </BrowserRouter>
  </StrictMode>,
)
