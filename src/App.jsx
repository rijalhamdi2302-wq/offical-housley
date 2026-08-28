import React, { useState, useEffect } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const APK_URL = import.meta.env.VITE_APK_URL || '/Housley.apk'

/* ─── Custom SVG Icons (no emoji) ─── */
const Icons = {
  Money: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v12M8 9.5c0-1.4 1.8-2.5 4-2.5s4 1.1 4 2.5-1.8 2.5-4 2.5-4 1.1-4 2.5 1.8 2.5 4 2.5 4-1.1 4-2.5"/></svg>,
  Chart: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 20V10M10 20V4M16 20v-8M21 20H3"/></svg>,
  Basket: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9h16l-1.5 11a2 2 0 0 1-2 1.8H7.5a2 2 0 0 1-2-1.8L4 9Z"/><path d="M8.5 9a3.5 3.5 0 0 1 7 0"/></svg>,
  Target: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/></svg>,
  Tag: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12V4h8l9 9-7 7-10-8Z"/><circle cx="7.5" cy="8.5" r="1.4"/></svg>,
  Refresh: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5"/></svg>,
  Camera: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 8h3l2-3h6l2 3h3a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/><circle cx="12" cy="13.5" r="3.2"/></svg>,
  Sparkles: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 4l1.8 4.7L18.5 10.5l-4.7 1.8L12 17l-1.8-4.7L5.5 10.5l4.7-1.8L12 4Z"/><path d="M19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8L19 16Z"/></svg>,
  TrendUp: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></svg>,
  CreditCard: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/></svg>,
  Calendar: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="5" width="16" height="16" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/></svg>,
  Soup: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 11h16v3a6 6 0 0 1-6 6h-4a6 6 0 0 1-6-6v-3Z"/><path d="M8 9c0-1.5 1.5-2 1.5-3.5M12 9c0-1.5 1.5-2 1.5-3.5M16 9c0-1.5 1.5-2 1.5-3.5"/><path d="M4 11h16"/></svg>,
  Gift: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="9" width="16" height="5" rx="1.5"/><path d="M12 9v11M12 9c-5 0-6-3.5-1.5-4C12 5 12 9 12 9m0 0c5 0 6-3.5 1.5-4C12 5 12 9 12 9"/></svg>,
  Send: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 11 18-8-8 18-2.5-7.5L3 11Z"/></svg>,
  Trophy: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/></svg>,
  Book: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"/><path d="M8 7h8M8 11h6"/></svg>,
  Shield: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3 5 5.5v5.2c0 4.6 3 8.4 7 10.3 4-1.9 7-5.7 7-10.3V5.5L12 3Z"/><path d="m9 12 2 2 4-4.5"/></svg>,
  Lock: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="10.5" width="14" height="10" rx="3"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>,
  Check: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m4.5 12.5 5 5 10-11"/></svg>,
  Info: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7.5h.01"/></svg>,
  Download: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3v12M7 10l5 5 5-5"/><path d="M4 21h16"/></svg>,
  Users: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="7" r="3.5"/><path d="M2 21c0-3.9 3.1-7 7-7s7 3.1 7 7"/><circle cx="17" cy="9" r="2.5"/><path d="M22 21c0-2.8-2.2-5-5-5"/></svg>,
  Star: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 2 3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2Z"/></svg>,
  Zap: () => <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m13 2-2 9h5l-6 11 2-9H7l6-11Z"/></svg>,
}

/* ─── tiny animation hook ─── */
function useInView(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    if (!ref.current) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold })
    obs.observe(ref.current)
    return () => obs.disconnect()
  }, [ref, threshold])
  return visible
}

