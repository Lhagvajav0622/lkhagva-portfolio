import { useLang } from '../LangContext'
import { useReveal, useRevealChildren } from '../hooks/useReveal'
import MagneticBtn from './MagneticBtn'
import './Pricing.css'

export default function Pricing() {
  const { t } = useLang()
  const p = t.pricing
  const [line1, line2] = p.title.split('\n')
  const headerRef = useReveal({ threshold: 0.1 })
  const cardsRef = useRevealChildren('[data-plan]', { threshold: 0.08 })

  return (
    <section id="pricing" className="section pricing">
      <div className="container">
        <div className="section-header centered reveal-fade-up" ref={headerRef}>
          <div className="section-pill">{p.label}</div>
          <h2 className="section-title-serif">{line1}<br />{line2}</h2>
          <p className="pricing-sub">{p.sub}</p>
        </div>

        <div className="plans-grid" ref={cardsRef}>
          {p.plans.map((plan, i) => (
            <div
              className={`plan-card${plan.featured ? ' plan-featured' : ''}`}
              key={i}
              data-plan
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              {plan.featured && <div className="plan-badge">{p.popular}</div>}
              <div className="plan-top">
                <h3 className="plan-name">{plan.name}</h3>
                <p className="plan-tagline">{plan.tagline}</p>
              </div>
              <div className={`plan-price${plan.priceText ? ' plan-price--text' : ''}`}>
                <span className="plan-currency">{plan.currency || '$'}</span>
                {plan.priceText
                  ? <span className="plan-amount-text">{plan.priceText}</span>
                  : <span className="plan-amount">{plan.price}</span>}
                <span className="plan-period">/{p.per}</span>
              </div>
              <ul className="plan-features">
                {plan.features.map((f, fi) => (
                  <li key={fi} className="plan-feature">
                    <span className="plan-check">✓</span>
                    {f}
                  </li>
                ))}
              </ul>
              <MagneticBtn className={`plan-cta${plan.featured ? ' plan-cta--filled' : ''}`}>
                <span className="btn-text">{p.cta}</span>
                <span className="btn-arrow">↗</span>
              </MagneticBtn>
            </div>
          ))}
        </div>

        <p className="pricing-note">{p.note}</p>
      </div>
    </section>
  )
}
