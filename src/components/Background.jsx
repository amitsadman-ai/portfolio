import { useLocation } from 'react-router-dom'

export default function Background() {
  const { pathname } = useLocation()
  // Dots stay on the homepage; case study pages keep the gradient only.
  const noDots = pathname.startsWith('/work/')
  return (
    <div
      className={`bg-layer${noDots ? ' bg-layer--no-dots' : ''}`}
      aria-hidden="true"
    />
  )
}
