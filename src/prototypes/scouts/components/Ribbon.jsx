import './primitives.css'

/** Corner ribbon, e.g. "מקומות אחרונים". Parent must be position:relative + overflow:hidden. */
export default function Ribbon({ children = 'מקומות אחרונים' }) {
  return <span className="s-ribbon">{children}</span>
}
