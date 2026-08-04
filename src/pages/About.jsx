import { useEffect, useRef, useState } from 'react'
import ChatMessage from '../components/ChatMessage'
import DreamCards from '../components/DreamCards'
import './About.css'

/* Amit's little avatar, reused in the header and on her own replies. */
const AVATAR = '/assets/about-avatar-pearls.jpg'

const DREAMS = [
  { src: '/assets/about-dream-piano.webp', alt: 'Amit learning to play the piano' },
  {
    src: '/assets/about-dream-sign.webp',
    alt: 'Amit learning sign language with a teacher',
  },
  {
    src: '/assets/about-dream-aurora.webp',
    alt: 'Amit hiking under the Northern Lights',
  },
]

/*
 * The conversation. `them` = the visitor asking (arrives in the thread with
 * a "typing…" indicator). `me` = Amit — her answers are "typed" into the
 * composer input first, then sent up into the thread. `typed` is the plain
 * text shown in the composer; `content` is the rich bubble that lands.
 */
const MESSAGES = [
  {
    from: 'them',
    content: (
      <>
        Hey Amit! So, we already know you&apos;re a big pistachio lover. What
        else can you tell me about yourself?
      </>
    ),
  },
  {
    from: 'me',
    typed:
      "I'm also a mom to the sweetest little one-year-old, and I love spending quality time with my family and friends.",
    content: (
      <>
        I&apos;m also a mom to the sweetest little one-year-old, and I love
        spending quality time with my family and friends.
      </>
    ),
  },
  {
    from: 'them',
    content: (
      <>
        Aww, I&apos;m sure she&apos;s adorable! 😊 So tell me… what&apos;s your
        biggest dream?
      </>
    ),
  },
  {
    from: 'me',
    typed:
      'Outside of design, I have three dreams: learn piano, learn sign language, and see the Northern Lights in Lapland.',
    behind: <DreamCards cards={DREAMS} />,
    content: (
      <>
        <p>Outside of design, I have three dreams:</p>
        <ul className="about__dream-list">
          <li>Learn to play the piano</li>
          <li>Learn sign language</li>
          <li>See the Northern Lights in Lapland</li>
        </ul>
        <p className="about__dream-hint">Tap to see them in the future →</p>
      </>
    ),
  },
  {
    from: 'them',
    content: (
      <>
        Those are such unique dreams — I don&apos;t hear those very often! I hope
        you get to check them all off your list.
      </>
    ),
  },
  {
    from: 'me',
    typed: 'Thank you! I hope so too. 😊 What else would you like to know?',
    content: <>Thank you! I hope so too. 😊 What else would you like to know?</>,
  },
  {
    from: 'them',
    content: <>Hmm… one last question. What&apos;s your favorite animal?</>,
  },
  {
    from: 'me',
    typed:
      'Easy — Sloths! 🦥 I love how calm they are… although I’d never design at sloth speed. 😄',
    content: (
      <>
        <p>
          Easy — Sloths! 🦥 I love how calm they are… although I&apos;d never
          design at sloth speed. 😄
        </p>
        <p className="about__funfact">
          <strong className="about__funfact-tag">Fun fact</strong> Sloths can
          actually hold their breath longer than dolphins by slowing their heart
          rate. Pretty impressive, right?
        </p>
      </>
    ),
  },
  {
    from: 'them',
    content: (
      <>
        I think I know you a little better now. 😊 Before I go, what&apos;s one
        thing you&apos;ll never compromise on?
      </>
    ),
  },
  {
    from: 'me',
    typed:
      'Thoughtful design. I believe every pixel should have a purpose, every interaction should feel effortless, and the best products quietly help people focus on what truly matters.',
    content: (
      <>
        <strong>Thoughtful design</strong>. I believe every pixel should have a
        purpose, every interaction should feel effortless, and the best products
        quietly <strong>help people focus on what truly matters</strong>.
      </>
    ),
  },
  {
    from: 'them',
    content: <>Sounds like it&apos;s time to see your work.</>,
  },
  {
    from: 'me',
    typed: "I was hoping you'd say that. Let's dive in.",
    content: <>I was hoping you&apos;d say that. Let&apos;s dive in.</>,
  },
]

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function About() {
  // how many messages have landed in the thread
  const [sentCount, setSentCount] = useState(0)
  // index of a question currently "typing" in the thread (or null)
  const [pendingThem, setPendingThem] = useState(null)
  // live text in the composer while Amit types an answer
  const [composerText, setComposerText] = useState('')
  const [typing, setTyping] = useState(false)
  const composerRef = useRef(null)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  // The conductor: walks the script, typing answers into the composer and
  // dropping questions into the thread, one at a time.
  useEffect(() => {
    if (prefersReducedMotion()) {
      setSentCount(MESSAGES.length)
      return
    }

    let cancelled = false
    const timers = new Set()
    const wait = (ms) =>
      new Promise((res) => {
        const t = setTimeout(() => {
          timers.delete(t)
          res()
        }, ms)
        timers.add(t)
      })

    const typeInto = async (text) => {
      setTyping(true)
      for (let i = 1; i <= text.length; i++) {
        if (cancelled) return
        setComposerText(text.slice(0, i))
        await wait(text[i - 1] === ' ' ? 10 : 20)
      }
      setTyping(false)
    }

    const run = async () => {
      await wait(500)
      for (let i = 0; i < MESSAGES.length; i++) {
        if (cancelled) return
        const m = MESSAGES[i]
        if (m.from === 'me') {
          await typeInto(m.typed || '')
          if (cancelled) return
          await wait(320)
          setComposerText('')
          setSentCount(i + 1)
          await wait(650)
        } else {
          setPendingThem(i)
          await wait(950)
          if (cancelled) return
          setPendingThem(null)
          setSentCount(i + 1)
          await wait(520)
        }
      }
    }
    run()

    return () => {
      cancelled = true
      timers.forEach(clearTimeout)
    }
  }, [])

  // keep the composer (and the newest message) in view as the chat plays
  useEffect(() => {
    if (sentCount === 0 && pendingThem === null) return
    composerRef.current?.scrollIntoView({ block: 'end', behavior: 'smooth' })
  }, [sentCount, pendingThem, typing])

  return (
    <section className="about" aria-label="About Amit — a little chat">
      <div className="container">
        <div className="about__lead">
          <h1 className="about__lead-title">Just Between Us</h1>
          <p className="about__lead-sub">
            Meet the person behind the research, workflows, and pixel-perfect
            solutions.
          </p>
        </div>

        <div className="about__chat">
          {/* messaging-app style header bar */}
          <header className="about__chat-header">
            <div className="about__chat-avatar-wrap">
              <img
                className="about__chat-avatar"
                src={AVATAR}
                alt="Amit Mittlman"
              />
              <span className="about__chat-dot" aria-hidden="true" />
            </div>
            <div className="about__chat-meta">
              <p className="about__chat-name">Amit Mittlman</p>
              <p className="about__chat-status">Open to Work · Available</p>
            </div>
          </header>

          {/* the conversation surface */}
          <div className="about__body">
            <div className="about__thread">
              {MESSAGES.slice(0, sentCount).map((m, i) => (
                <ChatMessage
                  key={i}
                  from={m.from}
                  avatar={m.from === 'me' ? AVATAR : undefined}
                  behind={m.behind}
                >
                  {m.content}
                </ChatMessage>
              ))}

              {/* a question that's currently "typing" in the thread */}
              {pendingThem !== null && (
                <div className="chat-msg chat-msg--them chat-msg--shown">
                  <div className="chat-msg__slot">
                    <div className="chat-msg__typing" aria-hidden="true">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* the composer — Amit's answers type here, then send up */}
          <div className="about__composer" aria-hidden="true" ref={composerRef}>
            <span
              className={`about__composer-input${
                composerText ? ' is-typing' : ''
              }`}
            >
              {composerText || 'Ask me anything about Amit…'}
              {typing && <span className="about__composer-caret" />}
            </span>
            <span
              className={`about__composer-send${
                composerText ? ' is-armed' : ''
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 19V5M12 5l-6 6M12 5l6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
