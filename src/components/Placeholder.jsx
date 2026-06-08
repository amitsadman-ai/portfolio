import './Placeholder.css'

export function ImagePlaceholder({ label = 'Project visual' }) {
  return (
    <div className="ph-image" role="img" aria-label={`${label} placeholder`}>
      <span className="ph-image__dot" />
      <span className="ph-image__text">{label}</span>
    </div>
  )
}

export function LogoPlaceholder({ label }) {
  return (
    <span className="ph-logo" title={label}>
      {label}
    </span>
  )
}
