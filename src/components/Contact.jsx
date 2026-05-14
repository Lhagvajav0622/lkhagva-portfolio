import { useState } from 'react'
import { useLang } from '../LangContext'
import { useReveal } from '../hooks/useReveal'
import MagneticBtn from './MagneticBtn'
import './Contact.css'

export default function Contact() {
  const { t } = useLang()
  const c = t.contact
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [line1, line2] = c.title.split('\n')
  const cardRef = useReveal({ threshold: 0.08 })

  const onChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const onSubmit = e => {
    e.preventDefault()
    window.location.href = `mailto:Lhagvajavproo@gmail.com?subject=Project from ${form.name}&body=${encodeURIComponent(form.message + '\n\nFrom: ' + form.email)}`
    setSent(true)
  }

  return (
    <section id="contact" className="section contact">
      <div className="container">
        <div className="contact-card reveal-fade-up" ref={cardRef}>
          <div className="section-header centered">
            <div className="section-pill">{c.label}</div>
            <h2 className="section-title-serif">{line1}<br />{line2}</h2>
          </div>

          {sent ? (
            <p className="contact-success">{c.success}</p>
          ) : (
            <form className="contact-form" onSubmit={onSubmit}>
              <div className="form-row">
                <div className="form-field">
                  <label>{c.name}</label>
                  <input name="name" type="text" placeholder={c.namePh + ' *'} value={form.name} onChange={onChange} required />
                </div>
                <div className="form-field">
                  <label>{c.email}</label>
                  <input name="email" type="email" placeholder={c.emailPh + ' *'} value={form.email} onChange={onChange} required />
                </div>
              </div>
              <div className="form-field">
                <label>{c.msg}</label>
                <textarea name="message" rows={5} placeholder={c.msgPh + ' *'} value={form.message} onChange={onChange} required />
              </div>
              <div className="form-submit">
                <MagneticBtn className="outline-btn" onClick={onSubmit}>
                  <span className="btn-text">{c.submit}</span>
                  <span className="btn-arrow">↗</span>
                </MagneticBtn>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
