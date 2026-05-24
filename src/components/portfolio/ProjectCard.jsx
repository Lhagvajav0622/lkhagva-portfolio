import { useState, useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../LangContext'
import './ProjectCard.css'

// Language-aware field accessor
const pick = (project, key, lang) => {
  if (lang === 'mn' && project[`${key}_mn`]) return project[`${key}_mn`]
  return project[key]
}

function Tags({ tags = [] }) {
  return (
    <div className="pc-tags">
      {tags.map(t => <span key={t} className="pc-tag">{t}</span>)}
    </div>
  )
}

function CTALink({ label = 'View Case Study', onClick }) {
  return (
    <button className="outline-btn pc-cta" onClick={e => { e.stopPropagation(); onClick?.(e) }}>
      <span className="btn-text">{label}</span>
      <span className="btn-arrow">↗</span>
    </button>
  )
}

// ── Featured card (full-width horizontal) ───────────────────────────────────
function FeaturedCard({ project, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.article
      className="pc pc--featured"
      data-cursor-card
      onClick={onClick}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -6 }}
    >
      <div
        className="pc-img pc-img--featured"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {project.image
          ? <motion.img src={project.image} alt={project.title}
              animate={{ scale: hovered ? 1.05 : 1 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} />
          : <div className="pc-img-fallback" style={{ background: project.color || '#ddd' }} />
        }
        <div className={`pc-overlay${hovered ? ' visible' : ''}`} />
        {project.featured && <span className="pc-featured-badge">Featured</span>}
      </div>

      <div className="pc-body pc-body--featured">
        <Tags tags={project.tags} />
        <h3 className="pc-title pc-title--featured">{project.title}</h3>
        <p className="pc-desc">{project.description}</p>
        {project.client && (
          <div className="pc-meta">
            <span>{project.client}</span>
            {project.date     && <><span className="pc-meta-dot">·</span><span>{project.date}</span></>}
            {project.services && <><span className="pc-meta-dot">·</span><span>{project.services}</span></>}
          </div>
        )}
        <CTALink onClick={onClick} />
      </div>
    </motion.article>
  )
}

// ── Standard card (vertical, 3D tilt) ───────────────────────────────────────
function StandardCard({ project, onClick, delay = 0 }) {
  const [hovered, setHovered] = useState(false)
  const cardRef = useRef(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [3, -3]), { stiffness: 200, damping: 20 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-4, 4]), { stiffness: 200, damping: 20 })

  const onMouseMove = e => {
    if (!cardRef.current) return
    const r = cardRef.current.getBoundingClientRect()
    x.set((e.clientX - r.left) / r.width  - 0.5)
    y.set((e.clientY - r.top)  / r.height - 0.5)
  }

  const onMouseLeave = () => { x.set(0); y.set(0); setHovered(false) }

  return (
    <motion.article
      ref={cardRef}
      className="pc pc--standard"
      data-cursor-card
      onClick={onClick}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div
        className="pc-img pc-img--standard"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {project.image
          ? <motion.img src={project.image} alt={project.title}
              animate={{ scale: hovered ? 1.06 : 1 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }} />
          : <div className="pc-img-fallback" style={{ background: project.color || '#ddd' }} />
        }
        <div className={`pc-overlay${hovered ? ' visible' : ''}`} />
      </div>

      <div className="pc-body">
        <Tags tags={project.tags} />
        <h3 className="pc-title">{project.title}</h3>
        <p className="pc-desc">{project.description}</p>
        <CTALink onClick={onClick} />
      </div>
    </motion.article>
  )
}

// ── Compact card (horizontal mini) ──────────────────────────────────────────
function CompactCard({ project, onClick, delay = 0 }) {
  return (
    <motion.article
      className="pc pc--compact"
      data-cursor-card
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ x: 6 }}
      onClick={onClick}
    >
      <div className="pc-img pc-img--compact">
        {project.image
          ? <img src={project.image} alt={project.title} />
          : <div className="pc-img-fallback" style={{ background: project.color || '#ddd' }} />
        }
      </div>
      <div className="pc-body pc-body--compact">
        <Tags tags={project.tags} />
        <h3 className="pc-title pc-title--compact">{project.title}</h3>
        <p className="pc-desc pc-desc--compact">{project.description}</p>
      </div>
      <div className="pc-compact-arrow">↗</div>
    </motion.article>
  )
}

// ── Unified export ────────────────────────────────────────────────────────────
export default function ProjectCard({ project, delay = 0 }) {
  const navigate = useNavigate()
  const { lang } = useLang()
  const goTo = () => navigate(`/project/${project.slug || project.id}`)

  // Swap title/description with MN versions when language is mn
  const localized = {
    ...project,
    title: pick(project, 'title', lang),
    description: pick(project, 'description', lang),
  }

  const variant = project.layout || 'standard'
  if (variant === 'featured') return <FeaturedCard project={localized} onClick={goTo} />
  if (variant === 'compact')  return <CompactCard  project={localized} onClick={goTo} delay={delay} />
  return <StandardCard project={localized} onClick={goTo} delay={delay} />
}
