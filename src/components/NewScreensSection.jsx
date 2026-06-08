import { useState } from 'react'
import AutoGallery from './AutoGallery'
import PhoneScene from './PhoneScene'
import PhoneRow from './PhoneRow'

/**
 * One "New screens" sub-section. If `section.tabs` is set, renders a pill
 * tab row under the title and shows the active tab's description + images.
 * Otherwise renders the section's own description + images.
 */
export default function NewScreensSection({ section, projectTitle, onExpand }) {
  const [activeTab, setActiveTab] = useState(0)
  const tabs = section.tabs
  // tab-level fields override section-level when tabs are present
  const content = tabs ? { ...section, ...tabs[activeTab] } : section
  const description = content.description
  const images = content.images
  const arrow = content.arrow
  const layout = content.layout
  const backdrop = content.backdrop || 'navy'

  return (
    <div className="cs__new-screens-section">
      <h3 className="cs__new-screens-title">{section.title}</h3>

      {section.tagline && (
        <p className="cs__new-screens-tagline">{section.tagline}</p>
      )}

      {tabs && tabs.length > 0 && (
        <div className="cs__tabs" role="tablist">
          {tabs.map((tab, i) => (
            <button
              key={i}
              type="button"
              role="tab"
              aria-selected={i === activeTab}
              className={`cs__tab ${i === activeTab ? 'is-active' : ''}`}
              onClick={() => setActiveTab(i)}
            >
              {tab.name}
            </button>
          ))}
        </div>
      )}

      {description &&
        (Array.isArray(description)
          ? description.map((para, j) => {
              // a paragraph that is ONLY **bold text** becomes a subhead
              const boldOnly = /^\*\*(.+)\*\*$/.exec(para)
              if (boldOnly) {
                return (
                  <h4 key={j} className="cs__new-screens-subhead">
                    {boldOnly[1]}
                  </h4>
                )
              }
              return (
                <p key={j} className="cs__new-screens-desc">
                  {para}
                </p>
              )
            })
          : (
            <p className="cs__new-screens-desc">{description}</p>
          ))}

      {images && images.length > 0 && (
        layout === 'phone-scene' ? (
          <PhoneScene
            images={images}
            onExpand={onExpand}
            label={`${projectTitle} — ${section.title}`}
            backdrop={backdrop}
            arrow={arrow}
          />
        ) : layout === 'phone-row' ? (
          <PhoneRow
            images={images}
            onExpand={onExpand}
            label={`${projectTitle} — ${section.title}`}
          />
        ) : (
          /* gallery layout — keep the running carousel inside the same
             dotted scene container used by PhoneScene / PhoneRow */
          <div className="cs__dotted-scene">
            <AutoGallery
              images={images}
              onExpand={onExpand}
              label={`${projectTitle} — ${section.title}`}
            />
          </div>
        )
      )}
    </div>
  )
}
