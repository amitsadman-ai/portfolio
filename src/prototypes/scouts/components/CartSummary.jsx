import Price from './Price'
import { useScouts } from '../ScoutsProvider'
import './CartSummary.css'

/** Price breakdown used in the cart drawer and the checkout screen. */
export default function CartSummary() {
  const { summary } = useScouts()
  const { subtotal, siblingDiscount, veteranDiscount, credit, total } = summary

  return (
    <dl className="s-summary">
      <div className="s-summary__row">
        <dt>סכום ביניים</dt>
        <dd>
          <Price amount={subtotal} muted />
        </dd>
      </div>

      {siblingDiscount > 0 && (
        <div className="s-summary__row s-summary__row--credit">
          <dt>הנחת אחים</dt>
          <dd>
            <Price amount={siblingDiscount} /> −
          </dd>
        </div>
      )}

      {veteranDiscount > 0 && (
        <div className="s-summary__row s-summary__row--credit">
          <dt>הנחת חבר ותיק</dt>
          <dd>
            <Price amount={veteranDiscount} /> −
          </dd>
        </div>
      )}

      {credit > 0 && (
        <div className="s-summary__row s-summary__row--credit">
          <dt>יתרת זכות במשפחה</dt>
          <dd>
            <Price amount={credit} /> −
          </dd>
        </div>
      )}

      <div className="s-summary__row s-summary__row--total">
        <dt>סה"כ לתשלום</dt>
        <dd>
          <Price amount={total} />
        </dd>
      </div>
    </dl>
  )
}
