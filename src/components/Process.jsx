import { useLang } from '../LangContext'
import { useReveal, useRevealChildren } from '../hooks/useReveal'
import './Process.css'

const colors = ['#00c853', '#7c4dff', '#ff5252', '#ff9100']
const icons = ['🔍', '💡', '🧪', '🚀']
const tools = ['Figma', 'Framer', 'Spotify', 'Chat GPT', 'Notion']

export default function Process() {
  const { t } = useLang()
  const p = t.process
  const [line1, line2] = p.title.split('\n')
  const headerRef = useReveal({ threshold: 0.1 })
  const cardsRef = useRevealChildren('[data-card]', { threshold: 0.1 })
  const toolsRef = useReveal({ threshold: 0.1 })

  return (
    <section id="process" className="section process">
      <div className="container">
        <div className="section-header centered reveal-fade-up" ref={headerRef}>
          <div className="section-pill">{p.label}</div>
          <h2 className="section-title-serif">{line1}<br />{line2}</h2>
        </div>

        <div className="process-grid" ref={cardsRef}>
          {p.steps.map((step, i) => (
            <div
              className="process-card"
              key={i}
              data-card
              style={{ '--card-color': colors[i], transitionDelay: `${i * 0.08}s` }}
            >
              <div className="process-card-top">
                <span className="process-icon">{icons[i]}</span>
                <span className="process-num">0{i + 1}.</span>
              </div>
              <h3 className="process-title">{step.title}</h3>
              <p className="process-desc">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="tools-row reveal-fade-up" ref={toolsRef} style={{ transitionDelay: '0.2s' }}>
          <span className="tools-label">{p.tools}</span>
          <div className="tools-list">
            {tools.map((tool, i) => (
              <span key={tool} className="tool-item">
                <span className="tool-name">{tool}</span>
                {i < tools.length - 1 && <span className="tool-sep">+</span>}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
