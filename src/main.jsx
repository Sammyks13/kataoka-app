import { StrictMode, Component } from 'react'
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

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(e) { return { error: e }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{padding:24,fontFamily:'monospace',background:'#0a0a0a',color:'#ff3b5c',minHeight:'100vh'}}>
          <div style={{fontSize:14,marginBottom:8,color:'#fff'}}>APP ERROR — screenshot this and send it</div>
          <div style={{fontSize:12,wordBreak:'break-all'}}>{String(this.state.error)}</div>
          <div style={{fontSize:10,marginTop:12,color:'#666',wordBreak:'break-all'}}>{this.state.error?.stack}</div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <KataokaApp />
    </ErrorBoundary>
  </StrictMode>
)

