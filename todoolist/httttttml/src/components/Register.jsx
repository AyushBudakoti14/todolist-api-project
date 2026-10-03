import { useState } from 'react'

export default function Register({ onRegister, onShowLogin, error, busy }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    onRegister({ name, email, password })
  }

  return (
    <section className="auth-card" aria-labelledby="auth-title">
      <div className="eyebrow"><span className="eyebrow-dot" /> AYUSH</div>
      <h1 id="auth-title">Create account</h1>
      <p className="subtitle">Create an account to save your task list.</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="register-name">Name</label>
        <input
          id="register-name"
          type="text"
          autoComplete="name"
          minLength={2}
          maxLength={60}
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        <label htmlFor="register-email">Email</label>
        <input
          id="register-email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <label htmlFor="register-password">Password</label>
        <input
          id="register-password"
          type="password"
          autoComplete="new-password"
          minLength={8}
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
        />
        <p className="password-hint">Use at least 8 characters.</p>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button className="auth-submit" type="submit" disabled={busy}>
          {busy ? 'Creating account…' : 'Create account'}
        </button>
      </form>
      <p className="auth-switch">
        Already have an account? <button type="button" onClick={onShowLogin}>Sign in</button>
      </p>
      <p className="demo-note">Demo mode: your account is stored only in this browser.</p>
    </section>
  )
}
