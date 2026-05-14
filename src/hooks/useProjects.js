import { useState, useEffect } from 'react'
import {
  collection, onSnapshot, doc,
  addDoc, updateDoc, deleteDoc,
  query, writeBatch,
} from 'firebase/firestore'

import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage'
import { db, storage } from '../firebase'

const now = () => new Date().toISOString()
const COLLECTION = 'projects'

// ── Fallback data (shown when Firebase isn't configured) ──────────────────────
export const FALLBACK_PROJECTS = [
  { id: '1', title: 'Giingoo – Mongolian Horse Race Watching App', description: 'Giingoo is a mobile app concept designed for Mongolian horse racing fans.', tags: ['UI/UX Design', 'Mobile'], image: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=800&q=80', layout: 'featured', featured: true,  status: 'published', order: 0, slug: 'giingoo', client: 'Personal', date: 'Mar 2024', services: 'UI/UX Design', overview: 'A mobile app concept for Mongolian horse racing fans.', problem: 'Racing fans had no dedicated app for following events.', outcome: 'Designed a concept app covering live races, schedules, and horse profiles.', processSteps: [], gallery: [], liveUrl: '' },
  { id: '2', title: 'Artisy Hub Mobile App', description: 'Artisy Hub was an ambitious creative collaboration platform developed at IO Tech.', tags: ['Flutter', 'Frontend Dev'], image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80', layout: 'standard', featured: false, status: 'published', order: 1, slug: 'artisy-hub', client: 'IO Tech', date: 'Sep 2024', services: 'Flutter Dev', overview: 'Creative collaboration platform.', problem: 'Artists needed a space to connect and collaborate.', outcome: 'Implemented nearly all core screens using Flutter.', processSteps: [], gallery: [], liveUrl: '' },
  { id: '3', title: 'Soundly – Music Dating App', description: 'A music-driven dating app that matches people based on their favorite songs, playlists, and artists.', tags: ['UI/UX Design', 'Mobile'], image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=800&q=80', layout: 'standard', featured: false, status: 'published', order: 2, slug: 'soundly', client: 'Personal', date: 'Jun 2024', services: 'UI/UX Design', overview: 'Music-driven dating app concept.', problem: 'Existing dating apps lacked authentic connection.', outcome: 'Designed a full app flow with music-based matching.', processSteps: [{ title: 'Research', body: 'Studied existing dating app patterns and music social apps.' }, { title: 'Design', body: 'Created wireframes, user flows, and high-fidelity prototypes.' }], gallery: [], liveUrl: '' },
  { id: '4', title: 'Meelo – Networking App', description: 'A modern professional networking app replacing physical business cards with digital NFC profiles.', tags: ['UI/UX Design', 'Branding'], image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&q=80', layout: 'compact', featured: false, status: 'published', order: 3, slug: 'meelo', client: 'Personal', date: 'Jan 2025', services: 'UI/UX Design', overview: 'NFC-based digital business card app.', problem: 'Physical business cards are wasteful and easily lost.', outcome: 'Designed a one-tap NFC profile sharing experience.', processSteps: [], gallery: [], liveUrl: '' },
]

// ── Public hook (read-only, realtime) ─────────────────────────────────────────
export function useProjects() {
  const [projects, setProjects] = useState(FALLBACK_PROJECTS)
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => { setProjects(FALLBACK_PROJECTS); setLoading(false) }, 5000)

    const q  = query(collection(db, COLLECTION))
    const un = onSnapshot(q,
      snap => {
        clearTimeout(timer)
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))
        setProjects(data.length ? data : FALLBACK_PROJECTS)
        setLoading(false)
      },
      () => { clearTimeout(timer); setLoading(false) }
    )
    return () => { clearTimeout(timer); un() }
  }, [])

  return { projects: projects.filter(p => p.status === 'published'), loading }
}

// ── Admin hook (full CRUD) ────────────────────────────────────────────────────
export function useAdminProjects() {
  const [projects, setProjects] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 5000)

    const q  = query(collection(db, COLLECTION))
    const un = onSnapshot(q,
      snap => { clearTimeout(timer); setProjects(snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (a.order ?? 99) - (b.order ?? 99))); setLoading(false) },
      () => { clearTimeout(timer); setLoading(false) }
    )
    return () => { clearTimeout(timer); un() }
  }, [])

  return { projects, loading }
}

// ── CRUD ──────────────────────────────────────────────────────────────────────
export async function addProject(data) {
  return addDoc(collection(db, COLLECTION), { ...data, createdAt: now(), updatedAt: now() })
}

export async function updateProject(id, data) {
  return updateDoc(doc(db, COLLECTION, id), { ...data, updatedAt: now() })
}

export async function deleteProject(id) {
  return deleteDoc(doc(db, COLLECTION, id))
}

export async function reorderProjects(orderedIds) {
  const batch = writeBatch(db)
  orderedIds.forEach((id, i) => batch.update(doc(db, COLLECTION, id), { order: i }))
  return batch.commit()
}

// ── Image upload ──────────────────────────────────────────────────────────────
export function uploadProjectImage(file, onProgress) {
  return new Promise((resolve, reject) => {
    const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`)
    const task = uploadBytesResumable(storageRef, file)
    task.on('state_changed',
      snap => onProgress?.(Math.round(snap.bytesTransferred / snap.totalBytes * 100)),
      reject,
      async () => resolve(await getDownloadURL(task.snapshot.ref))
    )
  })
}

export async function deleteProjectImage(url) {
  try { await deleteObject(ref(storage, url)) } catch { /* already deleted */ }
}
