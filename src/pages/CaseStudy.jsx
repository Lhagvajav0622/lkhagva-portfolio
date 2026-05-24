import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore/lite'
import { db } from '../firebase'
import { useLang } from '../LangContext'
import Navbar from '../components/Navbar'
import './CaseStudy.css'

// Return MN field if lang is mn and field exists, else EN fallback
const pick = (project, key, lang) => {
  if (lang === 'mn' && project[`${key}_mn`]) return project[`${key}_mn`]
  return project[key]
}

const fade = { initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.7, ease: [0.25,0.46,0.45,0.94] } }

async function fetchProject(slug) {
  const q = query(collection(db, 'projects'), where('slug', '==', slug))
  const snap = await getDocs(q)
  if (!snap.empty) return { id: snap.docs[0].id, ...snap.docs[0].data() }

  const docSnap = await getDoc(doc(db, 'projects', slug))
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
}

export default function CaseStudy() {
  const { slug } = useParams()
  const navigate  = useNavigate()
  const { lang } = useLang()
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
      <h2>{lang === 'mn' ? 'Төсөл олдсонгүй' : 'Project not found'}</h2>
      <button className="outline-btn" onClick={() => navigate('/')}>
        <span className="btn-text">{lang === 'mn' ? '← Нүүр хуудас' : '← Back home'}</span>
      </button>
    </div>
  )

  // Labels switch with language
  const L = lang === 'mn'
    ? { back: 'Буцах', live: 'Live Preview ↗', client: 'Захиалагч', date: 'Огноо', services: 'Үйлчилгээ',
        overview: 'Танилцуулга', problem: 'Зорилго & Шийдвэр', process: 'Процесс', gallery: 'Галерей',
        outcome: 'Үр дүн', notFound: 'Төсөл олдсонгүй', backHome: '← Нүүр хуудас', backPortfolio: '← Бүтээлүүд рүү буцах', screenshot: 'дэлгэцийн зураг' }
    : { back: 'Back', live: 'Live Preview ↗', client: 'Client', date: 'Date', services: 'Services',
        overview: 'Overview', problem: 'Problem & Goal', process: 'Process', gallery: 'Gallery',
        outcome: 'Outcome', notFound: 'Project not found', backHome: '← Back home', backPortfolio: '← Back to Portfolio', screenshot: 'screenshot' }

  return (
    <AnimatePresence>
      <motion.div className="cs" key={slug} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>

        {/* Main site Navbar for consistency */}
        <Navbar />

        {/* Hero */}
        <motion.header className="cs-hero" {...fade}>
          <div className="cs-hero-inner">
            <button className="cs-back" onClick={() => navigate('/')}>
              <span className="cs-back-arrow">←</span> {L.back}
            </button>
            <div className="cs-meta-row">
              {project.tags?.map(t => <span key={t} className="pc-tag">{t}</span>)}
            </div>
            <h1 className="cs-title">{pick(project, 'title', lang)}</h1>
            <p className="cs-lead">{pick(project, 'description', lang)}</p>

            <div className="cs-info-grid">
              {project.client   && <div className="cs-info-item"><span className="cs-info-label">{L.client}</span><span>{project.client}</span></div>}
              {project.date     && <div className="cs-info-item"><span className="cs-info-label">{L.date}</span><span>{project.date}</span></div>}
              {project.services && <div className="cs-info-item"><span className="cs-info-label">{L.services}</span><span>{project.services}</span></div>}
              {project.liveUrl  && <div className="cs-info-item"><a href={project.liveUrl} target="_blank" rel="noreferrer" className="cs-live-link">{L.live}</a></div>}
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
          {pick(project, 'overview', lang) && (
            <motion.section className="cs-section" {...fade} viewport={{ once: true }}>
              <p className="cs-section-label">{L.overview}</p>
              <p className="cs-body-large">{pick(project, 'overview', lang)}</p>
            </motion.section>
          )}

          <div className="cs-divider" />

          {/* Problem / Goal */}
          {pick(project, 'problem', lang) && (
            <motion.section className="cs-section cs-section--two-col"
              initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.7 }}
            >
              <div className="cs-section-head">
                <p className="cs-section-label">{L.problem}</p>
              </div>
              <p className="cs-body">{pick(project, 'problem', lang)}</p>
            </motion.section>
          )}

          {/* Process steps */}
          {project.processSteps?.length > 0 && (
            <section className="cs-section">
              <p className="cs-section-label">{L.process}</p>
              <div className="cs-process-grid">
                {project.processSteps.map((step, i) => (
                  <motion.div key={i} className="cs-process-card"
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                  >
                    <span className="cs-process-num">0{i + 1}</span>
                    <h3 className="cs-process-title">{lang === 'mn' && step.title_mn ? step.title_mn : step.title}</h3>
                    <p className="cs-process-body">{lang === 'mn' && step.body_mn ? step.body_mn : step.body}</p>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Gallery */}
          {project.gallery?.length > 0 && (
            <section className="cs-section">
              <p className="cs-section-label">{L.gallery}</p>
              <div className="cs-gallery">
                {project.gallery.map((img, i) => (
                  <motion.div key={i} className="cs-gallery-item"
                    initial={{ opacity: 0, scale: 0.97 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}
                  >
                    <img src={img} alt={`${project.title} ${L.screenshot} ${i + 1}`} />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Outcome */}
          {pick(project, 'outcome', lang) && (
            <>
              <div className="cs-divider" />
              <motion.section className="cs-section cs-outcome"
                initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.7 }}
              >
                <p className="cs-section-label">{L.outcome}</p>
                <p className="cs-body-large">{pick(project, 'outcome', lang)}</p>
              </motion.section>
            </>
          )}

        </div>

        {/* Footer */}
        <footer className="cs-footer">
          <button className="outline-btn" onClick={() => navigate('/')}>
            <span className="btn-text">{L.backPortfolio}</span>
          </button>
        </footer>

      </motion.div>
    </AnimatePresence>
  )
}
