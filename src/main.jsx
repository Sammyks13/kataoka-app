import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import KataokaApp from './App.jsx'

// Shim window.storage → localStorage so the app works outside Claude artifacts
window.storage = {
  get: async (key) => {
    try {
      const v = localStorage.getItem(key)
      if (v === null) return null
      return { value: JSON.parse(v) }
    } catch { return null }
  },
  set: async (key, value) => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch {}
    return { key, value }
  },
  delete: async (key) => {
    try { localStorage.removeItem(key) } catch {}
    return { key, deleted: true }
  },
  list: async (prefix) => {
    try {
      const keys = Object.keys(localStorage).filter(k => !prefix || k.startsWith(prefix))
      return { keys }
    } catch { return { keys: [] } }
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <KataokaApp />
  </StrictMode>
)
