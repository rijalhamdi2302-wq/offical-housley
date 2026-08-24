import React, { useState, useEffect } from 'react'
import './App.css'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
const APK_URL = import.meta.env.VITE_APK_URL || '/Housley.apk'

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
          <a href="/terms.html" className="nav-link" target="_blank" rel="noopener noreferrer">Terms</a>
          <a href="/privacy.html" className="nav-link" target="_blank" rel="noopener noreferrer">Privacy</a>
          <button className="nav-cta" onClick={() => nav('download')}>Download APK</button>
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
          <a href="/terms.html" className="mobile-link" target="_blank" rel="noopener noreferrer">Terms of Service</a>
          <a href="/privacy.html" className="mobile-link" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          <button className="mobile-cta" onClick={() => nav('download')}>Download APK</button>
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
          <div className="hero-badge">✨ Free for Families</div>
        </FadeIn>
        <FadeIn delay={100}>
          <h1 className="hero-title">
            Manage your family's<br />
            <span className="gradient-text">money together</span>
          </h1>
        </FadeIn>
        <FadeIn delay={200}>
          <p className="hero-sub">
            Track expenses, budgets, groceries and savings goals — all in one beautiful app.
            Built for families, by a family.
          </p>
        </FadeIn>
        <FadeIn delay={300}>
          <div className="hero-buttons">
            <button className="btn btn-primary btn-lg" onClick={() => setPage('download')}>
              <span>📱</span> Download Free APK
            </button>
            <button className="btn btn-secondary btn-lg" onClick={() => setPage('features')}>
              See Features →
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
              <span className="stat-number">👨‍👩‍👧‍👦</span>
              <span className="stat-label">Family First</span>
            </div>
            <div className="stat-divider" />
            <div className="stat">
              <span className="stat-number">🔒</span>
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
  { icon: '💰', title: 'Expense Tracking', desc: 'Log every ringgit. Categorize spending and see where your money goes.', free: true },
  { icon: '📊', title: 'Smart Analytics', desc: 'Daily, weekly, monthly & yearly breakdowns. Beautiful charts and insights.', free: true },
  { icon: '🛒', title: 'Grocery Checklist', desc: 'Never forget an item. Track grocery budgets and balances.', free: true },
  { icon: '🎯', title: 'Savings Goals', desc: 'Set targets and watch your family save together.', free: true },
  { icon: '📝', title: 'Budget Limits', desc: 'Set budgets per category. Get alerts when spending exceeds limits.', free: true },
  { icon: '🔄', title: 'Recurring Bills', desc: 'Track subscriptions and bills that repeat every month.', free: true },
  { icon: '📸', title: 'AI Receipt Scanning', desc: 'Snap a receipt, AI reads it and adds the expense automatically.', free: false },
  { icon: '🤖', title: 'AI Spending Insights', desc: 'AI analyzes your spending patterns and gives tips to save more.', free: false },
  { icon: '📈', title: 'Investment Tracking', desc: 'Monitor your investments and portfolio performance.', free: false },
  { icon: '💳', title: 'Debt Management', desc: 'Track debts, interest rates, and payoff progress.', free: false },
  { icon: '📅', title: 'Calendar Events', desc: 'Financial calendar with bill due dates and payment reminders.', free: false },
  { icon: '🍽️', title: 'Meal Planning', desc: 'Plan family meals and track grocery needs.', free: true },
  { icon: '🧹', title: 'Chore Manager', desc: 'Assign chores and track completion.', free: true },
  { icon: '💬', title: 'Family Chat', desc: 'In-app messaging for quick family communication.', free: true },
  { icon: '🏆', title: 'Spending Challenges', desc: 'Fun family challenges to save more and spend less.', free: false },
  { icon: '📚', title: 'Financial Lessons', desc: 'Learn about money management with bite-sized lessons.', free: false },
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
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <span className={`feature-badge ${f.free ? 'badge-free' : 'badge-pro'}`}>
                {f.free ? '✨ Free' : '💎 Pro'}
              </span>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  )
}

