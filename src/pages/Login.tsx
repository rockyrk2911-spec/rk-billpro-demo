import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ReceiptText,
  ShieldCheck,
  Wifi,
  WifiOff,
} from 'lucide-react'

export default function Login() {
  const navigate = useNavigate()

  const [email, setEmail] = useState('demo@rkbillpro.com')
  const [password, setPassword] = useState('12345678')
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(true)

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    navigate('/dashboard')
  }

  return (
    <div className="rk-login-page">

      {/* LEFT SIDE */}
      <section className="rk-login-showcase">

        <div className="rk-login-showcase-inner">

          <button
            type="button"
            className="rk-login-brand"
            onClick={() => navigate('/')}
          >
            <span className="rk-login-brand-icon">
              <ReceiptText size={25} />
            </span>

            <span>
              <strong>RK BillPro</strong>
              <small>Smart Billing Software</small>
            </span>
          </button>

          <div className="rk-login-hero">

            <span className="rk-login-badge">
              <ShieldCheck size={16} />
              Simple • Fast • Reliable
            </span>

            <h1>
              Run your business
              <span> smarter every day.</span>
            </h1>

            <p>
              Billing, inventory, customers, purchases and reports —
              everything your business needs in one powerful platform.
            </p>

            <div className="rk-login-feature-list">

              <div className="rk-login-feature">
                <span>
                  <ReceiptText size={21} />
                </span>

                <div>
                  <strong>Fast POS Billing</strong>
                  <p>Create professional bills in seconds.</p>
                </div>
              </div>

              <div className="rk-login-feature">
                <span>
                  <WifiOff size={21} />
                </span>

                <div>
                  <strong>Works Offline</strong>
                  <p>Continue billing even without internet.</p>
                </div>
              </div>

              <div className="rk-login-feature">
                <span>
                  <BarChart3 size={21} />
                </span>

                <div>
                  <strong>Business Insights</strong>
                  <p>Track sales, stock and business performance.</p>
                </div>
              </div>

            </div>
          </div>

          <div className="rk-login-showcase-footer">
            <Wifi size={15} />
            <span>Secure business workspace</span>
          </div>

        </div>
      </section>


      {/* RIGHT SIDE */}
      <section className="rk-login-form-side">

        <div className="rk-login-mobile-brand">
          <span className="rk-login-brand-icon">
            <ReceiptText size={23} />
          </span>

          <div>
            <strong>RK BillPro</strong>
            <small>Smart Billing Software</small>
          </div>
        </div>

        <div className="rk-login-card">

          <div className="rk-login-heading">
            <span className="rk-login-welcome-icon">
              <LockKeyhole size={20} />
            </span>

            <h2>Welcome back</h2>

            <p>
              Sign in to continue to your RK BillPro dashboard.
            </p>
          </div>


          <form
            className="rk-login-form"
            onSubmit={handleSubmit}
          >

            <div className="rk-login-field">
              <label htmlFor="rk-login-email">
                Email address
              </label>

              <div className="rk-login-input-wrap">
                <Mail size={19} />

                <input
                  id="rk-login-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Enter your email"
                  autoComplete="email"
                  required
                />
              </div>
            </div>


            <div className="rk-login-field">
              <div className="rk-login-label-row">
                <label htmlFor="rk-login-password">
                  Password
                </label>

                <button
                  type="button"
                  className="rk-login-forgot"
                >
                  Forgot password?
                </button>
              </div>

              <div className="rk-login-input-wrap">
                <LockKeyhole size={19} />

                <input
                  id="rk-login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                />

                <button
                  type="button"
                  className="rk-login-password-toggle"
                  onClick={() =>
                    setShowPassword((value) => !value)
                  }
                  aria-label={
                    showPassword
                      ? 'Hide password'
                      : 'Show password'
                  }
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>


            <label className="rk-login-remember">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(event) =>
                  setRememberMe(event.target.checked)
                }
              />

              <span>Remember me</span>
            </label>


            <button
              type="submit"
              className="rk-login-submit"
            >
              <span>Sign In</span>
              <ArrowRight size={19} />
            </button>

          </form>


          <div className="rk-login-demo-box">

            <div className="rk-login-demo-title">
              <CheckCircle2 size={18} />
              <strong>Live Demo Account</strong>
            </div>

            <div className="rk-login-demo-credentials">

              <div>
                <span>Email</span>
                <strong>demo@rkbillpro.com</strong>
              </div>

              <div>
                <span>Password</span>
                <strong>12345678</strong>
              </div>

            </div>

          </div>


          <p className="rk-login-help">
            Need help?{' '}
            <button type="button">
              Contact Support
            </button>
          </p>

        </div>

        <p className="rk-login-copyright">
          © 2026 RK BillPro. Demo software.
        </p>

      </section>

    </div>
  )
}