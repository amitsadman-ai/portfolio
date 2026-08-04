import './ChatMessage.css'

/*
 * A presentational chat bubble. Timing/reveal is driven by the parent
 * (About) — it renders a ChatMessage once that line has been "sent" from
 * the composer, and the bubble pops in via CSS. An optional `behind` layer
 * (the dream deck) sits behind the bubble.
 */
export default function ChatMessage({ from = 'them', avatar, behind, children }) {
  return (
    <div
      className={`chat-msg chat-msg--${from} chat-msg--shown${
        behind ? ' chat-msg--haslayer' : ''
      }`}
    >
      <div className="chat-msg__slot">
        {behind && <div className="chat-msg__behind">{behind}</div>}
        <div className="chat-msg__bubble">{children}</div>
      </div>

      {avatar && from === 'me' && (
        <img
          className="chat-msg__avatar"
          src={avatar}
          alt=""
          aria-hidden="true"
          loading="lazy"
        />
      )}
    </div>
  )
}
