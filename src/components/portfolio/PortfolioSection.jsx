import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useLang } from '../../LangContext'
import { useProjects } from '../../hooks/useProjects'
import ProjectCard from './ProjectCard'
import './PortfolioSection.css'

export default function PortfolioSection() {
  const { t } = useLang()
  const { projects, loading } = useProjects()
  const navigate = useNavigate()

  const featured  = projects.filter(p => p.layout === 'featured')
  const standards = projects.filter(p => p.layout === 'standard' || !p.layout)
  const compacts  = projects.filter(p => p.layout === 'compact')

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

            {/* Compact list */}
            {compacts.length > 0 && (
              <div className="ps-compact-section">
                <motion.p
                  className="ps-compact-label"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  More projects
                </motion.p>
                <div className="ps-compact-list">
                  {compacts.map((p, i) => (
                    <ProjectCard key={p.id} project={p} delay={i * 0.08} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* See all */}
        <motion.div
          className="ps-footer"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <button
            className="outline-btn"
            onClick={() => navigate('/projects')}
          >
            <span className="btn-text">{t.portfolio.seeAll}</span>
            <span className="btn-arrow">↗</span>
          </button>
        </motion.div>
      </div>
    </section>
  )
}
