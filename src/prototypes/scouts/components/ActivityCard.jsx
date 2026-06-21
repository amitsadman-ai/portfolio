import { useEffect, useState } from 'react'
import { Calendar, MapPin, Check } from 'lucide-react'
import Button from './Button'
import Price from './Price'
import Ribbon from './Ribbon'
import { ACTIVITY_TYPES } from '../data/activities'
import { useScouts } from '../ScoutsProvider'
import './ActivityCard.css'

export default function ActivityCard({ activity, childId }) {
  const { isInCart, addToCart, removeFromCart, cartLines, roster } = useScouts()
  const inCart = isInCart(childId, activity.id)
  const type = ACTIVITY_TYPES[activity.type]
  const [warnDifferentTribe, setWarnDifferentTribe] = useState(false)

  /* Warn the parent when adding a child whose tribe isn't already represented
   * in the cart — registration + payment route through different שבטים, so
   * mixing them can complicate the flow. Once a tribe has at least one line
   * in the cart, future additions for that tribe go through silently. */
  const child = roster.find((c) => c.id === childId)
  const existingTribes = new Set(cartLines.map((l) => l.child.tribe))
  const isMixingTribes =
    cartLines.length > 0 &&
    !!child?.tribe &&
    existingTribes.size > 0 &&
    !existingTribes.has(child.tribe)

  const handleAdd = () => {
    if (isMixingTribes) {
      setWarnDifferentTribe(true)
      return
    }
    addToCart(childId, activity.id)
  }
  const confirmAdd = () => {
    addToCart(childId, activity.id)
    setWarnDifferentTribe(false)
  }

  return (
    <article className={`s-acard ${inCart ? 'is-in-cart' : ''}`}>
      {activity.lastSpots && <Ribbon />}

      <div className="s-acard__top" style={{ '--type-accent': type.accent }}>
        <span className="s-acard__type">{type.label}</span>
        <h3 className="s-acard__title">{activity.title}</h3>
      </div>

      <div className="s-acard__body">
        <p className="s-acard__desc">
          {activity.description}{' '}
          <a className="s-acard__more" href="#" onClick={(e) => e.preventDefault()}>
            הצג יותר
          </a>
        </p>

        <ul className="s-acard__meta">
          <li>
            <MapPin size={15} />
            <span>{activity.location}</span>
          </li>
          <li>
            <Calendar size={15} />
            <span className="scouts__ltr">{activity.dateRange}</span>
          </li>
        </ul>

        <p className="s-acard__deadline">
          סיום הרשמה: <span className="scouts__ltr">{activity.deadline}</span>
        </p>
      </div>

      <div className={`s-acard__foot ${inCart ? 's-acard__foot--in-cart' : ''}`}>
        {inCart ? (
          <span key="msg" className="s-acard__added">
            <Check size={16} />
            פעילות נוספה לסל בהצלחה!
          </span>
        ) : (
          <Price amount={activity.priceILS} />
        )}
        {inCart ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => removeFromCart(childId, activity.id)}
            className="s-acard__remove-btn"
          >
            הסר מהסל
          </Button>
        ) : (
          <Button size="sm" onClick={handleAdd}>
            להרשמה
          </Button>
        )}
      </div>

      {warnDifferentTribe && (
        <DifferentTribeWarning
          onCancel={() => setWarnDifferentTribe(false)}
          onConfirm={confirmAdd}
        />
      )}
    </article>
  )
}

/* Confirmation popup shown when the parent tries to register an activity for
 * a child whose tribe isn't already represented in the cart. */
function DifferentTribeWarning({ onCancel, onConfirm }) {
  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && onCancel()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [onCancel])

  return (
    <div className="s-modal__scrim" onClick={onCancel} role="presentation">
      <div
        className="s-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="s-tribe-warn-title"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 id="s-tribe-warn-title" className="s-modal__title">
          שים לב
        </h3>
        <p className="s-modal__body">
          שים לב כי הוספת פעילות משבט אחר. ההרשמה והתשלום יבוצעו באופן מסודר
          לכל שבט בנפרד.
          <br />
          האם בכל זאת תרצה להמשיך?
        </p>
        <div className="s-modal__actions">
          <Button variant="ghost" onClick={onCancel}>
            לא, מעדיף לפצל את הרישום
          </Button>
          <Button onClick={onConfirm}>כן</Button>
        </div>
      </div>
    </div>
  )
}
