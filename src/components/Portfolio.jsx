import './Portfolio.css'

const projects = [
  {
    title: 'Giingoo – Mongolian Horse Race Watching App',
    desc: 'Mobile app concept for racing enthusiasts. A sleek, native experience for following Mongolian horse racing events live.',
    tags: ['UI/UX Design', 'Mobile', 'Concept'],
    color: '#ff6b35',
  },
  {
    title: 'Artisy Hub Mobile App',
    desc: 'Creative collaboration platform developed at IO Tech. Built the front-end using Flutter — implemented nearly all core screens with smooth performance.',
    tags: ['Flutter', 'Frontend Dev', 'IO Tech'],
    color: '#6c63ff',
  },
  {
    title: 'Soundly – Music Dating App',
    desc: 'Music-driven dating app concept that matches people based on their favorite songs, playlists, and artists.',
    tags: ['UI/UX Design', 'Mobile', 'Concept'],
    color: '#00d4aa',
  },
]

export default function Portfolio() {
  return (
    <section id="portfolio" className="section portfolio">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Works</p>
          <h2 className="section-title">My Works</h2>
          <p className="section-sub">Check out some of my awesome projects with creative ideas.</p>
        </div>
        <div className="projects-grid">
          {projects.map((p, i) => (
            <div className="project-card" key={i}>
              <div className="project-thumb" style={{ '--c': p.color }}>
                <div className="project-thumb-inner">
                  <span className="project-num">0{i + 1}</span>
                </div>
              </div>
              <div className="project-info">
                <div className="project-tags">
                  {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>
                <h3 className="project-title">{p.title}</h3>
                <p className="project-desc">{p.desc}</p>
                <button className="project-cta">View Case Study →</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
