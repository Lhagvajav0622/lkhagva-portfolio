import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AdminLogin, { useAdminAuth } from '../components/admin/AdminLogin'
import ProjectList from '../components/admin/ProjectList'
import ProjectForm from '../components/admin/ProjectForm'
import { useAdminProjects } from '../hooks/useProjects'
import './AdminPage.css'

export default function AdminPage() {
  const { authed, login, logout } = useAdminAuth()
  const { projects, loading, refresh } = useAdminProjects()
  const [view, setView]   = useState('list')   // 'list' | 'form'
  const [editing, setEditing] = useState(null)

  if (!authed) return <AdminLogin onLogin={login} />

  const openEdit = project => { setEditing(project); setView('form') }
  const openAdd  = ()      => { setEditing(null);    setView('form') }
  const closeForm = ()     => { setEditing(null);    setView('list'); refresh() }

  const published = projects.filter(p => p.status === 'published').length
  const drafts    = projects.filter(p => p.status === 'draft').length

  return (
    <div className="ap">
      {/* Sidebar */}
      <aside className="ap-sidebar">
        <div className="ap-logo">L</div>
        <nav className="ap-nav">
          <button
            className={`ap-nav-item${view === 'list' ? ' active' : ''}`}
            onClick={() => { setView('list'); setEditing(null) }}
          >
            <span className="ap-nav-icon">◫</span> Projects
          </button>
        </nav>
        <div className="ap-sidebar-footer">
          <a href="/#" className="ap-view-site">View site ↗</a>
          <button className="ap-logout" onClick={logout}>Sign out</button>
        </div>
      </aside>

      {/* Main */}
      <main className="ap-main">
        {/* Top bar */}
        <header className="ap-topbar">
          <div className="ap-breadcrumb">
            <span onClick={() => closeForm()} className={view === 'form' ? 'ap-bc-link' : ''}>Projects</span>
            {view === 'form' && <><span className="ap-bc-sep">›</span><span>{editing ? 'Edit' : 'New'}</span></>}
          </div>
          <div className="ap-stats">
            <span className="ap-stat"><span className="ap-stat-dot ap-stat-dot--pub" />{published} published</span>
            <span className="ap-stat"><span className="ap-stat-dot ap-stat-dot--draft" />{drafts} drafts</span>
          </div>
        </header>

        {/* Content */}
        <div className="ap-content">
          <AnimatePresence mode="wait">
            {view === 'list' ? (
              <motion.div key="list"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
              >
                {loading
                  ? <div className="ap-loading">Loading projects…</div>
                  : <ProjectList projects={projects} onEdit={openEdit} onAdd={openAdd} onChange={refresh} />
                }
              </motion.div>
            ) : (
              <motion.div key="form"
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
              >
                <ProjectForm project={editing} onDone={closeForm} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}
