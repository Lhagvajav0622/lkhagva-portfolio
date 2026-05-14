import { useState, useRef } from 'react'
import { addProject, updateProject, uploadProjectImage } from '../../hooks/useProjects'
import './ProjectForm.css'

const EMPTY = {
  title: '', description: '', tags: '', image: '', color: '#6c63ff',
  layout: 'standard', featured: false, status: 'draft', slug: '',
  client: '', date: '', services: '', liveUrl: '',
  overview: '', problem: '', outcome: '',
  processSteps: [{ title: '', body: '' }],
  gallery: [],
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export default function ProjectForm({ project, onDone }) {
  const isEdit = !!project?.id
  const [form, setForm]       = useState(() => ({
    ...EMPTY,
    ...project,
    tags: Array.isArray(project?.tags) ? project.tags.join(', ') : (project?.tags || ''),
    gallery: project?.gallery || [],
    processSteps: project?.processSteps?.length ? project.processSteps : [{ title: '', body: '' }],
  }))
  const [saving, setSaving]   = useState(false)
  const [imgPct, setImgPct]   = useState(null)
  const fileRef = useRef(null)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleImage = async e => {
    const file = e.target.files?.[0]
    if (!file) return
    setImgPct(0)
    try {
      const url = await uploadProjectImage(file, setImgPct)
      set('image', url)
    } catch { alert('Image upload failed — check Firebase Storage rules.') }
    setImgPct(null)
  }

  const addStep    = () => set('processSteps', [...form.processSteps, { title: '', body: '' }])
  const removeStep = i  => set('processSteps', form.processSteps.filter((_, j) => j !== i))
  const updateStep = (i, k, v) => {
    const steps = [...form.processSteps]
    steps[i] = { ...steps[i], [k]: v }
    set('processSteps', steps)
  }

  const handleSubmit = async e => {
    e.preventDefault()
    setSaving(true)
    const data = {
      ...form,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      slug: form.slug || slugify(form.title),
      order: isEdit ? (project.order ?? 99) : 99,
    }
    try {
      if (isEdit) await updateProject(project.id, data)
      else        await addProject(data)
      onDone()
    } catch (err) { alert('Save failed: ' + err.message) }
    setSaving(false)
  }

  return (
    <form className="pf" onSubmit={handleSubmit}>
      <div className="pf-header">
        <div>
          <h2 className="pf-title">{isEdit ? 'Edit Project' : 'New Project'}</h2>
          <p className="pf-sub">Fill in the details below</p>
        </div>
        <div className="pf-header-actions">
          <button type="button" className="admin-btn admin-btn--secondary" onClick={onDone}>Cancel</button>
          <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
            {saving ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create Project')}
          </button>
        </div>
      </div>

      <div className="pf-body">

        {/* ── Section: Basic info ── */}
        <div className="pf-section">
          <h3 className="pf-section-title">Basic Info</h3>
          <div className="pf-grid-2">
            <div className="pf-field pf-field--full">
              <label>Title *</label>
              <input value={form.title} onChange={e => { set('title', e.target.value); if (!isEdit) set('slug', slugify(e.target.value)) }} required placeholder="Project title" />
            </div>
            <div className="pf-field pf-field--full">
              <label>Short Description *</label>
              <textarea rows={3} value={form.description} onChange={e => set('description', e.target.value)} required placeholder="Brief description shown on the card" />
            </div>
            <div className="pf-field">
              <label>Tags (comma separated)</label>
              <input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="UI/UX Design, Mobile, Flutter" />
            </div>
            <div className="pf-field">
              <label>URL Slug</label>
              <input value={form.slug} onChange={e => set('slug', e.target.value)} placeholder="auto-generated from title" />
            </div>
          </div>
        </div>

        {/* ── Section: Appearance ── */}
        <div className="pf-section">
          <h3 className="pf-section-title">Appearance</h3>
          <div className="pf-grid-3">
            <div className="pf-field">
              <label>Layout</label>
              <select value={form.layout} onChange={e => set('layout', e.target.value)}>
                <option value="featured">Featured (large horizontal)</option>
                <option value="standard">Standard (grid card)</option>
                <option value="compact">Compact (mini horizontal)</option>
              </select>
            </div>
            <div className="pf-field">
              <label>Status</label>
              <select value={form.status} onChange={e => set('status', e.target.value)}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="pf-field pf-field--toggle">
              <label>Featured</label>
              <button
                type="button"
                className={`pf-toggle${form.featured ? ' on' : ''}`}
                onClick={() => set('featured', !form.featured)}
              >
                <span className="pf-toggle-knob" />
              </button>
            </div>
          </div>
        </div>

        {/* ── Section: Cover image ── */}
        <div className="pf-section">
          <h3 className="pf-section-title">Cover Image</h3>
          <div className="pf-grid-2">
            <div className="pf-field">
              <label>Image URL</label>
              <input value={form.image} onChange={e => set('image', e.target.value)} placeholder="https://… or upload below" />
            </div>
            <div className="pf-field">
              <label>Fallback Color</label>
              <div className="pf-color-row">
                <input type="color" className="pf-color-swatch" value={form.color} onChange={e => set('color', e.target.value)} />
                <input value={form.color} onChange={e => set('color', e.target.value)} placeholder="#6c63ff" />
              </div>
            </div>
          </div>
          <div className="pf-upload-area" onClick={() => fileRef.current?.click()}>
            {form.image
              ? <img src={form.image} className="pf-preview" alt="preview" />
              : <div className="pf-upload-placeholder">
                  <span className="pf-upload-icon">↑</span>
                  <span>Click to upload image</span>
                  <span className="pf-upload-hint">PNG, JPG, WebP — max 5 MB</span>
                </div>
            }
            {imgPct !== null && (
              <div className="pf-progress">
                <div className="pf-progress-bar" style={{ width: `${imgPct}%` }} />
              </div>
            )}
          </div>
          <input ref={fileRef} type="file" accept="image/*" className="pf-hidden" onChange={handleImage} />
        </div>

        {/* ── Section: Project metadata ── */}
        <div className="pf-section">
          <h3 className="pf-section-title">Project Metadata</h3>
          <div className="pf-grid-3">
            <div className="pf-field">
              <label>Client</label>
              <input value={form.client} onChange={e => set('client', e.target.value)} placeholder="Client or Personal" />
            </div>
            <div className="pf-field">
              <label>Date</label>
              <input value={form.date} onChange={e => set('date', e.target.value)} placeholder="Mar 2024" />
            </div>
            <div className="pf-field">
              <label>Services</label>
              <input value={form.services} onChange={e => set('services', e.target.value)} placeholder="UI/UX Design" />
            </div>
            <div className="pf-field pf-field--full">
              <label>Live URL</label>
              <input type="url" value={form.liveUrl} onChange={e => set('liveUrl', e.target.value)} placeholder="https://…" />
            </div>
          </div>
        </div>

        {/* ── Section: Case study content ── */}
        <div className="pf-section">
          <h3 className="pf-section-title">Case Study Content</h3>
          <div className="pf-field pf-field--full">
            <label>Overview</label>
            <textarea rows={4} value={form.overview} onChange={e => set('overview', e.target.value)} placeholder="High-level project overview…" />
          </div>
          <div className="pf-field pf-field--full">
            <label>Problem & Goal</label>
            <textarea rows={4} value={form.problem} onChange={e => set('problem', e.target.value)} placeholder="What problem were you solving?…" />
          </div>
          <div className="pf-field pf-field--full">
            <label>Outcome & Results</label>
            <textarea rows={4} value={form.outcome} onChange={e => set('outcome', e.target.value)} placeholder="What was the result?…" />
          </div>
        </div>

        {/* ── Section: Process steps ── */}
        <div className="pf-section">
          <div className="pf-section-row">
            <h3 className="pf-section-title">Process Steps</h3>
            <button type="button" className="admin-btn admin-btn--sm" onClick={addStep}>+ Add Step</button>
          </div>
          <div className="pf-steps">
            {form.processSteps.map((step, i) => (
              <div key={i} className="pf-step">
                <div className="pf-step-num">0{i + 1}</div>
                <div className="pf-step-fields">
                  <input value={step.title} onChange={e => updateStep(i, 'title', e.target.value)} placeholder="Step title" />
                  <textarea rows={3} value={step.body} onChange={e => updateStep(i, 'body', e.target.value)} placeholder="Step description…" />
                </div>
                {form.processSteps.length > 1 && (
                  <button type="button" className="pf-step-remove" onClick={() => removeStep(i)}>×</button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Section: Gallery ── */}
        <div className="pf-section">
          <div className="pf-section-row">
            <h3 className="pf-section-title">Gallery</h3>
            <button type="button" className="admin-btn admin-btn--sm" onClick={() => set('gallery', [...form.gallery, ''])}>+ Add Image URL</button>
          </div>
          <div className="pf-gallery-list">
            {form.gallery.map((url, i) => (
              <div key={i} className="pf-gallery-item">
                <input value={url} onChange={e => { const g = [...form.gallery]; g[i] = e.target.value; set('gallery', g) }} placeholder="https://…" />
                <button type="button" className="pf-step-remove" onClick={() => set('gallery', form.gallery.filter((_, j) => j !== i))}>×</button>
              </div>
            ))}
            {form.gallery.length === 0 && <p className="pf-empty-hint">No gallery images yet.</p>}
          </div>
        </div>

      </div>

      {/* Sticky save bar */}
      <div className="pf-save-bar">
        <button type="button" className="admin-btn admin-btn--secondary" onClick={onDone}>Cancel</button>
        <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>
          {saving ? 'Saving…' : (isEdit ? 'Save Changes' : 'Create Project')}
        </button>
      </div>
    </form>
  )
}
