import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useLang } from '../LangContext'
import './Navbar.css'

const NAV_IDS = ['home', 'services', 'portfolio', 'about', 'process', 'pricing', 'contact']

export default function Navbar() {
  const { t, lang, setLang } = useLang()
  const location = useLocation()
  const navigate = useNavigate()
  const isHome = location.pathname === '/' || location.pathname === ''
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

  // Scroll shadow + active section tracking.
  // The active section is the last one whose top has passed the line just
  // below the navbar; at the very bottom of the page the last section wins,
  // since a short final section can never reach that line.
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20)
      if (!isHome) { setActive(null); return }

      const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4
      const sections = NAV_IDS
        .map(id => document.getElementById(id))
        .filter(Boolean)
        .sort((a, b) => a.getBoundingClientRect().top - b.getBoundingClientRect().top)

      if (atBottom && sections.length) { setActive(sections[sections.length - 1].id); return }

      const line = window.innerHeight * 0.35
      let current = 'home'
      for (const el of sections) {
        if (el.getBoundingClientRect().top <= line) current = el.id
      }
      setActive(current)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [isHome])

  // Move indicator underline to the active link. Re-measure when the
  // language changes (labels change width), on resize and once fonts load.
  useEffect(() => {
    const place = () => {
      const indicator = indicatorRef.current
      const activeEl = active && linksRef.current[active]
      if (!indicator) return
      if (!activeEl) { indicator.style.width = '0px'; return }
      const rect = activeEl.getBoundingClientRect()
      const parentRect = activeEl.closest('.nav-links').getBoundingClientRect()
      indicator.style.left = `${rect.left - parentRect.left}px`
      indicator.style.width = `${rect.width}px`
    }
    place()
    document.fonts?.ready.then(place)
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [active, lang])

  const scrollTo = (e, id) => {
    e.preventDefault()
    setMenuOpen(false)
    if (!isHome) {
      navigate('/')
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 120)
      return
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  const navItems = [
    { id: 'home', label: t.nav.home },
    { id: 'services', label: t.nav.services },
    { id: 'portfolio', label: t.nav.portfolio },
    { id: 'about', label: t.nav.about },
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
          <a href="https://www.instagram.com/elizyyyyyy/" target="_blank" rel="noreferrer" className="insta-btn">
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
