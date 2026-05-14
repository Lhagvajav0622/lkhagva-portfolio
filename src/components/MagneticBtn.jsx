import { useRef } from 'react'
import './MagneticBtn.css'

export default function MagneticBtn({ children, className = '', onClick, href, strength = 0.35, ...props }) {
  const ref = useRef(null)

  const onMove = e => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = (e.clientX - cx) * strength
    const dy = (e.clientY - cy) * strength
    el.style.transform = `translate(${dx}px, ${dy}px)`
  }

  const onLeave = () => {
    if (ref.current) ref.current.style.transform = 'translate(0, 0)'
  }

  const commonProps = {
    ref,
    className: `magnetic-btn ${className}`,
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    ...props,
  }

  if (href) return <a href={href} {...commonProps}>{children}</a>
  return <button onClick={onClick} {...commonProps}>{children}</button>
}
