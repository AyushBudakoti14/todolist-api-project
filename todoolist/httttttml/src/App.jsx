import { useState } from 'react'
import { api } from './api.js'
import Dashboard from './components/Dashboard.jsx'
import Login from './components/Login.jsx'
import Register from './components/Register.jsx'
import './App.css'

function getSavedUser() {
  try {
    return { user: api.getSession(), error: '' }
  } catch (error) {
    console.error('Could not restore your session:', error)
    return { user: null, error: error.message }
  }
}

function App() {
  const [initialSession] = useState(getSavedUser)
  const [user, setUser] = useState(initialSession.user)
  const [screen, setScreen] = useState('login')
  const [error, setError] = useState(initialSession.error)
  const [busy, setBusy] = useState(false)

  async function authenticate(action, credentials) {
    setBusy(true)
    setError('')
    try {
      setUser(await action(credentials))
    } catch (authError) {
      setError(authError.message)
    } finally {
      setBusy(false)
    }
  }

  function logout() {
    try {
      api.logout()
      setUser(null)
      setScreen('login')
      setError('')
    } catch (logoutError) {
      setError(logoutError.message)
    }
  }

  if (user) return <Dashboard user={user} onLogout={logout} />

  return (
    <main className="page-shell auth-shell">
      <header className="topbar">
        <a className="brand" href="#home" aria-label="Ayush home">
          <span className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M7 12.5 10.2 16 17.5 8" />
            </svg>
          </span>
          <span>Ayush</span>
        </a>
        <span className="topbar-note">Task list</span>
      </header>
      <div className="auth-content">
        {screen === 'login' ? (
          <Login
            onLogin={(credentials) => authenticate(api.login, credentials)}
            onShowRegister={() => { setScreen('register'); setError('') }}
            error={error}
            busy={busy}
          />
        ) : (
          <Register
            onRegister={(credentials) => authenticate(api.register, credentials)}
            onShowLogin={() => { setScreen('login'); setError('') }}
            error={error}
            busy={busy}
          />
        )}
      </div>
      <footer className="page-footer">
        <span>Ayush</span>
        <span>Your task list</span>
      </footer>
    </main>
  )
}

export default App
