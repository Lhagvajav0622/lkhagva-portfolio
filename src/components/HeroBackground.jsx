import { useEffect, useRef } from 'react'
import './HeroBackground.css'

// ─── Config ───────────────────────────────────────────────────────────────────
const CFG = {
  grid: {
    spacing:       46,
    dotR:          1.2,
    dotRHover:     2.6,
    opacityBase:   0.13,
    opacityHover:  0.55,
    repelRadius:   115,
    repelStrength: 52,
    returnLerp:    0.072,
    color:         [72, 72, 220],
  },
  spotlight: {
    radius:        280,
    alpha:         0.09,
    lerp:          0.038,
  },
  shapes: {
    count:         14,
    minSize:       7,
    maxSize:       22,
    minOpacity:    0.055,
    maxOpacity:    0.16,
    speedRange:    0.28,
    parallaxDepth: 0.022,
  },
}

// ─── Draw helpers ─────────────────────────────────────────────────────────────
function drawSparkle(ctx, size) {
  const h = size / 2, t = size / 8
  ctx.beginPath()
  ctx.moveTo(0, -h);     ctx.lineTo(t, -t)
  ctx.lineTo(h, 0);      ctx.lineTo(t, t)
  ctx.lineTo(0, h);      ctx.lineTo(-t, t)
  ctx.lineTo(-h, 0);     ctx.lineTo(-t, -t)
  ctx.closePath()
  ctx.stroke()
}

function drawCross(ctx, size) {
  const h = size / 2, t = size / 10
  ctx.beginPath()
  ctx.moveTo(-t, -h); ctx.lineTo(t, -h)
  ctx.lineTo(t, -t);  ctx.lineTo(h, -t)
  ctx.lineTo(h,  t);  ctx.lineTo(t, t)
  ctx.lineTo(t,  h);  ctx.lineTo(-t, h)
  ctx.lineTo(-t, t);  ctx.lineTo(-h, t)
  ctx.lineTo(-h, -t); ctx.lineTo(-t, -t)
  ctx.closePath()
  ctx.stroke()
}

function drawRing(ctx, size) {
  ctx.beginPath()
  ctx.arc(0, 0, size / 2, 0, Math.PI * 2)
  ctx.stroke()
  ctx.beginPath()
  ctx.arc(0, 0, size / 4.5, 0, Math.PI * 2)
  ctx.globalAlpha *= 0.5
  ctx.stroke()
}

function drawDiamond(ctx, size) {
  const h = size / 2
  ctx.beginPath()
  ctx.moveTo(0, -h); ctx.lineTo(h * 0.6, 0)
  ctx.lineTo(0,  h); ctx.lineTo(-h * 0.6, 0)
  ctx.closePath()
  ctx.stroke()
}

const DRAW_FNS = [drawSparkle, drawCross, drawRing, drawDiamond]

