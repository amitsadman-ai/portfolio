import { Fragment } from 'react'
import { ShoppingBag, FileText, CreditCard, Check } from 'lucide-react'

/* Shared 3-stop progress timeline used in the cart drawer and on the
 * checkout screen: סל הרשמה → הצהרת הורה → תשלום. Steps are split into
 * three visual states:
 *
 *   - "done"      → already completed; green-filled circle with a check icon
 *   - "current"   → where the user is right now; green ring, transparent fill
 *   - "upcoming"  → not yet reached; muted gray ring
 *
 * Callers pass `completedIndex` — the index of the last fully-finished step
 * (-1 means none done). The step at `completedIndex + 1` is the current
 * step; everything beyond is upcoming.
 *
 * CSS lives in CartDrawer.css under `.s-drawer__steps`/`__step` — the names
 * are kept for backwards-compat with the existing drawer styles. */
const STEPS = [
  { icon: ShoppingBag, label: 'סל הרשמה' },
  { icon: FileText, label: 'הצהרת הורה' },
  { icon: CreditCard, label: 'תשלום' },
]

export default function CheckoutSteps({ completedIndex = -1 }) {
  return (
    <ol className="s-drawer__steps" aria-label="שלבי הרשמה">
      {STEPS.map((step, i) => {
        const Icon = step.icon
        const state =
          i <= completedIndex
            ? 'done'
            : i === completedIndex + 1
            ? 'current'
            : 'upcoming'
        return (
          <Fragment key={i}>
            {i > 0 && (
              <li
                className={`s-drawer__step-conn ${
                  /* Connector i sits between step i-1 and step i; it lights
                   * up as soon as the previous step is done. */
                  i - 1 <= completedIndex ? 'is-active' : ''
                }`}
                aria-hidden="true"
              />
            )}
            <li className={`s-drawer__step is-${state}`}>
              <span className="s-drawer__step-circle">
                {state === 'done' ? <Check size={16} /> : <Icon size={16} />}
              </span>
              <span className="s-drawer__step-label">{step.label}</span>
            </li>
          </Fragment>
        )
      })}
    </ol>
  )
}
