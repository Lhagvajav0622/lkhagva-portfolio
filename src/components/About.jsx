import './About.css'

const experience = [
  {
    period: 'JUN 2024 – SEP 2024',
    role: 'Flutter Front-End Developer',
    place: 'IO Tech — Artisy Hub',
    desc: 'Worked on the front-end of the Artisy Hub mobile application using Flutter. Implemented nearly all core screens, focusing on functionality, responsiveness, and smooth performance.',
  },
  {
    period: 'JAN 2024 – PRESENT',
    role: 'Google UX Design Certificate',
    place: 'Coursera',
    desc: "Completed Google's UX Design Professional Certificate, gaining practical training in design thinking, wireframing, prototyping, and user-centered design practices.",
  },
  {
    period: 'MAY 2025 – PRESENT',
    role: 'UI/UX Design Student',
    place: 'UFE Tech',
    desc: 'Pursuing a degree in UI/UX design. Building skills in user research, prototyping, and product design while applying knowledge to real-world projects.',
  },
]

const skills = [
  { name: 'Figma', pct: 90 },
  { name: 'Framer', pct: 70 },
  { name: 'Flutter', pct: 65 },
  { name: 'User Research', pct: 80 },
]

export default function About() {
  return (
    <section id="about" className="section about">
      <div className="container">
        <div className="section-header">
          <p className="section-label">About</p>
          <h2 className="section-title">More about me</h2>
        </div>
        <div className="about-grid">
          <div className="about-left">
            <p className="about-bio">
              I'm <strong>Lkhagvajav</strong>, a UI/UX design student at UFE Tech and a certified Google UX Designer (Coursera).
              I'm passionate about creating designs that not only look good but also feel natural to use.
            </p>
            <p className="about-bio">
              With experience in freelance app design and Flutter development at IO Tech, I bring both design
              sensibility and technical awareness to every project.
            </p>
            <div className="stats-row">
              <div className="stat">
                <span className="stat-num">1+</span>
                <span className="stat-label">Years Experience</span>
              </div>
              <div className="stat">
                <span className="stat-num">3+</span>
                <span className="stat-label">Projects Done</span>
              </div>
              <div className="stat">
                <span className="stat-num">50+</span>
                <span className="stat-label">Happy Clients</span>
              </div>
            </div>
            <div className="skills-list">
              {skills.map(s => (
                <div className="skill-row" key={s.name}>
                  <div className="skill-top">
                    <span>{s.name}</span>
                    <span>{s.pct}%</span>
                  </div>
                  <div className="skill-bar">
                    <div className="skill-fill" style={{ width: `${s.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="about-right">
            <div className="timeline">
              {experience.map((e, i) => (
                <div className="timeline-item" key={i}>
                  <div className="timeline-dot" />
                  <div className="timeline-content">
                    <span className="timeline-period">{e.period}</span>
                    <h4 className="timeline-role">{e.role}</h4>
                    <p className="timeline-place">{e.place}</p>
                    <p className="timeline-desc">{e.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
