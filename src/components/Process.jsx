import './Process.css'

const steps = [
  {
    num: '01',
    title: 'Research & Ideation',
    desc: 'Start by understanding your brand, audience, and goals — gathering insights and sparking ideas that will shape the foundation of the design.',
    icon: '🔍',
  },
  {
    num: '02',
    title: 'Concept Development',
    desc: 'Translate research into early concepts. Sketch layouts, explore visual directions, and define the structure of the product.',
    icon: '💡',
  },
  {
    num: '03',
    title: 'Prototyping & Testing',
    desc: 'Build interactive prototypes and validate ideas through user testing. Iterate based on feedback to refine the experience.',
    icon: '🧪',
  },
  {
    num: '04',
    title: 'Finalize Product',
    desc: 'Polish every detail — from pixel-perfect UI to handoff-ready design files — and deliver a product ready for development.',
    icon: '🚀',
  },
]

const tools = ['Figma', 'Framer', 'Spotify', 'ChatGPT', 'Notion']

export default function Process() {
  return (
    <section id="process" className="section process">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Process</p>
          <h2 className="section-title">My workflow is centered around<br />being highly productive.</h2>
        </div>
        <div className="steps-grid">
          {steps.map(s => (
            <div className="step-card" key={s.num}>
              <span className="step-num">{s.num}</span>
              <div className="step-icon">{s.icon}</div>
              <h3 className="step-title">{s.title}</h3>
              <p className="step-desc">{s.desc}</p>
            </div>
          ))}
        </div>
        <div className="tools-row">
          <p className="tools-label">Tools that power my every day:</p>
          <div className="tools-list">
            {tools.map(t => (
              <span className="tool-chip" key={t}>{t}</span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
