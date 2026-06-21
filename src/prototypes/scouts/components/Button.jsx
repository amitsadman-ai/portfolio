import './primitives.css'

/** Brand button — variant: 'primary' (yellow) | 'secondary' (green) | 'ghost'. */
export default function Button({
  variant = 'primary',
  size,
  full = false,
  type = 'button',
  icon,
  children,
  className = '',
  ...rest
}) {
  const classes = [
    's-btn',
    `s-btn--${variant}`,
    size === 'sm' && 's-btn--sm',
    full && 's-btn--full',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <button type={type} className={classes} {...rest}>
      {icon && <span className="s-btn__icon">{icon}</span>}
      {children}
    </button>
  )
}
