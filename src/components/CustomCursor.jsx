import { useEffect, useRef } from 'react'
import './CustomCursor.css'

// Spring physics: stiffness / damping per axis
function makeSpring(stiffness = 160, damping = 22) {
  return { pos: 0, vel: 0, stiffness, damping }
}

function stepSpring(s, target, dt) {
  const force = -s.stiffness * (s.pos - target) - s.damping * s.vel
  s.vel += force * dt
  s.pos += s.vel * dt
  return s.pos
}

function lerp(a, b, t) { return a + (b - a) * t }

// Cursor state targets: [width, height, borderRadius(px), dark]
const STATES = {
  default: { w: 34, h: 34, r: 999, dark: false, label: '' },
  btn:     { w: 88, h: 42, r: 999, dark: false, label: '' },
  card:    { w: 80, h: 80, r: 16,  dark: true,  label: 'VIEW' },
  text:    { w: 2,  h: 30, r: 2,   dark: false, label: '' },
  img:     { w: 64, h: 64, r: 999, dark: false, label: '' },
  drag:    { w: 46, h: 46, r: 999, dark: false, label: '' },
}

const L_DOT  = 0.28   // dot lerp factor
const L_RING = 0.10   // ring position lerp
const L_DIM  = 0.11   // ring dimension lerp

