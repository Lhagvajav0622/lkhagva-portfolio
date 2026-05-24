import { useLang } from '../LangContext'
import { useReveal, useRevealChildren } from '../hooks/useReveal'
import MagneticBtn from './MagneticBtn'
import './About.css'

const experience = [
  { period: 'JUN 2024 – SEP 2024', role: 'Flutter Front-End Developer (Artisy Hub)', place: 'IO Tech', color: '#3b3bff', desc: 'Worked on the front-end of the Artisy Hub mobile application using Flutter. Implemented nearly all core screens, focusing on functionality, responsiveness, and smooth performance. Took ownership of the majority of front-end development tasks though the project was not fully completed.' },
  { period: 'JAN 2024 – PRESENT', role: 'Google UX Design Certificate', place: 'Coursera', color: '#3b3bff', desc: "Completed Google's UX Design Professional Certificate, gaining practical training in design thinking, wireframing, prototyping, and user-centered design practices." },
  { period: 'MAY 2025 – PRESENT', role: 'UI/UX Design Student', place: 'UFE Tech', color: '#00c853', desc: 'Pursuing a degree in UI/UX design. Building skills in user research, prototyping, and product design while applying knowledge to real-world projects.' },
]

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
            { num: '90%', label: ab.stats.customers },
            { num: '1', label: ab.stats.years },
            { num: '10+', label: ab.stats.projects },
          ].map((s, i) => (
            <div key={i} style={{ display: 'contents' }}>
              {i > 0 && <div className="stat-divider" />}
              <div className="stat-item" data-stat style={{ transitionDelay: `${i * 0.1}s` }}>
                <span className="stat-num">{s.num}</span>
                <span className="stat-label">{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
