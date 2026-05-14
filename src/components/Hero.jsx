import { useEffect, useRef, useState } from 'react'
import { useLang } from '../LangContext'
import { useReveal } from '../hooks/useReveal'
import HeroBackground from './HeroBackground'
import './Hero.css'

function RotatingBadge({ text }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      className={`hero-badge${hovered ? ' badge-slow' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg viewBox="0 0 100 100" className="badge-svg">
        <defs>
          <path id="circle" d="M 50,50 m -37,0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0" />
        </defs>
        <text fontSize="10.5" fontWeight="600" letterSpacing="2.2" fill="white">
          <textPath href="#circle">{text.repeat(2)}</textPath>
        </text>
      </svg>
      <div className="badge-arrow">↗</div>
    </div>
  )
}

export default function Hero() {
  const { t } = useLang()
  const [line1, line2] = t.hero.title.split('\n')
  const wrapRef = useRef(null)

  const titleRef = useReveal()
  const subRef = useReveal({ threshold: 0.1 })
  const ctaRef = useReveal({ threshold: 0.1 })

  // Subtle parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      if (!wrapRef.current) return
      const y = window.scrollY * 0.18
      wrapRef.current.style.transform = `translateY(${y}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section id="home" className="hero">
      {/* Interactive canvas background */}
      <HeroBackground />

      {/* Ambient blobs */}
      <div className="hero-bg" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="grain" />
      </div>

      <div className="hero-inner">
        {/* Photo side */}
        <div className="hero-photo-wrap" ref={wrapRef}>
          <div className="hero-arch">
            <div className="hero-arch-img">
              <img src="/photo.jpg" alt="Lkhagvajav" onError={e => { e.target.style.display = 'none' }} />
              <div className="hero-arch-placeholder">L</div>
            </div>
          </div>
          <RotatingBadge text={t.hero.available} />
          <span className="sparkle s1" aria-hidden="true">✦</span>
          <span className="sparkle s2" aria-hidden="true">✦</span>

          {/* Floating glass UI cards */}
          <div className="hero-float-cards" aria-hidden="true">
            <div className="hfc hfc-1">
              <div className="hfc-label">Projects Done</div>
              <div className="hfc-value">10+</div>
              <div className="hfc-bars">
                <div className="hfc-bar" style={{ width: '88%' }} />
                <div className="hfc-bar" />
                <div className="hfc-bar" />
              </div>
            </div>
            <div className="hfc hfc-2">
              <div className="hfc-label">Status</div>
              <div className="hfc-sub" style={{ color: '#7bffa0', fontWeight: 600, fontSize: '0.72rem' }}>● Available</div>
              <div className="hfc-dot-row">
                <div className="hfc-dot" />
                <div className="hfc-dot" />
                <div className="hfc-dot" />
              </div>
            </div>
          </div>
        </div>

        {/* Text side */}
        <div className="hero-text">
          <div className="hero-pill reveal-fade-up revealed">{t.hero.badge}</div>

          <h1 className="hero-title reveal-fade-up" ref={titleRef}>
            {line1}<br />
            <span className="hero-title-heavy">{line2}</span>
            <span className="hero-underline" />
          </h1>

          <p className="hero-sub reveal-fade-up" ref={subRef} style={{ transitionDelay: '0.1s' }}>
            {t.hero.sub}
          </p>

          <div className="hero-cta-wrap reveal-fade-up" ref={ctaRef} style={{ transitionDelay: '0.2s' }}>
            <svg className="squiggle" viewBox="0 0 120 20" fill="none">
              <path d="M0 10 Q15 0 30 10 Q45 20 60 10 Q75 0 90 10 Q105 20 120 10" stroke="#0a0a0a" strokeWidth="1.5" fill="none" />
            </svg>
            <a
              href="#portfolio"
              className="hero-cta magnetic-btn"
              onClick={e => { e.preventDefault(); document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' }) }}
            >
              <span className="btn-text">{t.hero.cta}</span>
              <span className="btn-arrow">↗</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
