import { useEffect, useRef, useState } from 'react'
import { useLang } from '../LangContext'
import { useReveal, useRevealChildren } from '../hooks/useReveal'
import MagneticBtn from './MagneticBtn'
import './About.css'

function CountUp({ to, suffix = '', duration = 1600 }) {
  const [value, setValue] = useState(0)
  const ref = useRef(null)
  const hasRun = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasRun.current) {
        hasRun.current = true
        const start = performance.now()
        const tick = now => {
          const t = Math.min((now - start) / duration, 1)
          const eased = 1 - Math.pow(1 - t, 3)
          setValue(Math.round(to * eased))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      }
    }, { threshold: 0.4 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [to, duration])

  return <span ref={ref}>{value}{suffix}</span>
}

function RotatingBadge() {
  return (
    <div className="about-badge">
      <svg viewBox="0 0 100 100" className="badge-svg">
        <defs>
          <path id="ac" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
        </defs>
        <text fontSize="10.5" fontWeight="600" letterSpacing="2.2" fill="white">
          <textPath href="#ac">PLACE OF PEACE · SOURCE:TRUST · </textPath>
        </text>
      </svg>
      <div className="badge-arrow">↗</div>
    </div>
  )
}

export default function About() {
  const { t } = useLang()
  const ab = t.about
  const experience = ab.experience || []
  const topRef = useReveal({ threshold: 0.08 })
  const expRef = useReveal({ threshold: 0.08 })
  const statsRef = useRevealChildren('[data-stat]', { threshold: 0.1 })

  return (
    <section id="about" className="section about">
      <div className="container">
        {/* Top: photo + bio */}
        <div className="about-top reveal-fade-up" ref={topRef}>
          <div className="about-photo-wrap">
            <div className="about-circle">
              <img src={`${import.meta.env.BASE_URL}photo.jpg`} alt="Lkhagvajav" onError={e => { e.target.style.display = 'none' }} />
              <div className="about-circle-ph">L</div>
            </div>
            <RotatingBadge />
          </div>
          <div className="about-text">
            <div className="section-pill">{ab.label}</div>
            <h2 className="section-title-serif">{ab.title}</h2>
            <p className="about-bio">{ab.bio1}</p>
            <p className="about-bio">{ab.bio2}</p>
            <MagneticBtn className="outline-btn">
              <span className="btn-text">{ab.moreCta}</span>
              <span className="btn-arrow">↗</span>
            </MagneticBtn>
          </div>
        </div>

        {/* Experience timeline */}
        <div className="about-exp reveal-fade-up" ref={expRef} style={{ transitionDelay: '0.1s' }}>
          <div className="exp-left">
            <h3 className="exp-heading">{ab.expTitle}</h3>
            <p className="exp-sub">{ab.expSub}</p>
          </div>
          <div className="timeline">
            {experience.map((e, i) => (
              <div className="tl-item" key={i}>
                <div className="tl-meta">
                  <span className="tl-period">{e.period}</span>
                  <div className="tl-dot" style={{ background: e.color }} />
                </div>
                <div className="tl-body">
                  <h4 className="tl-role">{e.role}</h4>
                  <p className="tl-place">{e.place}</p>
                  <p className="tl-desc">{e.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="stats-bar" ref={statsRef}>
          {[
            { to: 90, suffix: '%', label: ab.stats.customers },
            { to: 2,  suffix: '',  label: ab.stats.years },
            { to: 5,  suffix: '+', label: ab.stats.projects },
          ].map((s, i) => (
            <div key={i} style={{ display: 'contents' }}>
              {i > 0 && <div className="stat-divider" />}
              <div className="stat-item" data-stat style={{ transitionDelay: `${i * 0.1}s` }}>
                <span className="stat-num"><CountUp to={s.to} suffix={s.suffix} /></span>
                <span className="stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
