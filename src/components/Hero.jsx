import './Hero.css'

export default function Hero() {
  return (
    <section id="home" className="hero">
      <div className="hero-inner">
        <div className="hero-text">
          <p className="hero-eyebrow">UI/UX Designer & Flutter Developer</p>
          <h1 className="hero-title">
            I'm <span className="accent">Lkhagvajav</span>,<br />a UI/UX designer.
          </h1>
          <p className="hero-sub">
            Creating meaningful digital experiences through thoughtful design and user-centered thinking.
          </p>
          <div className="hero-actions">
            <a href="#portfolio" className="btn-primary" onClick={e => {
              e.preventDefault()
              document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' })
            }}>See My Works</a>
            <a href="#contact" className="btn-ghost" onClick={e => {
              e.preventDefault()
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
            }}>Get in Touch</a>
          </div>
        </div>
        <div className="hero-img-wrap">
          <div className="hero-img-ring">
            <div className="hero-img-placeholder">
              <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="60" cy="45" r="22" fill="#6c63ff" opacity="0.3"/>
                <ellipse cx="60" cy="95" rx="35" ry="22" fill="#6c63ff" opacity="0.3"/>
                <circle cx="60" cy="45" r="20" fill="#a78bfa" opacity="0.5"/>
                <text x="60" y="51" textAnchor="middle" fill="white" fontSize="18" fontWeight="700">L</text>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div className="hero-scroll-hint">
        <div className="scroll-line" />
      </div>
    </section>
  )
}
