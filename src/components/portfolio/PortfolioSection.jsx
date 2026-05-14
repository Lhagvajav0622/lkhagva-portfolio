import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../../LangContext'
import { useProjects } from '../../hooks/useProjects'
import ProjectCard from './ProjectCard'
import './PortfolioSection.css'

const INITIAL_STANDARDS = 4

export default function PortfolioSection() {
  const { t } = useLang()
  const { projects, loading } = useProjects()
  const [expanded, setExpanded] = useState(false)

  const featured     = projects.filter(p => p.layout === 'featured')
  const allStandards = projects.filter(p => p.layout === 'standard' || !p.layout)
  const compacts     = projects.filter(p => p.layout === 'compact')

  const hasMore   = allStandards.length > INITIAL_STANDARDS || compacts.length > 0
  const standards = expanded ? allStandards : allStandards.slice(0, INITIAL_STANDARDS)

  return (
    <section id="portfolio" className="section portfolio-section">
      <div className="container">
        {/* Header */}
        <motion.div
          className="section-header centered"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <div className="section-pill">{t.portfolio.label}</div>
          <h2 className="section-title-serif">
            {t.portfolio.title.split('\n').map((l, i) => (
              <span key={i}>{l}{i === 0 && <br />}</span>
            ))}
          </h2>
        </motion.div>

        {loading ? (
          <div className="ps-loading">
            {[0,1,2].map(i => <div key={i} className="ps-skeleton" />)}
          </div>
        ) : (
          <div className="ps-layout">
            {/* Featured row */}
            {featured.length > 0 && (
              <div className="ps-featured-row">
                {featured.map(p => <ProjectCard key={p.id} project={p} />)}
              </div>
            )}

            {/* Standard grid */}
            {standards.length > 0 && (
              <div className="ps-standard-grid">
                {standards.map((p, i) => (
                  <ProjectCard key={p.id} project={p} delay={i * 0.1} />
                ))}
              </div>
            )}

            {/* Expanded reveal: extra standards + compacts */}
            <AnimatePresence initial={false}>
              {expanded && (
                <motion.div
                  key="expanded"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="ps-layout">
                    {compacts.length > 0 && (
                      <div className="ps-compact-section">
                        <p className="ps-compact-label">More projects</p>
                        <div className="ps-compact-list">
                          {compacts.map((p, i) => (
                            <ProjectCard key={p.id} project={p} delay={i * 0.08} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* See all / Show less */}
        {hasMore && (
          <motion.div
            className="ps-footer"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <button
              className="outline-btn"
              onClick={() => setExpanded(e => !e)}
            >
              <span className="btn-text">{expanded ? 'Show less' : t.portfolio.seeAll}</span>
              <span className="btn-arrow">{expanded ? '↑' : '↓'}</span>
            </button>
          </motion.div>
        )}
      </div>
    </section>
  )
}
