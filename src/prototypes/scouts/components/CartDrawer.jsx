import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Trash2, ShoppingBag } from 'lucide-react'
import Button from './Button'
import Price from './Price'
import CartSummary from './CartSummary'
import CheckoutSteps from './CheckoutSteps'
import { useScouts } from '../ScoutsProvider'
import { path } from '../routes'
import './CartDrawer.css'

/* Group a flat [{child, activity}, ...] list into [{child, lines: [...]}, ...]
 * while preserving the original ordering of children as they first appear. */
function groupLinesByChild(lines) {
  const groups = []
  const seen = new Map()
  for (const line of lines) {
    let g = seen.get(line.child.id)
    if (!g) {
      g = { child: line.child, lines: [] }
      seen.set(line.child.id, g)
      groups.push(g)
    }
    g.lines.push(line)
  }
  return groups
}

export default function CartDrawer() {
  const {
    cartOpen,
    closeCart,
    cartCount,
    cartLines,
    removeFromCart,
  } = useScouts()
  const navigate = useNavigate()

  // Lock body scroll + close on Escape while open (mirrors Lightbox).
  useEffect(() => {
    if (!cartOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && closeCart()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [cartOpen, closeCart])

  const visibleLines = cartLines

  const goToCheckout = () => {
    closeCart()
    navigate(path('checkout'))
  }

  return (
    <>
      <div
        className={`s-drawer__scrim ${cartOpen ? 'is-open' : ''}`}
        onClick={closeCart}
        aria-hidden="true"
      />
      <aside
        className={`s-drawer ${cartOpen ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="סל הרשמה"
      >
        <header className="s-drawer__head">
          <h2 className="s-drawer__title">
            סל הרשמה <span className="scouts__ltr">({cartCount})</span>
          </h2>
          <button className="s-drawer__close" onClick={closeCart} aria-label="סגירה">
            <X size={20} />
          </button>
        </header>

        {/* When the cart is empty there's no "current" step yet — render all
          * three stops as upcoming by pushing completedIndex below -1. */}
        <CheckoutSteps completedIndex={cartCount === 0 ? -2 : -1} />

        <div className="s-drawer__body">
          {visibleLines.length === 0 ? (
            <div className="s-drawer__empty">
              <img
                className="s-drawer__empty-illustration"
                src="/assets/empty-cart.svg"
                alt=""
              />
              <p>הסל ריק — הוסיפו פעילויות מהדף הראשי.</p>
            </div>
          ) : (
            <ul className="s-drawer__list">
              {groupLinesByChild(visibleLines).map((group) => (
                <li key={group.child.id} className="s-drawer__group">
                  <div className="s-drawer__group-head">
                    {group.child.avatar ? (
                      <img
                        className="s-drawer__avatar"
                        src={group.child.avatar}
                        alt={group.child.firstName}
                      />
                    ) : (
                      <span
                        className="s-drawer__dot"
                        style={{ background: group.child.color }}
                        aria-hidden="true"
                      >
                        {group.child.firstName[0]}
                      </span>
                    )}
                    <div className="s-drawer__group-meta">
                      <span className="s-drawer__group-name">
                        {group.child.firstName}
                        <span className="s-drawer__group-count">
                          {' '}
                          ({group.lines.length}{' '}
                          {group.lines.length === 1 ? 'פעילות' : 'פעילויות'})
                        </span>
                      </span>
                      {group.child.tribe && (
                        <span className="s-drawer__group-tribe">
                          {group.child.tribe}
                        </span>
                      )}
                    </div>
                  </div>
                  <ul className="s-drawer__group-list">
                    {group.lines.map(({ activity }) => (
                      <li
                        key={`${group.child.id}-${activity.id}`}
                        className="s-drawer__item"
                      >
                        <div className="s-drawer__item-main">
                          <p className="s-drawer__item-title">{activity.title}</p>
                          <p className="s-drawer__item-sub">
                            <span className="scouts__ltr">{activity.dateRange}</span>
                          </p>
                        </div>
                        <div className="s-drawer__item-end">
                          <Price amount={activity.priceILS} />
                          <button
                            className="s-drawer__remove"
                            onClick={() =>
                              removeFromCart(group.child.id, activity.id)
                            }
                            aria-label="הסרה מהסל"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>

        {cartCount > 0 && (
          <footer className="s-drawer__foot">
            <CartSummary />
            <Button full onClick={goToCheckout}>
              המשך להצהרת הורה ותשלום
            </Button>
          </footer>
        )}
      </aside>
    </>
  )
}
