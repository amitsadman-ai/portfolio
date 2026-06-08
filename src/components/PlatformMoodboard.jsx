import './PlatformMoodboard.css'

export default function PlatformMoodboard({ platforms = [], onExpand }) {
  if (!platforms.length) return null
  return (
    <div className="moodboard" aria-label="Platforms with a scheduled-send feature">
      {/* ---- decoration layer ---- */}
      <span className="moodboard__pink" aria-hidden="true" />
      <span className="moodboard__dots" aria-hidden="true" />
      <img
        className="moodboard__portrait moodboard__portrait--1"
        src="/assets/portrait-1.jpg"
        alt=""
        aria-hidden="true"
      />
      <img
        className="moodboard__portrait moodboard__portrait--2"
        src="/assets/portrait-2.jpg"
        alt=""
        aria-hidden="true"
      />
      <img
        className="moodboard__portrait moodboard__portrait--3"
        src="/assets/portrait-3.jpg"
        alt=""
        aria-hidden="true"
      />

      {/* ---- orbital rings: comet-tail gradient strokes; outer + inner drift
         slowly in opposite directions, middle stays still ---- */}
      <svg
        className="moodboard__orbit"
        viewBox="0 0 800 800"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="moodboard-orbit-outer" x1="0" y1="0.5" x2="1" y2="0.5">
            <stop offset="0%"   stopColor="#171a2d" stopOpacity="1" />
            <stop offset="40%"  stopColor="#5f7eb2" stopOpacity="1" />
            <stop offset="80%"  stopColor="#b0cbe8" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#b0cbe8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="moodboard-orbit-mid" x1="1" y1="0.5" x2="0" y2="0.5">
            <stop offset="0%"   stopColor="#171a2d" stopOpacity="1" />
            <stop offset="55%"  stopColor="#5f7eb2" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#b0cbe8" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="moodboard-orbit-inner" x1="0.5" y1="1" x2="0.5" y2="0">
            <stop offset="0%"   stopColor="#171a2d" stopOpacity="1" />
            <stop offset="55%"  stopColor="#5f7eb2" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#b0cbe8" stopOpacity="0" />
          </linearGradient>
        </defs>
        <g className="moodboard__orbit-group moodboard__orbit-group--outer">
          <circle className="moodboard__orbit-ring moodboard__orbit-ring--outer" cx="400" cy="400" r="340" />
        </g>
        <g className="moodboard__orbit-group moodboard__orbit-group--mid">
          <circle className="moodboard__orbit-ring moodboard__orbit-ring--mid" cx="400" cy="400" r="255" />
        </g>
        <g className="moodboard__orbit-group moodboard__orbit-group--inner">
          <circle className="moodboard__orbit-ring moodboard__orbit-ring--inner" cx="400" cy="400" r="170" />
        </g>
      </svg>

      {/* ---- platform cards arranged around the orbit ---- */}
      <ul className="moodboard__stage">
        {platforms.map((p, i) => (
          <li key={p.name} className={`moodboard__card moodboard__card--${i + 1}`}>
            <div className="moodboard__card-inner">
              <div className="moodboard__card-head">
                <img className="moodboard__logo" src={p.logo} alt="" aria-hidden="true" />
                <span className="moodboard__name">{p.name}</span>
              </div>
              <div
                className={`moodboard__shot-wrap${
                  p.screens.length > 1 ? ' moodboard__shot-wrap--stack' : ''
                }`}
              >
                {p.screens.map((src, j) => (
                  <button
                    key={src}
                    type="button"
                    onClick={() => onExpand && onExpand(src)}
                    className={`moodboard__shot-btn${
                      j === 0 ? ' moodboard__shot-btn--primary' : ' moodboard__shot-btn--secondary'
                    }`}
                    aria-label={`Expand ${p.name} scheduled message UI ${j + 1}`}
                  >
                    <img
                      src={src}
                      alt={`${p.name} scheduled message UI ${j + 1}`}
                      loading="lazy"
                      draggable="false"
                      className="moodboard__shot"
                    />
                  </button>
                ))}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
