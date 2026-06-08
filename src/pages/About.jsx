import { useEffect } from 'react'
import Reveal from '../components/Reveal'
import './About.css'

/* Soft skills shown as a continuously-scrolling pill row */
const SKILLS = [
  'Time Management',
  'Multitasking',
  'Fast Learner',
  'Creativity',
  'Problem Solving',
  'Leadership & responsibility',
  'Ability to work under pressure',
  'Teamwork',
  'Self-Learner',
]

/* Placeholder experience entries — replace with real history. */
const EXPERIENCE = [
  {
    company: 'Oddity LTD.',
    location: 'Tel Aviv, Israel',
    title: 'UX/UI Designer',
    dates: 'July 2023 — June 2026',
    bullets: [
      'Led end-to-end UX design to drive revenue, conversion, and engagement.',
      'Owned full design cycles from concept through research, design execution, and continuous improvements, achieving 60% ROI.',
      'Led new brand design, shaping visual identity and product experience.',
      'Conducted user research through interviews, usability testing and behavioral analysis.',
      'Created wire-frames, mock-ups, user flows & prototypes focusing on user-centered principles.',
      'Collaborated cross-functionally with Product, R&D, and customer-facing teams.',
      'Clearly and effectively communicate design decisions to stakeholders.',
      'Designed high-quality experiences across web, desktop, and mobile.',
      'Built AI-driven product matching experiences (e.g., quiz-based personalization).',
      'Leveraged AI tools (Cursor, Claude, Figma Make) to boost productivity.',
      'Knowledge of front-end development (HTML/CSS/JS)',
    ],
  },
  {
    company: 'Skeep',
    location: 'Tel Aviv, Israel',
    title: 'Product Designer',
    dates: 'June 2022 — June 2023',
    bullets: [
      'Simplified complex workflows into intuitive, user-friendly experiences.',
      'Led application redesign, defining new interface and behavior.',
      'Create user scenarios, journey map, wireframes, UI designs & prototypes for full product cycle.',
      'Drove product improvements and new features alongside Product Managers and R&D.',
      'Conducted user research through customer interviews, competitor analysis, and market trends.',
      'Led QA process for internal system.',
      'Proficient in Figma and Adobe tools (Photoshop, Illustrator, After Effects).',
    ],
  },
]

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  return (
    <section className="about">
      <div className="container">
        <Reveal className="about__hero">
          <h1 className="about__title">About Me</h1>
          <div className="about__photo">
            <img
              className="about__photo-img"
              src="/assets/about-me-v4.webp"
              alt="Amit Mittlman"
              loading="lazy"
            />
          </div>
          <div className="about__intro">
            <p className="about__text">
              I&apos;m a Product Designer with over 4 years of experience creating
              intuitive, user-centered digital experiences. I enjoy turning
              complex workflows into simple, engaging solutions that help users
              achieve their goals with ease. Throughout my career, I&apos;ve
              worked on a variety of products, taking ideas from initial
              research and discovery through prototyping, testing, and
              pixel-perfect execution.
            </p>
            <p className="about__text">
              I combine a strong attention to detail with a creative and
              problem-solving mindset, always looking for ways to improve both
              the user experience and business outcomes. With advanced
              expertise in Figma, including design systems, components,
              auto-layouts, and interactive prototypes, I thrive in
              collaborative environments and enjoy working closely with
              cross-functional teams to bring ideas to life. I&apos;m
              constantly seeking new challenges, opportunities to grow, and
              ways to create meaningful products that make a real impact.
            </p>
          </div>
        </Reveal>

        <Reveal className="about__experience">
          <h2 className="about__section-title">Experience</h2>
          <ul className="about__exp-list">
            {EXPERIENCE.map((job, i) => (
              <li key={i} className="about__exp-item">
                <div className="about__exp-head">
                  <div className="about__exp-company-block">
                    <h3 className="about__exp-company">{job.company}</h3>
                    <p className="about__exp-location">{job.location}</p>
                  </div>
                  <p className="about__exp-dates">{job.dates}</p>
                </div>
                <p className="about__exp-title">{job.title}</p>
                {job.bullets && job.bullets.length > 0 && (
                  <ul className="about__exp-bullets">
                    {job.bullets.map((b, j) => (
                      <li key={j}>{b}</li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal className="about__skills" aria-label="Soft skills">
          <h2 className="about__skills-title">
            Turning Complex Challenges into Intuitive Experiences by
          </h2>
          <div className="about__skills-marquee">
            <div className="about__skills-track">
              {[...SKILLS, ...SKILLS].map((skill, i) => (
                <span
                  key={i}
                  className="about__skill"
                  aria-hidden={i >= SKILLS.length ? 'true' : undefined}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
