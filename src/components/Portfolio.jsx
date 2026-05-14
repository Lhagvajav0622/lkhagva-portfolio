import { useState, useRef } from 'react'
import { useLang } from '../LangContext'
import { useProjects } from '../hooks/useProjects'
import { useReveal, useRevealChildren } from '../hooks/useReveal'
import MagneticBtn from './MagneticBtn'
import './Portfolio.css'

function ProjectCard({ project, viewMore, index }) {
  const [pos, setPos] = useState({ x: 0, y: 0 })
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef(null)

  const onMove = e => {
    const rect = e.currentTarget.getBoundingClientRect()
    setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })

    // Subtle tilt
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rx = ((e.clientY - rect.top) - cy) / cy * -4
    const ry = ((e.clientX - rect.left) - cx) / cx * 4
    if (cardRef.current) {
      cardRef.current.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`
    }
  }

  const onLeave = () => {
    setHovered(false)
    if (cardRef.current) cardRef.current.style.transform = ''
  }

  return (
    <div
      className="proj-card data-reveal"
      data-reveal
      data-cursor-card
      style={{ transitionDelay: `${index * 0.1}s` }}
      ref={cardRef}
    >
      <div
        className="proj-img-wrap"
        data-cursor-none
        onMouseMove={onMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={onLeave}
      >
        {project.image
          ? <img src={project.image} alt={project.title} />
          : <div className="proj-img-placeholder" style={{ background: project.color || '#ccc' }} />
        }

        <div className={`proj-overlay${hovered ? ' visible' : ''}`}>
          <div
            className="view-more-cursor"
            style={{ left: pos.x, top: pos.y }}
          >
            {viewMore.split('\n').map((l, i) => <span key={i}>{l}</span>)}
          </div>
        </div>
      </div>

      <div className="proj-info">
        <h3 className="proj-title">{project.title}</h3>
        <p className="proj-desc">{project.desc}</p>
        <a href={project.caseStudyUrl || '#'} className="proj-link">
          <span>View Case Study</span>
          <span className="proj-link-arrow">↗</span>
        </a>
      </div>
    </div>
  )
}

export default function Portfolio() {
  const { t } = useLang()
  const { projects, loading } = useProjects()
  const [line1, line2] = t.portfolio.title.split('\n')
  const headerRef = useReveal()
  const gridRef = useRevealChildren('[data-reveal]')

  return (
    <section id="portfolio" className="section portfolio">
      <div className="container">
        <div className="section-header centered reveal-fade-up" ref={headerRef}>
          <div className="section-pill">{t.portfolio.label}</div>
          <h2 className="section-title-serif">{line1}<br />{line2}</h2>
        </div>

        {loading ? (
          <div className="proj-loading">Loading projects…</div>
        ) : (
          <div className="proj-grid" ref={gridRef}>
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} viewMore={t.portfolio.viewMore} index={i} />
            ))}
          </div>
        )}

        <div className="proj-see-all">
          <MagneticBtn className="outline-btn">
            <span className="btn-text">{t.portfolio.seeAll}</span>
            <span className="btn-arrow">↗</span>
          </MagneticBtn>
        </div>
      </div>
    </section>
  )
}