/* ─── Download Section ─── */
function DownloadSection() {
  const [version, setVersion] = useState('1.0.0')
  const [releaseNotes, setReleaseNotes] = useState([])
  const [releasedAt, setReleasedAt] = useState(null)
  const [downloading, setDownloading] = useState(false)
  const [apkUrl, setApkUrl] = useState(APK_URL)
  const [hasRelease, setHasRelease] = useState(false)

  useEffect(() => {
    fetch(`${API_URL}/api/app/latest`)
      .then(r => r.json())
      .then(d => {
        if (d.version) setVersion(d.version)
        if (d.apkUrl) { setApkUrl(d.apkUrl); setHasRelease(true) }
        if (d.releaseNotes) setReleaseNotes(d.releaseNotes)
        if (d.releasedAt) setReleasedAt(d.releasedAt)
      })
      .catch(() => {})
  }, [])

  const handleDownload = () => {
    setDownloading(true)
    const a = document.createElement('a')
    a.href = apkUrl
    a.download = `Housley-v${version}.apk`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    setTimeout(() => setDownloading(false), 3000)
  }

  return (
    <section className="download" id="download">
      <div className="download-card">
        <FadeIn>
          <div className="download-icon">📱</div>
          <h2>Download Housley</h2>
          <p className="download-version">Version {version} • Android 8.0+</p>
          {releasedAt && <p className="download-size" style={{ marginTop: 4 }}>Released {new Date(releasedAt).toLocaleDateString('en-MY', { year: 'numeric', month: 'short', day: 'numeric' })}</p>}
          {!releasedAt && <p className="download-size">Free forever</p>}
        </FadeIn>
        <FadeIn delay={100}>
          <button className="btn btn-primary btn-xl" onClick={handleDownload} disabled={downloading}>
            {downloading ? (
              <><span className="spinner" /> Downloading...</>
            ) : (
              <><span>⬇️</span> Download APK Now</>
            )}
          </button>
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
              <li>✅ Expense tracking</li>
              <li>✅ Budget management</li>
              <li>✅ Grocery checklist</li>
              <li>✅ Savings goals</li>
              <li>✅ Meal planning</li>
              <li>✅ Chore management</li>
              <li>✅ Family chat</li>
              <li>✅ Up to 6 family members</li>
            </ul>
            <button className="btn btn-secondary btn-block" onClick={() => document.getElementById('download')?.scrollIntoView({ behavior: 'smooth' })}>
              Download Free
            </button>
          </div>
        </FadeIn>
        <FadeIn delay={100}>
          <div className="pricing-card pro-card">
            <div className="pricing-badge pro-badge">PRO</div>
            <h3>Pro</h3>
            <div className="pricing-price">RM 14.90</div>
            <p className="pricing-period">/month</p>
            <ul>
              <li>✨ Everything in Free</li>
              <li>📸 AI receipt scanning</li>
              <li>🤖 AI spending insights</li>
              <li>📈 Investment tracking</li>
              <li>💳 Debt management</li>
              <li>📅 Calendar events</li>
              <li>🏆 Spending challenges</li>
              <li>📚 Financial lessons</li>
              <li>📊 Advanced analytics</li>
              <li>⚡ Priority support</li>
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
        <h2 className="section-title">🔒 Is Housley safe?</h2>
        <p className="section-sub">We get it — downloading an APK from the internet can feel sketchy. Here's why Housley is different.</p>
      </FadeIn>
      <div className="trust-grid">
        <FadeIn delay={0}>
          <div className="trust-card">
            <div className="trust-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h3>Open Source Code</h3>
            <p>Our backend is on GitHub. Anyone can verify what data we collect — which is nothing you don't explicitly enter.</p>
          </div>
        </FadeIn>
        <FadeIn delay={80}>
          <div className="trust-card">
            <div className="trust-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h3>Encrypted & Private</h3>
            <p>All data is encrypted in transit (HTTPS) and at rest. Your family's financial info stays between you and your family — period.</p>
          </div>
        </FadeIn>
        <FadeIn delay={160}>
          <div className="trust-card">
            <div className="trust-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <h3>No Hidden Permissions</h3>
            <p>Housley only asks for what it needs — camera for receipt scanning, notifications for budget alerts. No contacts, no location, no microphone.</p>
          </div>
        </FadeIn>
        <FadeIn delay={240}>
          <div className="trust-card">
            <div className="trust-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            </div>
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
          <a href="/terms.html" target="_blank" rel="noopener noreferrer">Terms</a>
          <a href="/privacy.html" target="_blank" rel="noopener noreferrer">Privacy</a>
          <button onClick={() => setPage('download')}>Download</button>
        </div>
        <p className="footer-copy">© 2026 Housley. Made with ❤️ for families.</p>
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

      <Footer setPage={setPage} />
    </div>
  )
}
