import { ShoppingCart } from 'lucide-react'
import Price from './Price'
import { useScouts } from '../ScoutsProvider'
import './CartBar.css'

/** Persistent mobile bottom bar — total + open-cart. Hidden on desktop / when empty. */
export default function CartBar() {
  const { cartCount, summary, openCart } = useScouts()
  if (cartCount === 0) return null

  return (
    <button className="s-cartbar" onClick={openCart}>
      <span className="s-cartbar__side">
        <ShoppingCart size={19} />
        <span className="s-cartbar__count scouts__ltr">{cartCount}</span>
        צפייה בסל
      </span>
      <Price amount={summary.total} />
    </button>
  )
}
