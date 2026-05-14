import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { db } from '../firebase'
import { FALLBACK_PROJECTS } from '../hooks/useProjects'
import './CaseStudy.css'

const fade = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease: [0.25,0.46,0.45,0.94] } }

async function fetchProject(slug) {
  const isConfigured = !( !import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_FIREBASE_API_KEY.includes('YOUR') )
  if (!isConfigured) return FALLBACK_PROJECTS.find(p => p.slug === slug || p.id === slug) || null

  const q = query(collection(db, 'projects'), where('slug', '==', slug))
  const snap = await getDocs(q)
  if (!snap.empty) return { id: snap.docs[0].id, ...snap.docs[0].data() }

  const q2 = query(collection(db, 'projects'), where('__name__', '==', slug))
  const snap2 = await getDocs(q2)
  return snap2.empty ? null : { id: snap2.docs[0].id, ...snap2.docs[0].data() }
}

export default function CaseStudy() {
  const { slug } = useParams()
  const navigate  = useNavigate()
  const [project, setProject] = useState(null)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchProject(slug).then(p => { setProject(p); setLoading(false) })
  }, [slug])

  useEffect(() => { window.scrollTo(0, 0) }, [slug])

  if (loading) return (
    <div className="cs-loading">
      <div className="cs-loading-inner">
        <div className="cs-skeleton cs-skeleton--title" />
        <div className="cs-skeleton cs-skeleton--hero" />
      </div>
    </div>
  )

  if (!project) return (
    <div className="cs-not-found">
      <h2>Project not found</h2>
      <button className="outline-btn" onClick={() => navigate('/')}>
        <span className="btn-text">← Back home</span>
      </button>
    </div>
  )

  return (
    <AnimatePresence>
      <motion.div className="cs" key={slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

        {/* Nav */}
        <nav className="cs-nav">
          <button className="cs-back" onClick={() => navigate('/')}>
            <span className="cs-back-arrow">←</span> Back
          </button>
          <span className="cs-nav-logo">L</span>
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noreferrer" className="cs-live-link">
              Live Preview ↗
            </a>
          )}
        </nav>

        {/* Hero */}
        <motion.header className="cs-hero" {...fade}>
          <div className="cs-hero-inner">
            <div className="cs-meta-row">
              {project.tags?.map(t => <span key={t} className="pc-tag">{t}</span>)}
            </div>
            <h1 className="cs-title">{project.title}</h1>
            <p className="cs-lead">{project.description}</p>

            <div className="cs-info-grid">
              {project.client   && <div className="cs-info-item"><span className="cs-info-label">Client</span><span>{project.client}</span></div>}
              {project.date     && <div className="cs-info-item"><span className="cs-info-label">Date</span><span>{project.date}</span></div>}
              {project.services && <div className="cs-info-item"><span className="cs-info-label">Services</span><span>{project.services}</span></div>}
            </div>
          </div>
        </motion.header>

        {/* Hero image */}
        {project.image && (
          <motion.div className="cs-cover"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.25,0.46,0.45,0.94] }}
          >
            <img src={project.image} alt={project.title} />
          </motion.div>
        )}

        <div className="cs-content">

          {/* Overview */}
          {project.overview && (
            <motion.section className="cs-section" {...fade} viewport={{ once: true }}>
              <p className="cs-section-label">Overview</p>
              <p className="cs-body-large">{project.overview}</p>
            </motion.section>
          )}

          <div className="cs-divider" />

          {/* Problem / Goal */}
          {project.problem && (
            <motion.section className="cs-section cs-section--two-col"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
            >
              <div className="cs-section-head">
                <p className="cs-section-label">Problem & Goal</p>
              </div>
              <p className="cs-body">{project.problem}</p>
            </motion.section>
          )}

          {/* Process steps */}
          {project.processSteps?.length > 0 && (
            <section className="cs-section">
              <p className="cs-section-label">Process</p>
              <div className="cs-process-grid">
                {project.processSteps.map((step, i) => (
                  <motion.div key={i} className="cs-process-card"
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                  >
                    <span className="cs-process-num">0{i + 1}</span>
                    <h3 className="cs-process-title">{step.title}</h3>
                    <p className="cs-process-body">{step.body}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Gallery */}
          {project.gallery?.length > 0 && (
            <section className="cs-section">
              <p className="cs-section-label">Gallery</p>
              <div className="cs-gallery">
                {project.gallery.map((img, i) => (
                  <motion.div key={i} className="cs-gallery-item"
                    initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}
                  >
                    <img src={img} alt={`${project.title} screenshot ${i + 1}`} />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Outcome */}
          {project.outcome && (
            <>
              <div className="cs-divider" />
              <motion.section className="cs-section cs-outcome"
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.7 }}
              >
                <p className="cs-section-label">Outcome</p>
                <p className="cs-body-large">{project.outcome}</p>
              </motion.section>
            </>
          )}

        </div>

        {/* Footer */}
        <footer className="cs-footer">
          <button className="outline-btn" onClick={() => navigate('/')}>
            <span className="btn-text">← Back to Portfolio</span>
          </button>
        </footer>

      </motion.div>
    </AnimatePresence>
  )
}
