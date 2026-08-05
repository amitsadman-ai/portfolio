import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Users, Tent, Banknote } from 'lucide-react'
import { getProject, projects } from '../data/projects'
import { LogoPlaceholder } from '../components/Placeholder'
import AppFixes from '../components/AppFixes'
import CountUp from '../components/CountUp'
import Reveal from '../components/Reveal'
import AutoGallery from '../components/AutoGallery'
import PhoneScene from '../components/PhoneScene'
import NewScreensSection from '../components/NewScreensSection'
import EvolutionTimeline from '../components/EvolutionTimeline'
import Lightbox from '../components/Lightbox'
import Typewriter from '../components/Typewriter'
import Questionnaire from '../components/Questionnaire'
import './CaseStudy.css'

/* Crossfade slideshow: cycles through `images` every 3s, stacking them so
 * the next image fades in over the current one. Pauses while the tab is
 * hidden to avoid wasted timer cycles. */
const STAT_ICONS = { users: Users, tent: Tent, money: Banknote }

function AutoCycle({ images, alt = '', className = '' }) {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    if (!images || images.length < 2) return
    const id = setInterval(() => {
      setIdx((i) => (i + 1) % images.length)
    }, 3000)
    return () => clearInterval(id)
  }, [images])
  if (!images?.length) return null
  return (
    <div className={`cs__cycle ${className}`}>
      {images.map((src, i) => (
        <img
          key={src}
          className={`cs__cycle-img ${i === idx ? 'is-active' : ''}`}
          src={src}
          alt={i === idx ? alt : ''}
          loading={i === 0 ? 'eager' : 'lazy'}
          aria-hidden={i === idx ? undefined : 'true'}
        />
      ))}
    </div>
  )
}

