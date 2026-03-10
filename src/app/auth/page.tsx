'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleAuth = async () => {
    setLoading(true)
    setMessage('')

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else router.push('/dashboard')
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage(error.message)
      } else if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ id: data.user.id, name, email })
        if (profileError) setMessage(profileError.message)
        else setMessage('Account created! You can now log in.')
      }
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yatra+One&family=Hind:wght@300;400;500;600&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        .auth-root {
          min-height: 100vh;
          background-color: #1a0a00;
          background-image:
            radial-gradient(ellipse at 20% 50%, rgba(180, 60, 0, 0.3) 0%, transparent 60%),
            radial-gradient(ellipse at 80% 20%, rgba(212, 120, 0, 0.2) 0%, transparent 50%),
            radial-gradient(ellipse at 60% 80%, rgba(150, 30, 0, 0.25) 0%, transparent 50%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          font-family: 'Hind', sans-serif;
          position: relative;
          overflow: hidden;
        }

        /* Decorative floating diyas */
        .diya {
          position: absolute;
          font-size: 1.5rem;
          opacity: 0.15;
          animation: float 6s ease-in-out infinite;
        }
        .diya:nth-child(1) { top: 10%; left: 8%; animation-delay: 0s; }
        .diya:nth-child(2) { top: 20%; right: 10%; animation-delay: 1s; font-size: 1rem; }
        .diya:nth-child(3) { bottom: 15%; left: 12%; animation-delay: 2s; font-size: 1.2rem; }
        .diya:nth-child(4) { bottom: 25%; right: 8%; animation-delay: 3s; }
        .diya:nth-child(5) { top: 50%; left: 3%; animation-delay: 1.5s; font-size: 0.9rem; }
        .diya:nth-child(6) { top: 40%; right: 4%; animation-delay: 2.5s; font-size: 1.1rem; }

        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50% { transform: translateY(-12px) rotate(5deg); }
        }

        /* Mandala top decoration */
        .mandala-top {
          position: absolute;
          top: -80px;
          left: 50%;
          transform: translateX(-50%);
          width: 200px;
          height: 200px;
          border-radius: 50%;
          border: 1px solid rgba(212, 120, 0, 0.3);
          box-shadow:
            0 0 0 20px rgba(212,120,0,0.05),
            0 0 0 40px rgba(212,120,0,0.03),
            0 0 0 60px rgba(212,120,0,0.02);
        }

        .card {
          position: relative;
          background: rgba(255, 248, 235, 0.04);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 120, 0, 0.25);
          border-radius: 24px;
          padding: 48px 40px 40px;
          width: 100%;
          max-width: 420px;
          box-shadow:
            0 0 60px rgba(180, 60, 0, 0.15),
            0 32px 64px rgba(0,0,0,0.4),
            inset 0 1px 0 rgba(255,220,100,0.1);
          overflow: hidden;
        }

        /* Top border glow */
        .card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255, 180, 50, 0.8), transparent);
        }

        /* Bottom decorative border */
        .card::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 3px;
          background: linear-gradient(90deg, transparent, #c85000, #f59e0b, #c85000, transparent);
        }

        .header {
          text-align: center;
          margin-bottom: 36px;
        }

        .rakhi-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
          }

          .rakhi-svg {
            animation: pulse-glow 3s ease-in-out infinite;
            filter: drop-shadow(0 0 10px rgba(255,160,50,0.5));
          }

          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .rakhi-outer-ring {
            animation: spin-slow 20s linear infinite;
            transform-origin: center;
          }

        @keyframes pulse-glow {
          0%, 100% { filter: drop-shadow(0 0 12px rgba(255,160,50,0.6)); }
          50% { filter: drop-shadow(0 0 20px rgba(255,160,50,0.9)); }
        }

        .title {
          font-family: 'Yatra One', cursive;
          font-size: 2rem;
          color: #f59e0b;
          letter-spacing: 1px;
          line-height: 1.2;
          text-shadow: 0 0 30px rgba(245, 158, 11, 0.4);
        }

        .subtitle {
          font-size: 0.85rem;
          color: rgba(255, 220, 150, 0.5);
          margin-top: 6px;
          letter-spacing: 2px;
          text-transform: uppercase;
        }

        /* Decorative divider */
        .divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 28px;
        }
        .divider-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,120,0,0.4));
        }
        .divider-line.right {
          background: linear-gradient(90deg, rgba(212,120,0,0.4), transparent);
        }
        .divider-dot { color: #f59e0b; font-size: 0.7rem; }

        .form-group {
          margin-bottom: 16px;
        }

        .form-label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: rgba(255, 200, 100, 0.7);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .form-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(212, 120, 0, 0.25);
          border-radius: 10px;
          padding: 12px 16px;
          color: #fff8eb;
          font-family: 'Hind', sans-serif;
          font-size: 0.95rem;
          transition: all 0.2s;
          outline: none;
        }

        .form-input::placeholder { color: rgba(255,200,100,0.25); }

        .form-input:focus {
          border-color: rgba(245, 158, 11, 0.6);
          background: rgba(255, 255, 255, 0.07);
          box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.1);
        }

        .btn {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 10px;
          font-family: 'Hind', sans-serif;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
          margin-top: 8px;
          letter-spacing: 0.5px;
          position: relative;
          overflow: hidden;
        }

        .btn-primary {
          background: linear-gradient(135deg, #c85000, #f59e0b);
          color: #1a0a00;
          box-shadow: 0 4px 20px rgba(200, 80, 0, 0.4);
        }

        .btn-primary:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(200, 80, 0, 0.55);
        }

        .btn-primary:active:not(:disabled) { transform: translateY(0); }
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }

        .message {
          text-align: center;
          font-size: 0.85rem;
          color: rgba(255, 200, 100, 0.8);
          margin-top: 14px;
          padding: 10px 14px;
          background: rgba(245, 158, 11, 0.08);
          border-radius: 8px;
          border: 1px solid rgba(245, 158, 11, 0.15);
        }

        .toggle-text {
          text-align: center;
          font-size: 0.85rem;
          color: rgba(255, 200, 100, 0.45);
          margin-top: 20px;
        }

        .toggle-btn {
          background: none;
          border: none;
          color: #f59e0b;
          font-family: 'Hind', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          padding: 0;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        .toggle-btn:hover { color: #fbbf24; }

        /* Slide in animation */
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .card { animation: slideUp 0.5s ease forwards; }
      `}</style>

      <div className="auth-root">
        {/* Floating diyas */}
        <span className="diya">🪔</span>
        <span className="diya">✨</span>
        <span className="diya">🪔</span>
        <span className="diya">✨</span>
        <span className="diya">🌸</span>
        <span className="diya">🌸</span>

        <div className="card">
          <div className="header">
            <div className="rakhi-icon">
              <img src="/rakhi.png" alt="rakhi" style={{ width: '100px', height: 'auto', filter: 'drop-shadow(0 0 16px rgba(245,158,11,0.5))', animation: 'pulse-glow 3s ease-in-out infinite' }} />
            </div>
            <h1 className="title">Raksha Bandhan</h1>
            <p className="subtitle">Celebrate the bond</p>
          </div>

          <div className="divider">
            <div className="divider-line"></div>
            <span className="divider-dot">✦</span>
            <span className="divider-dot">✦</span>
            <span className="divider-dot">✦</span>
            <div className="divider-line right"></div>
          </div>

          {!isLogin && (
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input
                className="form-input"
                type="text"
                placeholder="e.g. Priya Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            className="btn btn-primary"
            onClick={handleAuth}
            disabled={loading}
          >
            {loading ? 'Please wait...' : isLogin ? 'Enter the Celebration →' : 'Create Account →'}
          </button>

          {message && <p className="message">{message}</p>}

          <p className="toggle-text">
            {isLogin ? "New here? " : "Already have an account? "}
            <button className="toggle-btn" onClick={() => { setIsLogin(!isLogin); setMessage('') }}>
              {isLogin ? 'Create an account' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </>
  )
}