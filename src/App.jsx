import { Routes, Route } from 'react-router-dom'
import { LangProvider } from './LangContext'
import { AnimatePresence } from 'framer-motion'
import './App.css'

// Pages
import MainSite  from './pages/MainSite'
import CaseStudy from './pages/CaseStudy'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <LangProvider>
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/"           element={<MainSite />} />
          <Route path="/project/:slug" element={<CaseStudy />} />
          <Route path="/admin"      element={<AdminPage />} />
        </Routes>
      </AnimatePresence>
    </LangProvider>
  )
}