/* ─── Fade-in wrapper ─── */
function FadeIn({ children, delay = 0, className = '' }) {
  const ref = React.useRef()
  const vis = useInView(ref)
  return (
    <div ref={ref} className={`fade-in ${vis ? 'visible' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  )
}



/* ─── Navbar ─── */
function Navbar({ currentPage, setPage }) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 30)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  const nav = (page) => { setPage(page); setMenuOpen(false) }

  return (
    <>
    <nav className={`nav ${scrolled ? 'nav-scrolled' : ''}`}>
      <div className="nav-inner">
        <div className="nav-logo" onClick={() => nav('home')} style={{ cursor: 'pointer' }}>
          <img className="nav-logo-icon" src="/icon.png" alt="Housley" width="32" height="32" style={{ borderRadius: 8, objectFit: 'cover' }} />
          <span className="nav-logo-text">Housley</span>
        </div>
        <div className="nav-links">
          <button className={`nav-link ${currentPage === 'home' ? 'active' : ''}`} onClick={() => nav('home')}>Home</button>
          <button className={`nav-link ${currentPage === 'features' ? 'active' : ''}`} onClick={() => nav('features')}>Features</button>
          <button className={`nav-link ${currentPage === 'about' ? 'active' : ''}`} onClick={() => nav('about')}>About</button>
          <a href="/terms.html" className="nav-link" target="_blank" rel="noopener noreferrer">Terms</a>
          <a href="/privacy.html" className="nav-link" target="_blank" rel="noopener noreferrer">Privacy</a>
          <a className="nav-cta" href={APK_URL} download="Housley.apk">Download APK</a>
        </div>
        <button className="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
          <span className={`hamburger-line ${menuOpen ? 'open' : ''}`} />
        </button>
      </div>
    </nav>
    {menuOpen && (
      <div className="mobile-menu" onClick={() => setMenuOpen(false)}>
        <div className="mobile-menu-inner" onClick={(e) => e.stopPropagation()}>
          <button className="mobile-link" onClick={() => nav('home')}>Home</button>
          <button className="mobile-link" onClick={() => nav('features')}>Features</button>
          <button className="mobile-link" onClick={() => nav('about')}>About</button>
          <a href="/terms.html" className="mobile-link" target="_blank" rel="noopener noreferrer">Terms of Service</a>
          <a href="/privacy.html" className="mobile-link" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          <a className="mobile-cta" href={APK_URL} download="Housley.apk">Download APK</a>
        </div>
      </div>
    )}
    </>
  )
}

/* ─── Hero ─── */
function Hero({ setPage }) {
  return (
    <section className="hero">
      <div className="hero-bg-shapes">
        <div className="shape shape-1" />
        <div className="shape shape-2" />
        <div className="shape shape-3" />
      </div>
      <div className="hero-content">
        <FadeIn>
          <div className="hero-badge"><Icons.Sparkles /> Free for Families</div>
        </FadeIn>
        <FadeIn delay={100}>
          <h1 className="hero-title">
            Manage your family's<br />
            <span className="gradient-text">money together</span>
          </h1>
        </FadeIn>
        <FadeIn delay={200}>
          <p className="hero-sub" style={{ fontWeight: 600, fontSize: 16, marginBottom: 4 }}>Smarter spending, closer family.</p>
          <p className="hero-sub">
            Track expenses, budgets, groceries and savings goals — all in one beautiful app.
            Built for families, by a family.
          </p>
        </FadeIn>
        <FadeIn delay={300}>
          <div className="hero-buttons">
            <a className="btn btn-primary btn-lg" href={APK_URL} download="Housley.apk" style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <Icons.Download /> Download Free APK
            </a>
            <button className="btn btn-secondary btn-lg" onClick={() => setPage('features')}>
              See Features
            </button>
          </div>
        </FadeIn>
        <FadeIn delay={400}>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">100%</span>
              <span className="stat-label">Free Core</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number"><Icons.Users /></span>
              <span className="stat-label">Family First</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number"><Icons.Shield /></span>
              <span className="stat-label">Secure</span>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/* ─── Feature Cards ─── */
const FEATURES = [
  { icon: Icons.Money, title: 'Expense Tracking', desc: 'Log every ringgit. Categorize spending and see where your money goes.', free: true },
  { icon: Icons.Chart, title: 'Smart Analytics', desc: 'Daily, weekly, monthly & yearly breakdowns. Beautiful charts and insights.', free: true },
  { icon: Icons.Basket, title: 'Grocery Checklist', desc: 'Never forget an item. Track grocery budgets and balances.', free: true },
  { icon: Icons.Target, title: 'Savings Goals', desc: 'Set targets and watch your family save together.', free: true },
  { icon: Icons.Tag, title: 'Budget Limits', desc: 'Set budgets per category. Get alerts when spending exceeds limits.', free: true },
  { icon: Icons.Refresh, title: 'Recurring Bills', desc: 'Track subscriptions and bills that repeat every month.', free: true },
  { icon: Icons.Camera, title: 'AI Receipt Scanning', desc: 'Snap a receipt, AI reads it and adds the expense automatically.', free: false },
  { icon: Icons.Sparkles, title: 'AI Spending Insights', desc: 'AI analyzes your spending patterns and gives tips to save more.', free: false },
  { icon: Icons.TrendUp, title: 'Investment Tracking', desc: 'Monitor your investments and portfolio performance.', free: false },
  { icon: Icons.CreditCard, title: 'Debt Management', desc: 'Track debts, interest rates, and payoff progress.', free: false },
  { icon: Icons.Calendar, title: 'Calendar Events', desc: 'Financial calendar with bill due dates and payment reminders.', free: false },
  { icon: Icons.Soup, title: 'Meal Planning', desc: 'Plan family meals and track grocery needs.', free: true },
  { icon: Icons.Gift, title: 'Chore Manager', desc: 'Assign chores and track completion.', free: true },
  { icon: Icons.Send, title: 'Family Chat', desc: 'In-app messaging for quick family communication.', free: true },
  { icon: Icons.Trophy, title: 'Spending Challenges', desc: 'Fun family challenges to save more and spend less.', free: false },
  { icon: Icons.Book, title: 'Financial Lessons', desc: 'Learn about money management with bite-sized lessons.', free: false },
]

function FeaturesSection() {
  const ref = React.useRef()
  const vis = useInView(ref, 0.05)
  return (
    <section className="features" ref={ref}>
      <FadeIn>
        <h2 className="section-title">Everything your family needs</h2>
        <p className="section-sub">Free features + Pro upgrades for power users</p>
      </FadeIn>
      <div className="features-grid">
        {FEATURES.map((f, i) => (
          <FadeIn key={i} delay={i * 50}>
            <div className={`feature-card ${f.free ? '' : 'pro'}`}>
              <div className="feature-icon"><f.icon /></div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className={`feature-badge ${f.free ? 'badge-free' : 'badge-pro'}`}>
                {f.free ? 'Free' : 'Pro'}
              </span>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

/* ─── About Page ─── */
function AboutPage({ setPage }) {
  return (
    <div className="page-container">
      <button className="back-btn" onClick={() => setPage('home')}>← Back to Home</button>
      <section className="trust" style={{ paddingTop: 100 }}>
        <FadeIn>
          <h2 className="section-title">About Housley</h2>
          <p className="section-sub">Built by a family, for families</p>
        </FadeIn>
        <div className="trust-grid">
          <FadeIn delay={0}>
            <div className="trust-card">
              <div className="trust-icon"><Icons.Star /></div>
              <h3>Our Story</h3>
              <p>Housley was born from a simple need: a family wanted to track their money together, without the complexity of spreadsheets or the privacy concerns of bank apps.</p>
            </div>
          </FadeIn>
          <FadeIn delay={80}>
            <div className="trust-card">
              <div className="trust-icon"><Icons.Users /></div>
              <h3>Built for Families</h3>
              <p>Every feature is designed with families in mind — from shared grocery budgets to individual allowances, from meal planning to chore tracking.</p>
            </div>
          </FadeIn>
          <FadeIn delay={160}>
            <div className="trust-card">
              <div className="trust-icon"><Icons.Zap /></div>
              <h3>AI-Powered</h3>
              <p>Smart receipt scanning, spending insights, and budget advice — all powered by AI that understands your family's unique spending patterns.</p>
            </div>
          </FadeIn>
          <FadeIn delay={240}>
            <div className="trust-card">
              <div className="trust-icon"><Icons.Shield /></div>
              <h3>Privacy First</h3>
              <p>Your financial data stays between you and your family. We never sell, share, or monetize your information.</p>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}

/* ─── Download Section ─── */
function DownloadSection() {
  const [version, setVersion] = useState('1.0.0')
  const [releaseNotes, setReleaseNotes] = useState([])
  const [releasedAt, setReleasedAt] = useState(null)
  useEffect(() => {
    fetch(`${API_URL}/api/app/latest`)
      .then(r => r.json())
      .then(d => {
        if (d.version) setVersion(d.version)
        if (d.releaseNotes) setReleaseNotes(d.releaseNotes)
        if (d.releasedAt) setReleasedAt(d.releasedAt)
      })
      .catch(() => {})
  }, [])

  return (
    <section className="download" id="download">
      <div className="download-card">
        <FadeIn>
          <div className="download-icon"><Icons.Download /></div>
          <h2>Get Housley</h2>
          <p className="download-version">Version {version} • Android 8.0+</p>
          {releasedAt && <p className="download-size" style={{ marginTop: 4 }}>Released {new Date(releasedAt).toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' })}</p>}
          {!releasedAt && <p className="download-size">Free forever</p>}
        </FadeIn>
        {/* v4: Two install options — APK + PWA */}
        <FadeIn delay={100}>
          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <a className="btn btn-primary btn-xl" style={{ flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 8 }} href={APK_URL} download="Housley.apk">
              <Icons.Download /> Download APK
            </a>
            <button className="btn btn-soft btn-xl" style={{ flex: 1 }} onClick={() => {
              // PWA install
              if (window._deferredPrompt) {
                window._deferredPrompt.prompt()
              } else {
                // iOS or not supported — show manual instructions
                alert('To install as an app:\n\nAndroid: Tap the three dots menu → "Add to Home screen"\n\niOS Safari: Tap the Share button → "Add to Home Screen"')
              }
            }}>
              <Icons.Zap /> Install as Web App
            </button>
          </div>
        </FadeIn>
        {/* Comparison table */}
        <FadeIn delay={150}>
          <div style={{ width: '100%', marginBottom: 20, fontSize: 13 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '6px 8px', color: 'var(--text-secondary)' }}></th>
                  <th style={{ padding: '6px 8px', fontWeight: 700, color: 'var(--primary)' }}>APK</th>
                  <th style={{ padding: '6px 8px', fontWeight: 700, color: 'var(--accent)' }}>Web App</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '6px 8px' }}>Biometric unlock</td><td style={{ padding: '6px 8px' }}>Yes</td><td style={{ padding: '6px 8px' }}>No (PIN only)</td></tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '6px 8px' }}>Push notifications</td><td style={{ padding: '6px 8px' }}>Yes</td><td style={{ padding: '6px 8px' }}>Yes (Android)</td></tr>
                <tr style={{ borderBottom: '1px solid var(--border)' }}><td style={{ padding: '6px 8px' }}>Install method</td><td style={{ padding: '6px 8px' }}>Unknown sources</td><td style={{ padding: '6px 8px' }}>One tap</td></tr>
                <tr><td style={{ padding: '6px 8px' }}>Updates</td><td style={{ padding: '6px 8px' }}>Manual reinstall</td><td style={{ padding: '6px 8px' }}>Automatic</td></tr>
              </tbody>
            </table>
          </div>
        </FadeIn>
        {releaseNotes.length > 0 && (
        <FadeIn delay={150}>
          <div className="download-steps" style={{ marginTop: 20, textAlign: 'left' }}>
            <h3>What's New</h3>
            <ul style={{ paddingLeft: 20, color: 'var(--text-secondary)', fontSize: 14 }}>
              {releaseNotes.map((note, i) => <li key={i}>{note}</li>)}
            </ul>
          </div>
        </FadeIn>
        )}
        <FadeIn delay={200}>
          <div className="download-steps">
            <h3>How to install</h3>
            <div className="step">
              <span className="step-num">1</span>
              <div>
                <strong>Download the APK</strong>
                <p>Tap the button above. Your browser will download the file.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-num">2</span>
              <div>
                <strong>Allow installation</strong>
                <p>Go to Settings → Security → Enable "Install Unknown Apps" for your browser.</p>
              </div>
            </div>
            <div className="step">
              <span className="step-num">3</span>
              <div>
                <strong>Install & open</strong>
                <p>Tap the downloaded file → Install → Open Housley!</p>
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/* ─── Pricing Preview ─── */
function PricingSection() {
  return (
    <section className="pricing">
      <FadeIn>
        <h2 className="section-title">Simple, fair pricing</h2>
        <p className="section-sub">Start free. Upgrade when you need more.</p>
      </FadeIn>
      <div className="pricing-grid">
        <FadeIn delay={0}>
          <div className="pricing-card free-card">
            <div className="pricing-badge">FREE</div>
            <h3>Core</h3>
            <div className="pricing-price">RM 0</div>
            <p className="pricing-period">forever</p>
            <ul>
              <li><Icons.Check /> Expense tracking</li>
              <li><Icons.Check /> Budget management</li>
              <li><Icons.Check /> Grocery checklist</li>
              <li><Icons.Check /> Savings goals</li>
              <li><Icons.Check /> Meal planning</li>
              <li><Icons.Check /> Chore management</li>
              <li><Icons.Check /> Family chat</li>
              <li><Icons.Check /> Up to 6 family members</li>
            </ul>
            <a className="btn btn-secondary btn-block" href={APK_URL} download="Housley.apk" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              Download Free
            </a>
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <div className="pricing-card pro-card">
            <div className="pricing-badge pro-badge">PRO</div>
            <h3>Pro</h3>
            <div className="pricing-price">RM 14.90</div>
            <p className="pricing-period">/month</p>
            <ul>
              <li><Icons.Check /> Everything in Free</li>
              <li><Icons.Camera /> AI receipt scanning</li>
              <li><Icons.Sparkles /> AI spending insights</li>
              <li><Icons.TrendUp /> Investment tracking</li>
              <li><Icons.CreditCard /> Debt management</li>
              <li><Icons.Calendar /> Calendar events</li>
              <li><Icons.Trophy /> Spending challenges</li>
              <li><Icons.Book /> Financial lessons</li>
              <li><Icons.Chart /> Advanced analytics</li>
              <li><Icons.Zap /> Priority support</li>
            </ul>
            <div className="pricing-annual">
              Annual: RM 119/year (33% off)
            </div>
            <div className="pricing-lifetime">
              Lifetime: RM 299 (best value!)
            </div>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

/* ─── Trust & Safety Section ─── */
function TrustSection() {
  return (
    <section className="trust">
      <FadeIn>
        <h2 className="section-title">Is Housley safe?</h2>
        <p className="section-sub">We get it — downloading an APK from the internet can feel sketchy. Here's why Housley is different.</p>
      </FadeIn>
      <div className="trust-grid">
        <FadeIn delay={0}>
          <div className="trust-card">
            <div className="trust-icon"><Icons.Shield /></div>
            <h3>Open Source Code</h3>
            <p>Our backend is on GitHub. Anyone can verify what data we collect — which is nothing you don't explicitly enter.</p>
          </div>
        </FadeIn>
        <FadeIn delay={80}>
          <div className="trust-card">
            <div className="trust-icon"><Icons.Lock /></div>
            <h3>Encrypted & Private</h3>
            <p>All data is encrypted in transit (HTTPS) and at rest. Your family's financial info stays between you and your family — period.</p>
          </div>
        </FadeIn>
        <FadeIn delay={160}>
          <div className="trust-card">
            <div className="trust-icon"><Icons.Check /></div>
            <h3>No Hidden Permissions</h3>
            <p>Housley only asks for what it needs — camera for receipt scanning, notifications for budget alerts. No contacts, no location, no microphone.</p>
          </div>
        </FadeIn>
        <FadeIn delay={240}>
          <div className="trust-card">
            <div className="trust-icon"><Icons.Info /></div>
            <h3>Google Play Store Soon</h3>
            <p>We're in the process of publishing on the Play Store — the ultimate proof of safety. Google reviews every app before it goes live.</p>
          </div>
        </FadeIn>
      </div>
      <FadeIn delay={300}>
        <div className="trust-cta">
          <p>Still have questions? Read our <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Privacy Policy</a> and <a href="/terms.html" target="_blank" rel="noopener noreferrer">Terms of Service</a>.</p>
        </div>
      </FadeIn>
    </section>
  )
}

/* ─── Footer ─── */
function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <img src="/icon.png" alt="Housley" width="24" height="24" style={{ borderRadius: 6, objectFit: 'cover' }} />
          <span>Housley</span>
        </div>
        <div className="footer-links">
          <button onClick={() => setPage('home')}>Home</button>
          <button onClick={() => setPage('features')}>Features</button>
          <button onClick={() => setPage('about')}>About</button>
          <a href="/terms.html" target="_blank" rel="noopener noreferrer">Terms</a>
          <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Privacy</a>
          <a href={APK_URL} download="Housley.apk">Download</a>
        </div>
        <p className="footer-copy">© 2026 Housley. Made with care for families.</p>
      </div>
    </footer>
  )
}

/* ─── Features Page ─── */
function FeaturesPage({ setPage }) {
  return (
    <div className="page-container">
      <button className="back-btn" onClick={() => setPage('home')}>← Back to Home</button>
      <FeaturesSection />
      <PricingSection />
    </div>
  )
}

/* ─── Main App ─── */
export default function App() {
  const [page, setPage] = useState('home')

  // v4: Capture PWA install prompt
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      window._deferredPrompt = e
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page])

  return (
    <div className="app">
      <Navbar currentPage={page} setPage={setPage} />
      {page === 'home' && (
        <>
          <Hero setPage={setPage} />
          <FeaturesSection />
          <TrustSection />
          <PricingSection />
          <DownloadSection />
        </>
      )}
      {page === 'download' && <DownloadSection />}
      {page === 'features' && <FeaturesPage setPage={setPage} />}
      {page === 'about' && <AboutPage setPage={setPage} />}

      <Footer setPage={setPage} />
    </div>
  )
}
// redeploy
