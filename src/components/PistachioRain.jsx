import { useMemo } from 'react'
import './PistachioRain.css'

/* Pistachios pour into a wide, shallow pile just below the title. A
 * handful trickle in first; the rest pour after a brief pause. The
 * whole layer fades out 2s after the last pistachio lands. */
export default function PistachioRain({ count = 49 }) {
  const items = useMemo(() => {
    const list = []
    /* Pile geometry — wide and SHALLOW, so the pile reads as a strip
     * along the bottom of the title rather than a mound. */
    /* Pile geometry — scaled down 30% from the prior version: narrower
     * horizontal span and shorter peak, with fewer pistachios overall. */
    const PILE_LEFT_PCT = 21
    const PILE_RIGHT_PCT = 79
    const PILE_WIDTH = PILE_RIGHT_PCT - PILE_LEFT_PCT
    const PILE_PEAK_PX = 40 /* low — keeps the pile a thin layer */

    const TRICKLE_COUNT = Math.max(5, Math.floor(count * 0.08))
    const TRICKLE_WINDOW = 350
    const BURST_START = 450
    const BURST_WINDOW = 1300

    for (let i = 0; i < count; i++) {
      /* Uniform spread across the pile width — no centre bias so the
       * pile doesn't peak as a mound. */
      const finalX = PILE_LEFT_PCT + Math.random() * PILE_WIDTH
      const d = Math.abs(finalX - 50) / (PILE_WIDTH / 2)
      const envelopeHeight = PILE_PEAK_PX * (1 - d * d)
      /* Bias toward the bottom — keeps the pile flat with just a few
       * pistachios stacked on top in the middle. */
      const finalBottom = Math.max(
        2,
        envelopeHeight * (Math.random() ** 0.55) + (Math.random() * 6 - 3),
      )

      const isTrickle = i < TRICKLE_COUNT
      const delay = isTrickle
        ? Math.random() * TRICKLE_WINDOW
        : BURST_START + Math.random() * BURST_WINDOW

      list.push({
        id: i,
        x: finalX,
        finalBottom,
        cracked: Math.random() < 0.4,
        delay,
        duration: 600 + Math.random() * 300,
        rotation: Math.floor(Math.random() * 540 - 270),
        size: 26 + Math.floor(Math.random() * 18),
      })
    }
    list.sort((a, b) => b.finalBottom - a.finalBottom)
    return list
  }, [count])

  return (
    <div className="pistachio-rain" aria-hidden="true">
      {items.map((p) => (
        <img
          key={p.id}
          className="pistachio-rain__item"
          src={
            p.cracked
              ? '/assets/pistachio-noshell.webp'
              : '/assets/pistachio-shell.webp'
          }
          alt=""
          style={{
            '--x': `${p.x}%`,
            '--final-bottom': `${p.finalBottom}px`,
            '--rotation': `${p.rotation}deg`,
            '--delay': `${p.delay}ms`,
            '--duration': `${p.duration}ms`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
        />
      ))}
    </div>
  )
}
