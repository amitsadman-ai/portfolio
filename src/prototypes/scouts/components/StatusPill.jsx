import './primitives.css'
import { STATUS_LABELS } from '../data/history'

/** Status pill — status: 'active' | 'completed' | 'cancelled'. */
export default function StatusPill({ status }) {
  return (
    <span className={`s-pill s-pill--${status}`}>
      {STATUS_LABELS[status] || status}
    </span>
  )
}
