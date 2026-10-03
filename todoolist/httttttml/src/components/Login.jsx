import { useState } from 'react'

export default function Login({ onLogin, onShowRegister, error, busy }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onLogin({ email, password })
  }

  return (
    <section className="auth-card" aria-labelledby="auth-title">
      <div className="eyebrow"><span className="eyebrow-dot" /> AYUSH</div>
      <h1 id="auth-title">Sign in</h1>
      <p className="subtitle">Access your task list.</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="login-email">Email</label>
        <input
          id="login-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <label htmlFor="login-password">Password</label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="auth-submit" type="submit" disabled={busy}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
      <p className="auth-switch">
        New to Ayush? <button type="button" onClick={onShowRegister}>Create an account</button>
      </p>
      <p className="demo-note">Demo mode: your account is stored only in this browser.</p>
    </section>
  )
}