export default function CustomCursor() {
  const ringRef  = useRef(null)
  const dotRef   = useRef(null)
  const labelRef = useRef(null)
  const trailRef = useRef(null)

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    document.documentElement.classList.add('custom-cursor-active')

    // Live positions
    const mouse  = { x: window.innerWidth / 2, y: window.innerHeight / 2 }
    const dotP   = { x: mouse.x, y: mouse.y }
    const ringP  = { x: mouse.x, y: mouse.y }
    const trailP = { x: mouse.x, y: mouse.y }

    // Spring channels for ring dimensions
    const sw = makeSpring(140, 20)
    const sh = makeSpring(140, 20)
    const sr = makeSpring(120, 18)
    sw.pos = 34; sh.pos = 34; sr.pos = 999

    // Current interpolated dims (for speed-stretch overlay)
    const dim = { w: 34, h: 34, r: 999 }

    // Velocity tracking
    let prevX = mouse.x, prevY = mouse.y
    let vx = 0, vy = 0, spd = 0, ang = 0
    let state = 'default'
    let lastTime = performance.now()
    let raf = null
    let visible = false

    // ── State machine ────────────────────────────────────────────────────
    const applyState = s => {
      if (state === s) return
      state = s
      const T = STATES[s]
      if (labelRef.current) {
        labelRef.current.textContent = T.label
        labelRef.current.style.opacity = T.label ? '1' : '0'
      }
      if (ringRef.current) {
        ringRef.current.dataset.state = s
      }
      sw.stiffness = s === 'text' ? 200 : 140
      sh.stiffness = s === 'text' ? 200 : 140
    }

    // ── Mouse handlers ───────────────────────────────────────────────────
    const onMove = e => {
      prevX = mouse.x; prevY = mouse.y
      mouse.x = e.clientX; mouse.y = e.clientY
      vx = mouse.x - prevX
      vy = mouse.y - prevY
      spd = Math.sqrt(vx * vx + vy * vy)
      if (spd > 0.8) ang = Math.atan2(vy, vx) * 180 / Math.PI

      if (!visible) {
        dotP.x = ringP.x = trailP.x = mouse.x
        dotP.y = ringP.y = trailP.y = mouse.y
        visible = true
        if (ringRef.current)  ringRef.current.style.opacity  = '1'
        if (dotRef.current)   dotRef.current.style.opacity   = '1'
        if (trailRef.current) trailRef.current.style.opacity = '1'
      }

      // Element detection
      const el = document.elementFromPoint(e.clientX, e.clientY)
      if (!el) { applyState('default'); return }

      if      (el.closest('[data-rbd-draggable-id]'))       applyState('drag')
      else if (el.closest('[data-cursor-card]'))             applyState('card')
      else if (el.closest('button,a,.plan-cta,.hero-cta,.outline-btn,.insta-btn,.lang-btn,.hamburger,.ap-nav-item')) applyState('btn')
      else if (el.closest('img,.about-circle,.proj-img-wrap,.cs-cover-img')) applyState('img')
      else if (el.closest('p,li,.tl-desc,.svc-desc,.about-bio,.plan-feature,.cs-body') && !el.closest('button,a')) applyState('text')
      else    applyState('default')
    }

    const onLeave  = () => applyState('default')
    const onDown   = () => {
      ringRef.current?.classList.add('cur-ring--press')
      dotRef.current?.classList.add('cur-dot--press')
    }
    const onUp = () => {
      ringRef.current?.classList.remove('cur-ring--press')
      dotRef.current?.classList.remove('cur-dot--press')
    }

    document.addEventListener('mousemove',  onMove)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mousedown',  onDown)
    document.addEventListener('mouseup',    onUp)

    // ── Magnetic pull ────────────────────────────────────────────────────
    const onMagnetMove = e => {
      document.querySelectorAll('button,.outline-btn,.insta-btn,.hero-cta,.plan-cta,.lang-btn').forEach(el => {
        const rect = el.getBoundingClientRect()
        const cx = rect.left + rect.width  / 2
        const cy = rect.top  + rect.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        const dist = Math.hypot(dx, dy)
        const radius = Math.max(rect.width, rect.height) * 0.95
        if (dist < radius) {
          const pull = (1 - dist / radius) * 0.36
          el.style.transform = `translate(${dx * pull}px,${dy * pull}px)`
        } else {
          el.style.transform = ''
        }
      })
    }
    const onMagnetLeave = () =>
      document.querySelectorAll('button,.outline-btn,.insta-btn,.hero-cta,.plan-cta,.lang-btn')
        .forEach(el => { el.style.transform = '' })

    window.addEventListener('mousemove',  onMagnetMove)
    window.addEventListener('mouseleave', onMagnetLeave)

    // ── rAF loop ─────────────────────────────────────────────────────────
    const tick = now => {
      const dt = Math.min((now - lastTime) / 1000, 0.05)
      lastTime = now

      const T = STATES[state]

      // Speed-based stretch for default / drag
      let tw = T.w, th = T.h
      if ((state === 'default' || state === 'drag') && spd > 2) {
        const sx = Math.min(spd * 0.52, 28)
        tw = T.w + sx
        th = Math.max(10, T.h - sx * 0.38)
      }

      // Spring-drive dimensions
      dim.w = stepSpring(sw, tw, dt)
      dim.h = stepSpring(sh, th, dt)
      dim.r = stepSpring(sr, T.r, dt)

      // Lerp positions
      dotP.x   = lerp(dotP.x,   mouse.x, L_DOT)
      dotP.y   = lerp(dotP.y,   mouse.y, L_DOT)
      ringP.x  = lerp(ringP.x,  mouse.x, L_RING)
      ringP.y  = lerp(ringP.y,  mouse.y, L_RING)
      trailP.x = lerp(trailP.x, ringP.x, 0.055)
      trailP.y = lerp(trailP.y, ringP.y, 0.055)

      // Speed decay
      spd = lerp(spd, 0, 0.18)

      // Apply transforms
      const dotEl   = dotRef.current
      const ringEl  = ringRef.current
      const trailEl = trailRef.current

      if (dotEl) {
        const dotHide = state === 'text' || state === 'card'
        dotEl.style.opacity   = dotHide ? '0' : '1'
        dotEl.style.transform = `translate(${dotP.x}px,${dotP.y}px) translate(-50%,-50%)`
      }

      if (ringEl) {
        const doRotate = (state === 'default' || state === 'drag') && spd > 3
        const rotate   = doRotate ? ` rotate(${ang}deg)` : ''
        ringEl.style.transform    = `translate(${ringP.x}px,${ringP.y}px) translate(-50%,-50%)${rotate}`
        ringEl.style.width        = `${dim.w}px`
        ringEl.style.height       = `${dim.h}px`
        ringEl.style.borderRadius = `${Math.min(dim.r, 999)}px`
      }

      if (trailEl) {
        const trailScale = 0.55 + Math.min(spd * 0.018, 0.25)
        trailEl.style.transform = `translate(${trailP.x}px,${trailP.y}px) translate(-50%,-50%) scale(${trailScale})`
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mousedown',  onDown)
      document.removeEventListener('mouseup',    onUp)
      window.removeEventListener('mousemove',  onMagnetMove)
      window.removeEventListener('mouseleave', onMagnetLeave)
      document.documentElement.classList.remove('custom-cursor-active')
      document.querySelectorAll('button,.outline-btn,.insta-btn,.hero-cta,.plan-cta,.lang-btn')
        .forEach(el => { el.style.transform = '' })
    }
  }, [])

  return (
    <div className="cur-root" aria-hidden="true">
      {/* Ghost trail — slowest, fades out */}
      <div className="cur-trail" ref={trailRef} />
      {/* Outer morphing ring */}
      <div className="cur-ring" data-state="default" ref={ringRef}>
        <span className="cur-label" ref={labelRef} />
      </div>
      {/* Sharp center dot — fastest */}
      <div className="cur-dot" ref={dotRef} />
    </div>
  )
}
