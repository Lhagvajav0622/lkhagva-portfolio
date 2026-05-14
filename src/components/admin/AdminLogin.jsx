import { useState } from 'react'
import './AdminLogin.css'

// Set VITE_ADMIN_PASSWORD in .env.local
const ADMIN_PASS = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'
const KEY = 'lkhagva_admin_auth'

export function useAdminAuth() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(KEY) === '1')
  const login  = p => { if (p === ADMIN_PASS) { sessionStorage.setItem(KEY, '1'); setAuthed(true); return true } return false }
  const logout = ()  => { sessionStorage.removeItem(KEY); setAuthed(false) }
  return { authed, login, logout }
}

export default function AdminLogin({ onLogin }) {
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState(false)
  const [shaking,  setShaking]  = useState(false)

  const submit = e => {
    e.preventDefault()
    if (onLogin(password)) return
    setError(true); setShaking(true)
    setTimeout(() => setShaking(false), 500)
  }

  return (
    <div className="al-wrap">
      <div className={`al-card${shaking ? ' shake' : ''}`}>
        <div className="al-logo">L</div>
        <h1 className="al-title">Admin Panel</h1>
        <p className="al-sub">Enter your password to continue</p>
        <form onSubmit={submit} className="al-form">
          <input
            type="password"
            className={`al-input${error ? ' al-input--error' : ''}`}
            placeholder="Password"
            value={password}
            onChange={e => { setPassword(e.target.value); setError(false) }}
            autoFocus
          />
          {error && <p className="al-error">Incorrect password</p>}
          <button type="submit" className="al-btn">Enter →</button>
        </form>
      </div>
    </div>
  )
}
