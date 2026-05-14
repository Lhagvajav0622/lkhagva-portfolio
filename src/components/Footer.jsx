import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p className="footer-name">Lkhagva.</p>
        <p className="footer-copy">© {new Date().getFullYear()} Lkhagvajav. UI/UX Designer & Flutter Developer — Ulaanbaatar, Mongolia.</p>
      </div>
    </footer>
  )
}
