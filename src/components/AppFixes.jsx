import { useState } from 'react'
import AppSection from './AppSection'
import Lightbox from './Lightbox'
import './AppFixes.css'

export default function AppFixes({ apps, activeIndex, onActiveChange }) {
  // Support both controlled (parent owns activeIndex) and uncontrolled use.
  const [internalTab, setInternalTab] = useState(0)
  const activeTab = activeIndex ?? internalTab
  const setActiveTab = onActiveChange ?? setInternalTab
  const [lightbox, setLightbox] = useState(null)
  const active = apps[activeTab]

  return (
    <div className="appfix">
      <div className="appfix__tabs" role="tablist">
        {apps.map((app, i) => (
          <button
            key={app.name}
            role="tab"
            aria-selected={activeTab === i}
            className={`appfix__tab ${activeTab === i ? 'is-active' : ''}`}
            onClick={() => setActiveTab(i)}
          >
            <img src={app.logo} alt="" />
            {app.name}
          </button>
        ))}
      </div>

      <div className="appfix__sections">
        <AppSection key={active.name} app={active} onExpand={setLightbox} />
      </div>

      <Lightbox src={lightbox} onClose={() => setLightbox(null)} />
    </div>
  )
}
