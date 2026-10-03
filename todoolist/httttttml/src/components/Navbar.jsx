export default function Navbar({ onLogout }) {
  return (
    <header className="topbar">
      <a className="brand" href="#home" aria-label="Ayush home">
        <span className="brand-mark" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path d="M7 12.5 10.2 16 17.5 8" />
          </svg>
        </span>
        <span>Ayush</span>
      </a>
      <div className="nav-user">
        <span className="topbar-note">Hi, Ayush</span>
        <button className="logout-button" type="button" onClick={onLogout}>Log out</button>
      </div>
    </header>
  )
}