export default function CaseStudy() {
  const { slug } = useParams()
  const project = getProject(slug)
  const currentIndex = projects.findIndex((p) => p.slug === slug)
  const nextProject = projects[(currentIndex + 1) % projects.length]
  const prevProject =
    projects[(currentIndex - 1 + projects.length) % projects.length]
  // Drives both the AppFixes tabs and the per-app banner at the top of the page
  const [activeAppIndex, setActiveAppIndex] = useState(0)

  useEffect(() => {
    window.scrollTo(0, 0)
    setActiveAppIndex(0)
  }, [slug])

  if (!project) {
    return (
      <section className="cs cs--missing">
        <div className="container">
          <h1 className="cs__title">Project not found</h1>
          <Link className="cs__back" to="/">
            <ArrowLeft size={18} /> Back to homepage
          </Link>
        </div>
      </section>
    )
  }

  const { tag, title, body, logos, csBody, csTagline, apps, problem, problemLabel, stats, statsLabel, today, todayLabel, todayCaption, todayDesktop, todayDesktopCaption, research, solution, solutionLabel, solutionImage, solutionImageAlt, questionnaire, gallery, evolution, newScreens, screensLabel, reflection, banner, bannerShift: projectBannerShift, bannerAspect: projectBannerAspect, bannerFit: projectBannerFit, bannerOffsetY: projectBannerOffsetY, extraSections } = project
  const screensLabelText = screensLabel || 'New screens'
  const paragraphs = csBody || [body]
  // Per-app banner falls back to the project-level banner (for non-apps case studies)
  const activeApp = apps?.[activeAppIndex]
  const activeBanner = activeApp?.banner ?? banner
  const bannerShift = activeApp?.bannerShift ?? projectBannerShift ?? 100
  const bannerAspect = activeApp?.bannerAspect ?? projectBannerAspect ?? '1800 / 318'
  const bannerFit = activeApp?.bannerFit ?? projectBannerFit ?? 'cover'
  const bannerOffsetY = activeApp?.bannerOffsetY ?? projectBannerOffsetY ?? 0
  // Lightbox for non-apps case studies. Holds { images, index } so galleries
  // can step through their whole set with prev/next; single-image callers pass
  // one src and it opens without arrows.
  const [lightbox, setLightbox] = useState(null)
  const openLightbox = (imgOrList, index = 0) => {
    const images = Array.isArray(imgOrList) ? imgOrList : [imgOrList]
    setLightbox({ images, index })
  }

  return (
    <>
      {activeBanner && (
        <div
          className="cs__banner"
          aria-hidden="true"
          style={{
            '--banner-shift': `${bannerShift}px`,
            '--banner-aspect': bannerAspect,
            '--banner-fit': bannerFit,
            '--banner-offset-y': `${bannerOffsetY}px`,
          }}
        >
          <img className="cs__banner-img" src={activeBanner} alt="" />
        </div>
      )}
      <section className="cs">
        <div className="container">
          <div className="cs__nav">
            {currentIndex === 0 ? (
              <Link className="cs__back" to="/">
                <ArrowLeft size={18} /> Back to Homepage
              </Link>
            ) : (
              <Link className="cs__back" to={`/work/${prevProject.slug}`}>
                <ArrowLeft size={18} /> Back
              </Link>
            )}
          </div>

          <span className="cs__tag">{tag}</span>

          {!apps && (
            <div className="cs__logos">
              {logos.map((logo) =>
                logo.src ? (
                  <img key={logo.label} className="cs__logo" src={logo.src} alt={logo.label} />
                ) : (
                  <LogoPlaceholder key={logo.label} label={logo.label} />
                )
              )}
            </div>
          )}

          <h1 className="cs__title">{title}</h1>
          {csTagline && <p className="cs__tagline">{csTagline}</p>}
          {paragraphs.map((para, i) => (
            <p key={i} className="cs__body">
              {para}
            </p>
          ))}

          {project.demoUrl && (
            <Reveal className="cs__demo">
              <div className="cs__demo-text">
                <span className="cs__demo-eyebrow">Interactive prototype</span>
                {project.demoNote && (
                  <p className="cs__demo-note">{project.demoNote}</p>
                )}
              </div>
              <a
                className="cs__demo-btn"
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Log in <ArrowRight size={18} />
              </a>
            </Reveal>
          )}

          {apps && apps.length > 0 && (
            <AppFixes
              apps={apps}
              activeIndex={activeAppIndex}
              onActiveChange={setActiveAppIndex}
            />
          )}

          {/* Non-apps case studies: optional eyebrow sections */}
          {!apps && problem && (
            <Reveal className={`app__block${project.problemWide ? ' app__block--wide-text' : ''}`}>
              <span className="app__label">{problemLabel || 'The problem'}</span>
              {Array.isArray(problem) ? (
                problem.map((p, i) => (
                  <p key={i} className="app__text">
                    {p}
                  </p>
                ))
              ) : typeof problem === 'object' && problem.bullets ? (
                <ul className="cs__problem-bullets">
                  {problem.bullets.map((b, i) => (
                    <li key={i}>
                      {typeof b === 'string' ? (
                        b
                      ) : (
                        <>
                          {b.lead && (
                            <span className="cs__problem-lead">{b.lead}</span>
                          )}
                          {b.text}
                          {b.cite && (
                            <>
                              {' '}
                              <span className="cs__problem-cite">{b.cite}</span>
                            </>
                          )}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="app__text">{problem}</p>
              )}
            </Reveal>
          )}
          {!apps && stats && stats.length > 0 && (
            <Reveal className="app__block">
              <span className="app__label">{statsLabel || 'By the numbers'}</span>
              <div className="cs__stats">
                {stats.map((s, i) => {
                  const Icon = STAT_ICONS[s.icon] || STAT_ICONS.users
                  return (
                    <div
                      key={i}
                      className={`cs__stat cs__stat--${s.accent || 'blue'}`}
                    >
                      <div className="cs__stat-media">
                        {s.image ? (
                          <img
                            className="cs__stat-img"
                            src={s.image}
                            alt=""
                            aria-hidden="true"
                            loading="lazy"
                            style={
                              s.imgSize
                                ? { width: s.imgSize, height: s.imgSize }
                                : undefined
                            }
                          />
                        ) : (
                          <span className="cs__stat-icon" aria-hidden="true">
                            <Icon size={26} strokeWidth={1.75} />
                          </span>
                        )}
                      </div>
                      <CountUp
                        className="cs__stat-num"
                        value={s.value}
                        prefix={s.prefix}
                        suffix={s.suffix}
                      />
                      <p className="cs__stat-label">{s.label}</p>
                    </div>
                  )
                })}
              </div>
            </Reveal>
          )}
          {!apps && today && (
            <Reveal className="app__block">
              <span className="app__label">{todayLabel || 'How it looks today'}</span>
              {today.length > 0 && (
                <div className="cs__today-row">
                  <figure className="cs__today-figure">
                    {todayCaption && (
                      <figcaption className="cs__today-caption">{todayCaption}</figcaption>
                    )}
                    <div className="cs__today">
                      {today.map((item, i) => {
                        const src = typeof item === 'string' ? item : item.src
                        const caption = typeof item === 'object' ? item.title : null
                        const alt = caption || `${title} — current screen ${i + 1}`
                        return (
                          <figure key={i} className="cs__today-item">
                            <button
                              type="button"
                              className="cs__today-img-btn"
                              onClick={() => openLightbox(src)}
                              aria-label={`Expand ${alt}`}
                            >
                              <img
                                className="cs__today-img"
                                src={src}
                                alt={alt}
                                loading="lazy"
                              />
                            </button>
                            {caption && (
                              <figcaption className="cs__today-title">{caption}</figcaption>
                            )}
                          </figure>
                        )
                      })}
                    </div>
                  </figure>
                  {todayDesktop?.length > 0 && (
                    <figure className="cs__today-desktop">
                      {todayDesktopCaption && (
                        <figcaption className="cs__today-caption">
                          {todayDesktopCaption}
                        </figcaption>
                      )}
                      <AutoCycle
                        images={todayDesktop}
                        alt={`${title} — current desktop screen`}
                      />
                    </figure>
                  )}
                </div>
              )}
            </Reveal>
          )}
          {!apps && research && (
            <Reveal className="app__block">
              <span className="app__label">
                {research.number && (
                  <span className="cs__research-num">{research.number}</span>
                )}
                {research.label}
              </span>
              <div className="cs__research">
                {research.people.map((p, i) => (
                  <div key={i} className="cs__research-card">
                    <img
                      className="cs__research-portrait"
                      src={p.image}
                      alt={p.name}
                      loading="lazy"
                    />
                    <div className="cs__research-body">
                      <h3 className="cs__research-name">
                        {p.name}, {p.age} <span className="cs__research-sep">•</span>{' '}
                        <span className="cs__research-role">{p.role}</span>
                      </h3>
                      <p className="cs__research-exp">
                        <span className="cs__research-exp-label">Experience:</span>{' '}
                        {p.experience}
                      </p>
                      <Typewriter
                        as="blockquote"
                        className="cs__research-quote"
                        text={`“${p.quote}”`}
                        speed={18}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Reveal>
          )}
          {!apps && solution && (
            <Reveal className="app__block app__block--wide-text">
              <span className="app__label">{solutionLabel || 'The solution'}</span>
              {Array.isArray(solution) ? (
                solution.map((p, i) => (
                  <p key={i} className="app__text">
                    {p}
                  </p>
                ))
              ) : (
                <p className="app__text">{solution}</p>
              )}
              {solutionImage && (
                <button
                  type="button"
                  className="cs__solution-img-btn"
                  onClick={() => openLightbox(solutionImage)}
                  aria-label={`Expand ${solutionImageAlt || 'solution image'}`}
                >
                  <img
                    className="cs__solution-img"
                    src={solutionImage}
                    alt={solutionImageAlt || ''}
                    loading="lazy"
                  />
                </button>
              )}
            </Reveal>
          )}
          {!apps && questionnaire && (
            <Reveal className="app__block">
              <Questionnaire data={questionnaire} />
            </Reveal>
          )}
          {!apps && evolution && (
            <Reveal className="app__block">
              <span className="app__label">{evolution.label || "The App's Evolution"}</span>
              <EvolutionTimeline
                data={evolution}
                onExpand={openLightbox}
                projectTitle={title}
              />
            </Reveal>
          )}
          {!apps && newScreens && newScreens.length > 0 && (
            <Reveal className="app__block">
              <span className="app__label">{screensLabelText}</span>
              <div className="cs__new-screens">
                {newScreens.map((section, i) => (
                  <NewScreensSection
                    key={i}
                    section={section}
                    projectTitle={title}
                    onExpand={openLightbox}
                  />
                ))}
              </div>
            </Reveal>
          )}
          {!apps && newScreens && newScreens.length > 0 && project.demoUrl && (
            <Reveal className="cs__demo cs__demo--bottom">
              <div className="cs__demo-text">
                <span className="cs__demo-eyebrow">Interactive prototype</span>
                {project.demoNote && (
                  <p className="cs__demo-note">{project.demoNote}</p>
                )}
              </div>
              <a
                className="cs__demo-btn"
                href={project.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Log in <ArrowRight size={18} />
              </a>
            </Reveal>
          )}
          {!apps && !newScreens && gallery && (
            <Reveal className="app__block">
              <span className="app__label">{screensLabelText}</span>
              {gallery.length > 0 && (
                <AutoGallery
                  images={gallery}
                  onExpand={openLightbox}
                  label={`${title} new screens`}
                />
              )}
            </Reveal>
          )}
          {!apps && extraSections && extraSections.map((sec, i) => (
            <Reveal key={i} className="app__block">
              <span className="app__label">{sec.label}</span>
              {sec.paragraphs && sec.paragraphs.map((p, j) => (
                <p key={j} className="app__text">{p}</p>
              ))}
            </Reveal>
          ))}
          {!apps && reflection && reflection.length > 0 && (
            <Reveal className="app__block app__block--wide-text">
              <span className="app__label">Built from Firsthand Experience</span>
              {reflection.map((p, i) => (
                <p key={i} className="app__text">
                  {p}
                </p>
              ))}
            </Reveal>
          )}
          {!apps && (
            <Lightbox
              images={lightbox?.images}
              index={lightbox?.index}
              onClose={() => setLightbox(null)}
            />
          )}
        </div>
      </section>

      {nextProject && (
        nextProject.comingSoon ? (
          <div className="cs__next-band cs__next-band--disabled" aria-disabled="true">
            <div className="cs__next-band-inner container">
              <span className="cs__next-label">Next up</span>
              <span className="cs__next-project">
                {nextProject.shortName || nextProject.title}
                <span className="cs__next-coming-soon">Coming soon</span>
              </span>
            </div>
          </div>
        ) : (
          <Link className="cs__next-band" to={`/work/${nextProject.slug}`}>
            <div className="cs__next-band-inner container">
              <span className="cs__next-label">Next up</span>
              <span className="cs__next-project">
                {nextProject.shortName || nextProject.title}
                <ArrowRight size={20} />
              </span>
            </div>
          </Link>
        )
      )}
    </>
  )
}
