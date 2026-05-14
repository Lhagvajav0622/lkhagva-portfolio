import { useLang } from '../LangContext'
import { useReveal, useRevealChildren } from '../hooks/useReveal'
import './Services.css'

const ICONS = ['✦', '◈', '⬡', '◎']

export default function Services() {
  const { t } = useLang()
  const s = t.services
  const [line1, line2] = s.title.split('\n')
  const headerRef = useReveal({ threshold: 0.1 })
  const cardsRef = useRevealChildren('[data-svc]', { threshold: 0.08 })

  return (
    <section id="services" className="section services">
      <div className="container">
        <div className="section-header centered reveal-fade-up" ref={headerRef}>
          <div className="section-pill">{s.label}</div>
          <h2 className="section-title-serif">{line1}<br />{line2}</h2>
          <p className="svc-sub">{s.sub}</p>
        </div>

        <div className="svc-grid" ref={cardsRef}>
          {s.items.map((item, i) => (
            <div
              className="svc-card"
              key={i}
              data-svc
              style={{ transitionDelay: `${i * 0.07}s` }}
            >
              <div className="svc-icon-wrap">
                <span className="svc-icon">{ICONS[i % ICONS.length]}</span>
              </div>
              <h3 className="svc-title">{item.title}</h3>
              <p className="svc-desc">{item.desc}</p>
              <ul className="svc-tags">
                {item.tags.map(tag => (
                  <li key={tag} className="svc-tag">{tag}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
