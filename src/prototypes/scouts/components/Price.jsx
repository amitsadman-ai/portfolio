import './primitives.css'

export const formatILS = (amount) => `${Number(amount).toLocaleString('en-US')} ₪`

/**
 * Renders a shekel price. Wrapped in <bdi> + isolate so the LTR number
 * and the ₪ sign never get reordered inside surrounding RTL text.
 */
export default function Price({
  amount,
  muted = false,
  className = '',
  showFreeLabel = true,
}) {
  if (amount === 0 && showFreeLabel) {
    return <span className={`s-price s-price__free ${className}`}>ללא עלות</span>
  }
  return (
    <bdi className={`s-price ${muted ? 's-price--muted' : ''} ${className}`}>
      {formatILS(amount)}
    </bdi>
  )
}
