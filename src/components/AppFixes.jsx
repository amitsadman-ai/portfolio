import { useState } from 'react'
import AppSection from './AppSection'
import Lightbox from './Lightbox'
import './AppFixes.css'

export default function AppFixes({ apps, activeIndex, onActiveChange }) {
  // Support both controlled (parent owns activeIndex) and uncontrolled use.
  const [internalTab, setInternalTab] = useState(0)
  const activeTab = activeIndex ?? internalTab
  const setActiveTab = onActiveChange ?? setInternalTab
  // Holds { images, index } so galleries can step through their set with
  // prev/next; single-image callers pass one src and open without arrows.
  const [lightbox, setLightbox] = useState(null)
  const openLightbox = (imgOrList, index = 0) => {
    const images = Array.isArray(imgOrList) ? imgOrList : [imgOrList]
    setLightbox({ images, index })
  }
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
        <AppSection key={active.name} app={active} onExpand={openLightbox} />
      </div>

      <Lightbox
        images={lightbox?.images}
        index={lightbox?.index}
        onClose={() => setLightbox(null)}
      />
    </div>
  )
}