// ─── Component ────────────────────────────────────────────────────────────────
export default function HeroBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Respect reduced motion + touch devices
    const isTouch   = window.matchMedia('(pointer: coarse)').matches
    const noMotion  = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isTouch || noMotion) return

    const ctx = canvas.getContext('2d')

    // Working dimensions (CSS px)
    let W = 0, H = 0
    const dpr = () => Math.min(window.devicePixelRatio || 1, 2)

    // Mouse state
    const mouse    = { x: -999, y: -999, inside: false }
    const lerped   = { x: -999, y: -999 }   // for spotlight
    const lerpDot  = { x: -999, y: -999 }   // for grid repulsion — slightly faster
    const parallax = { x: 0, y: 0 }         // for shape layer

    // ── Grid ────────────────────────────────────────────────────────────────
    let dots = []

    const buildGrid = () => {
      dots = []
      const { spacing } = CFG.grid
      for (let x = spacing / 2; x < W; x += spacing) {
        for (let y = spacing / 2; y < H; y += spacing) {
          dots.push({ ox: x, oy: y, x, y })
        }
      }
    }

    // ── Shapes ──────────────────────────────────────────────────────────────
    let shapes = []

    const initShapes = () => {
      const { count, minSize, maxSize, minOpacity, maxOpacity, speedRange } = CFG.shapes
      shapes = Array.from({ length: count }, (_, i) => ({
        x:        Math.random() * W,
        y:        Math.random() * H,
        vx:       (Math.random() - 0.5) * speedRange,
        vy:       (Math.random() - 0.5) * speedRange,
        rot:      Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.006,
        size:     minSize + Math.random() * (maxSize - minSize),
        opacity:  minOpacity + Math.random() * (maxOpacity - minOpacity),
        depth:    0.5 + Math.random() * 1.5,  // parallax depth multiplier
        drawFn:   DRAW_FNS[i % DRAW_FNS.length],
      }))
    }

    // ── Resize ──────────────────────────────────────────────────────────────
    const resize = () => {
      const d = dpr()
      W = canvas.parentElement.offsetWidth  || window.innerWidth
      H = canvas.parentElement.offsetHeight || window.innerHeight
      canvas.width  = W * d
      canvas.height = H * d
      ctx.setTransform(d, 0, 0, d, 0, 0)
      buildGrid()
      initShapes()
    }

    // ── Mouse tracking ───────────────────────────────────────────────────────
    const onMove = e => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.inside = true
    }

    const onLeave = () => { mouse.inside = false }

    window.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    window.addEventListener('resize', resize)
    resize()

    // ── Render loop ──────────────────────────────────────────────────────────
    let raf

    const tick = () => {
      ctx.clearRect(0, 0, W, H)

      // Lerp mouse positions
      const targetX = mouse.inside ? mouse.x : lerped.x
      const targetY = mouse.inside ? mouse.y : lerped.y

      lerped.x  += (targetX - lerped.x)  * CFG.spotlight.lerp
      lerped.y  += (targetY - lerped.y)  * CFG.spotlight.lerp
      lerpDot.x += (targetX - lerpDot.x) * 0.09
      lerpDot.y += (targetY - lerpDot.y) * 0.09

      // Parallax offset (for shape layer)
      const normX = mouse.inside ? (mouse.x / W - 0.5) : 0
      const normY = mouse.inside ? (mouse.y / H - 0.5) : 0
      parallax.x += (normX * 28 - parallax.x) * 0.04
      parallax.y += (normY * 16 - parallax.y) * 0.04

      // ── 1. Spotlight ──────────────────────────────────────────────────────
      if (mouse.inside) {
        const grd = ctx.createRadialGradient(
          lerped.x, lerped.y, 0,
          lerped.x, lerped.y, CFG.spotlight.radius
        )
        grd.addColorStop(0,   `rgba(59,59,255,${CFG.spotlight.alpha})`)
        grd.addColorStop(0.5, `rgba(100,80,255,${CFG.spotlight.alpha * 0.4})`)
        grd.addColorStop(1,   'transparent')
        ctx.fillStyle = grd
        ctx.fillRect(0, 0, W, H)
      }

      // ── 2. Dot grid ──────────────────────────────────────────────────────
      const { dotR, dotRHover, opacityBase, opacityHover,
              repelRadius, repelStrength, returnLerp, color } = CFG.grid

      for (const d of dots) {
        const dx   = lerpDot.x - d.ox
        const dy   = lerpDot.y - d.oy
        const dist = Math.sqrt(dx * dx + dy * dy)

        if (dist < repelRadius && dist > 0.5 && mouse.inside) {
          const t     = 1 - dist / repelRadius
          const force = t * t * repelStrength
          const angle = Math.atan2(dy, dx)
          const tx    = d.ox - Math.cos(angle) * force
          const ty    = d.oy - Math.sin(angle) * force
          d.x += (tx - d.x) * 0.18
          d.y += (ty - d.y) * 0.18
        } else {
          d.x += (d.ox - d.x) * returnLerp
          d.y += (d.oy - d.y) * returnLerp
        }

        const proximity = mouse.inside ? Math.max(0, 1 - dist / 140) : 0
        const r   = dotR + proximity * (dotRHover - dotR)
        const opc = opacityBase + proximity * (opacityHover - opacityBase)

        ctx.beginPath()
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color[0]},${color[1]},${color[2]},${opc})`
        ctx.fill()
      }

      // ── 3. Floating shapes ───────────────────────────────────────────────
      ctx.lineWidth = 1

      for (const s of shapes) {
        // Move
        s.x   += s.vx
        s.y   += s.vy
        s.rot += s.rotSpeed

        // Soft wrap with margin
        const m = 40
        if (s.x < -m) s.x = W + m
        if (s.x > W + m) s.x = -m
        if (s.y < -m) s.y = H + m
        if (s.y > H + m) s.y = -m

        // Parallax offset per shape depth
        const px = parallax.x * s.depth * CFG.shapes.parallaxDepth * 60
        const py = parallax.y * s.depth * CFG.shapes.parallaxDepth * 60

        ctx.save()
        ctx.translate(s.x + px, s.y + py)
        ctx.rotate(s.rot)
        ctx.globalAlpha = s.opacity
        ctx.strokeStyle = `rgba(80,72,210,0.9)`
        s.drawFn(ctx, s.size)
        ctx.restore()
      }

      raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('resize', resize)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [])

  return <canvas ref={canvasRef} className="hero-bg-canvas" aria-hidden="true" />
}
