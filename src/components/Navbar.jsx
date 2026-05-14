import { useState, useEffect, useRef } from 'react'
import { useLang } from '../LangContext'
import './Navbar.css'

const NAV_IDS = ['home', 'services', 'portfolio', 'about', 'process', 'pricing', 'contact']

export default function Navbar() {
  const { t, lang, setLang } = useLang()
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('home')
  const [visible, setVisible] = useState(false)
  const indicatorRef = useRef(null)
  const linksRef = useRef({})

  // Entrance animation
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Scroll shadow + active section tracking
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      for (let i = NAV_IDS.length - 1; i >= 0; i--) {
        const el = document.getElementById(NAV_IDS[i])
        if (el && el.getBoundingClientRect().top <= 100) {
          setActive(NAV_IDS[i])
          return
        }
      }
      setActive('home')
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Move indicator underline to active link
  useEffect(() => {
    const activeEl = linksRef.current[active]
    const indicator = indicatorRef.current
    if (!activeEl || !indicator) return
    const rect = activeEl.getBoundingClientRect()
    const parentRect = activeEl.closest('.nav-links').getBoundingClientRect()
    indicator.style.left = `${rect.left - parentRect.left}px`
    indicator.style.width = `${rect.width}px`
  }, [active])

  const scrollTo = (e, id) => {
    e.preventDefault()
    setMenuOpen(false)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'services', label: t.nav.services },
    { id: 'about', label: t.nav.about },
    { id: 'portfolio', label: t.nav.portfolio },
    { id: 'process', label: t.nav.process },
    { id: 'pricing', label: t.nav.pricing },
    { id: 'contact', label: t.nav.contact },
  ]

  return (
    <nav className={`navbar${scrolled ? ' scrolled' : ''}${visible ? ' visible' : ''}`}>
      <div className="nav-inner">
        <a className="nav-logo" href="#home" onClick={e => scrollTo(e, 'home')}>L</a>

        <ul className={`nav-links${menuOpen ? ' open' : ''}`}>
          {navItems.map(item => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={active === item.id ? 'active' : ''}
                ref={el => linksRef.current[item.id] = el}
                onClick={e => scrollTo(e, item.id)}
              >
                {item.label}
              </a>
            </li>
          ))}
          <div className="nav-indicator" ref={indicatorRef} />
        </ul>

        <div className="nav-right">
          <button className="lang-btn" onClick={() => setLang(l => l === 'en' ? 'mn' : 'en')}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
            {lang === 'en' ? 'English' : 'Монгол'}
          </button>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="insta-btn">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          <button className="hamburger" onClick={() => setMenuOpen(o => !o)}>
            <span className={menuOpen ? 'open' : ''} /><span className={menuOpen ? 'open' : ''} /><span className={menuOpen ? 'open' : ''} />
          </button>
        </div>
      </div>
    </nav>
  )
}
