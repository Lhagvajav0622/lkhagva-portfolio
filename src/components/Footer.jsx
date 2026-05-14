import { useLang } from '../LangContext'
import './Footer.css'

export default function Footer() {
  const { t } = useLang()
  return (
    <footer className="footer">
      <div className="footer-inner">
        <span className="footer-logo">L</span>
        <nav className="footer-nav">
          {['about', 'contact', 'portfolio'].map(id => (
            <a key={id} href={`#${id}`} onClick={e => { e.preventDefault(); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }}>
              {id.charAt(0).toUpperCase() + id.slice(1)}
            </a>
          ))}
        </nav>
        <p className="footer-copy">{t.footer.copy}</p>
        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="footer-insta">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
        </a>
      </div>
    </footer>
  )
}
