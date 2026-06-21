import { BadgePercent, Check, Info } from 'lucide-react'
import { discounts } from '../data/discounts'
import './Discounts.css'
import './screens.css'

const valueLabel = (d) =>
  d.kind === 'percent' ? `${d.value}%` : `${d.value} ₪`

export default function DiscountsScreen() {
  return (
    <section className="s-section">
      <div className="s-section__head">
        <div>
          <h2 className="s-section__title">הנחות חבר</h2>
          <p className="s-section__subtitle">
            הטבות המגיעות למשפחתכם — חלקן מתווספות אוטומטית בעת התשלום
          </p>
        </div>
      </div>

      <div className="discounts__grid">
        {discounts.map((d) => (
          <article key={d.id} className="discount">
            <div className="discount__badge">
              <BadgePercent size={18} />
              <span className="scouts__ltr">{valueLabel(d)}</span>
            </div>
            <h3 className="discount__title">{d.title}</h3>
            <p className="discount__desc">{d.description}</p>
            <p className={`discount__tag ${d.auto ? 'is-auto' : ''}`}>
              {d.auto ? <Check size={14} /> : <Info size={14} />}
              {d.auto ? 'מתווספת אוטומטית' : 'בהתאם לתנאים'}
            </p>
          </article>
        ))}
      </div>
    </section>
  )
}
