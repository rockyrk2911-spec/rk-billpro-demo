import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  Boxes,
  CheckCircle2,
  Menu,
  ReceiptText,
  ShieldCheck,
  ShoppingCart,
  Users,
  WifiOff,
  X,
} from 'lucide-react'
import { useState } from 'react'

export default function Landing() {
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const goLogin = () => navigate('/login')

  return (
    <div className="rk-landing">
      {/* NAVBAR */}
      <header className="rk-land-nav">
        <div className="rk-land-container rk-land-nav-inner">
          <button
            className="rk-land-brand"
            onClick={() => navigate('/')}
            type="button"
          >
            <span className="rk-land-logo">
              <ReceiptText size={23} />
            </span>

            <span>
              <strong>RK BillPro</strong>
              <small>Smart Billing Software</small>
            </span>
          </button>

          <nav className="rk-land-links">
            <a href="#features">Features</a>
            <a href="#business">Solutions</a>
            <a href="#offline">Offline Billing</a>
            <a href="#demo">Demo</a>
          </nav>

          <div className="rk-land-nav-actions">
            <button
              type="button"
              className="rk-land-login-btn"
              onClick={goLogin}
            >
              Sign In
            </button>

            <button
              type="button"
              className="rk-land-demo-btn"
              onClick={goLogin}
            >
              Try Live Demo
              <ArrowRight size={16} />
            </button>
          </div>

          <button
            type="button"
            className="rk-land-mobile-menu"
            onClick={() => setMenuOpen((value) => !value)}
            aria-label="Toggle navigation"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {menuOpen && (
          <div className="rk-land-mobile-panel">
            <a href="#features" onClick={() => setMenuOpen(false)}>
              Features
            </a>

            <a href="#business" onClick={() => setMenuOpen(false)}>
              Solutions
            </a>

            <a href="#offline" onClick={() => setMenuOpen(false)}>
              Offline Billing
            </a>

            <button type="button" onClick={goLogin}>
              Try Live Demo
            </button>
          </div>
        )}
      </header>

      {/* HERO */}
      <main>
        <section className="rk-land-hero">
          <div className="rk-land-container rk-land-hero-grid">
            <div className="rk-land-hero-copy">
              <div className="rk-land-pill">
                <ShieldCheck size={16} />
                Smart billing for modern businesses
              </div>

              <h1>
                Smart Billing.
                <span> Smarter Business.</span>
              </h1>

              <p className="rk-land-hero-description">
                Manage billing, inventory, purchases, customers and reports
                from one simple business platform.
              </p>

              <div className="rk-land-hero-actions">
                <button
                  type="button"
                  className="rk-land-primary"
                  onClick={goLogin}
                >
                  Try Live Demo
                  <ArrowRight size={18} />
                </button>

                <a className="rk-land-secondary" href="#features">
                  Explore Features
                </a>
              </div>

              <div className="rk-land-benefits">
                <span>
                  <CheckCircle2 size={16} />
                  Easy to use
                </span>

                <span>
                  <CheckCircle2 size={16} />
                  Works offline
                </span>

                <span>
                  <CheckCircle2 size={16} />
                  Multi-device ready
                </span>
              </div>
            </div>

            {/* DASHBOARD PREVIEW */}
            <div className="rk-land-preview-wrap">
              <div className="rk-land-preview-glow" />

              <div className="rk-land-preview">
                <div className="rk-land-preview-top">
                  <div className="rk-land-preview-title">
                    <span className="rk-land-mini-logo">
                      <ReceiptText size={16} />
                    </span>

                    <div>
                      <strong>RK BillPro</strong>
                      <small>RK Supermarket</small>
                    </div>
                  </div>

                  <span className="rk-land-online">
                    <i />
                    Online
                  </span>
                </div>

                <div className="rk-land-preview-content">
                  <div className="rk-land-preview-heading">
                    <div>
                      <small>BUSINESS OVERVIEW</small>
                      <strong>Good morning, Rakesh 👋</strong>
                    </div>

                    <span>Tambaram Branch</span>
                  </div>

                  <div className="rk-land-stat-grid">
                    <div>
                      <span>Today's Sales</span>
                      <strong>₹24,580</strong>
                      <small>+12.4% today</small>
                    </div>

                    <div>
                      <span>Total Bills</span>
                      <strong>128</strong>
                      <small>Today's invoices</small>
                    </div>

                    <div>
                      <span>Products</span>
                      <strong>1,248</strong>
                      <small>24 low stock</small>
                    </div>
                  </div>

                  <div className="rk-land-preview-lower">
                    <div className="rk-land-chart-card">
                      <div className="rk-land-card-heading">
                        <strong>Sales Overview</strong>
                        <span>7 Days</span>
                      </div>

                      <div className="rk-land-fake-chart">
                        <span style={{ height: '42%' }} />
                        <span style={{ height: '62%' }} />
                        <span style={{ height: '48%' }} />
                        <span style={{ height: '75%' }} />
                        <span style={{ height: '58%' }} />
                        <span style={{ height: '88%' }} />
                        <span style={{ height: '72%' }} />
                      </div>
                    </div>

                    <div className="rk-land-quick-card">
                      <strong>Quick Actions</strong>

                      <button type="button">
                        <ShoppingCart size={15} />
                        New Bill
                      </button>

                      <button type="button">
                        <Boxes size={15} />
                        Add Product
                      </button>

                      <button type="button">
                        <BarChart3 size={15} />
                        Reports
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section id="features" className="rk-land-section">
          <div className="rk-land-container">
            <div className="rk-land-section-heading">
              <span>EVERYTHING IN ONE PLACE</span>

              <h2>Built to simplify your daily business.</h2>

              <p>
                From the first bill of the day to your final sales report,
                RK BillPro keeps your important operations connected.
              </p>
            </div>

            <div className="rk-land-feature-grid">
              <Feature
                icon={<ReceiptText />}
                title="Fast POS Billing"
                description="Create professional invoices quickly with a simple billing workflow."
              />

              <Feature
                icon={<Boxes />}
                title="Inventory Management"
                description="Track products, stock levels and low-stock items from one place."
              />

              <Feature
                icon={<Users />}
                title="Customers & Suppliers"
                description="Keep customer and supplier information organised and accessible."
              />

              <Feature
                icon={<BarChart3 />}
                title="Business Reports"
                description="Understand sales, expenses and business performance through reports."
              />

              <Feature
                icon={<WifiOff />}
                title="Offline Billing"
                description="Continue creating bills when internet connectivity is unavailable."
              />

              <Feature
                icon={<ShieldCheck />}
                title="Business Controls"
                description="Manage users, branches, settings and permissions from your workspace."
              />
            </div>
          </div>
        </section>

        {/* OFFLINE */}
        <section id="offline" className="rk-land-offline">
          <div className="rk-land-container rk-land-offline-grid">
            <div>
              <span className="rk-land-section-label">
                OFFLINE READY
              </span>

              <h2>Internet down? Keep billing.</h2>

              <p>
                RK BillPro is designed around an offline-friendly billing
                workflow, so a temporary connection problem doesn't have to
                stop the billing counter.
              </p>

              <div className="rk-land-offline-points">
                <span>
                  <CheckCircle2 size={18} />
                  Continue billing while offline
                </span>

                <span>
                  <CheckCircle2 size={18} />
                  Keep local business activity available
                </span>

                <span>
                  <CheckCircle2 size={18} />
                  Synchronize changes when connectivity returns
                </span>
              </div>
            </div>

            <div className="rk-land-sync-card">
              <div className="rk-land-sync-head">
                <span>Connection Status</span>

                <strong>
                  <span className="rk-land-red-dot" />
                  Offline
                </strong>
              </div>

              <div className="rk-land-sync-center">
                <span className="rk-land-sync-icon">
                  <WifiOff size={30} />
                </span>

                <h3>Billing continues normally</h3>

                <p>
                  Your offline changes will be ready to synchronize when
                  the connection returns.
                </p>

                <div className="rk-land-pending">
                  <span>Pending changes</span>
                  <strong>3</strong>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section id="demo" className="rk-land-cta-section">
          <div className="rk-land-container">
            <div className="rk-land-cta">
              <div>
                <span>READY TO EXPLORE?</span>

                <h2>See RK BillPro in action.</h2>

                <p>
                  Open the interactive demo and explore billing,
                  inventory, sales, reports and settings.
                </p>
              </div>

              <button type="button" onClick={goLogin}>
                Open Live Demo
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="rk-land-footer">
        <div className="rk-land-container rk-land-footer-inner">
          <div className="rk-land-footer-brand">
            <span className="rk-land-logo">
              <ReceiptText size={20} />
            </span>

            <div>
              <strong>RK BillPro</strong>
              <small>Smart Billing Software</small>
            </div>
          </div>

          <p>© 2026 RK BillPro. Demo software.</p>
        </div>
      </footer>
    </div>
  )
}

type FeatureProps = {
  icon: React.ReactNode
  title: string
  description: string
}

function Feature({
  icon,
  title,
  description,
}: FeatureProps) {
  return (
    <article className="rk-land-feature">
      <span className="rk-land-feature-icon">
        {icon}
      </span>

      <h3>{title}</h3>

      <p>{description}</p>

      <span className="rk-land-feature-more">
        Learn more
        <ArrowRight size={14} />
      </span>
    </article>
  )
}