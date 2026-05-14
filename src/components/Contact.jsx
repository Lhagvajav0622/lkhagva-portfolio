import { useState } from 'react'
import './Contact.css'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    window.location.href = `mailto:Lhagvajavproo@gmail.com?subject=Project Inquiry from ${form.name}&body=${encodeURIComponent(form.message + '\n\nFrom: ' + form.email)}`
    setSent(true)
  }

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="section-header">
          <p className="section-label">Contact</p>
          <h2 className="section-title">Got a project in mind?<br />Let's get in touch.</h2>
        </div>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <div>
                <p className="contact-item-label">Email</p>
                <a href="mailto:Lhagvajavproo@gmail.com" className="contact-item-val">Lhagvajavproo@gmail.com</a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <p className="contact-item-label">Phone</p>
                <a href="tel:+97689212206" className="contact-item-val">+976 8921 2206</a>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">📍</span>
              <div>
                <p className="contact-item-label">Location</p>
                <p className="contact-item-val">Ulaanbaatar, Mongolia</p>
              </div>
            </div>
          </div>
          <form className="contact-form" onSubmit={handleSubmit}>
            {sent ? (
              <div className="form-success">
                <span>🎉</span>
                <p>Opening your email client… Thanks for reaching out!</p>
              </div>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Name</label>
                    <input id="name" name="name" type="text" placeholder="Your name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input id="email" name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Message</label>
                  <textarea id="message" name="message" rows={5} placeholder="Tell me about your project…" value={form.message} onChange={handleChange} required />
                </div>
                <button type="submit" className="btn-primary">Send Message →</button>
              </>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
