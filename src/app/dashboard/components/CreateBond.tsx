'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CreateBond({ sisterName }: { sisterName: string }) {
  const [brotherEmail, setBrotherEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('')
  const [loading, setLoading] = useState(false)
  const [showCelebration, setShowCelebration] = useState(false)
  const [bondedName, setBondedName] = useState('')

  const handleCreateBond = async () => {
    setLoading(true)
    setStatus('')
    setStatusType('')

    const { data: brotherProfile, error: findError } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', brotherEmail.trim())
      .single()

    if (findError || !brotherProfile) {
      setStatus('No user found with that email. They need to sign up first!')
      setStatusType('error')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setStatus('You must be logged in.')
      setStatusType('error')
      setLoading(false)
      return
    }

    const { data: existing } = await supabase
      .from('rakhi_bonds')
      .select('*')
      .eq('sister_id', user.id)
      .eq('brother_id', brotherProfile.id)
      .single()

    if (existing) {
      setStatus('You already have a Rakhi bond with this person!')
      setStatusType('error')
      setLoading(false)
      return
    }

    const { error: bondError } = await supabase
      .from('rakhi_bonds')
      .insert({ sister_id: user.id, brother_id: brotherProfile.id, message })

    if (bondError) {
      setStatus(bondError.message)
      setStatusType('error')
    } else {
      setBondedName(brotherProfile.name)
      setBrotherEmail('')
      setMessage('')
      setShowCelebration(true)
      setTimeout(() => setShowCelebration(false), 3500)
    }
    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yatra+One&family=Hind:wght@300;400;500;600&display=swap');

        .cb-wrap {
          font-family: 'Hind', sans-serif;
        }

        .cb-card {
          background: rgba(255,248,235,0.03);
          border: 1px solid rgba(212,120,0,0.25);
          border-radius: 20px;
          padding: 28px;
          position: relative;
          overflow: hidden;
        }

        .cb-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,180,50,0.6), transparent);
        }

        .cb-title {
          font-family: 'Yatra One', cursive;
          font-size: 1.4rem;
          color: #f59e0b;
          margin-bottom: 4px;
          text-shadow: 0 0 20px rgba(245,158,11,0.3);
        }

        .cb-subtitle {
          font-size: 0.82rem;
          color: rgba(255,200,100,0.4);
          margin-bottom: 24px;
          letter-spacing: 0.3px;
        }

        .cb-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          color: rgba(255,200,100,0.55);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .cb-input {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,120,0,0.25);
          border-radius: 10px;
          padding: 12px 16px;
          color: #fff8eb;
          font-family: 'Hind', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s;
          margin-bottom: 18px;
        }

        .cb-input::placeholder { color: rgba(255,200,100,0.2); }
        .cb-input:focus {
          border-color: rgba(245,158,11,0.6);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 0 3px rgba(245,158,11,0.08);
        }

        .cb-textarea {
          width: 100%;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(212,120,0,0.25);
          border-radius: 10px;
          padding: 12px 16px;
          color: #fff8eb;
          font-family: 'Hind', sans-serif;
          font-size: 0.95rem;
          outline: none;
          transition: all 0.2s;
          margin-bottom: 20px;
          resize: none;
          height: 100px;
        }

        .cb-textarea::placeholder { color: rgba(255,200,100,0.2); }
        .cb-textarea:focus {
          border-color: rgba(245,158,11,0.6);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 0 3px rgba(245,158,11,0.08);
        }

        .cb-btn {
          width: 100%;
          padding: 13px;
          background: linear-gradient(135deg, #c85000, #f59e0b);
          color: #1a0a00;
          border: none;
          border-radius: 10px;
          font-family: 'Hind', sans-serif;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 4px 20px rgba(200,80,0,0.35);
          letter-spacing: 0.3px;
        }

        .cb-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(200,80,0,0.5);
        }

        .cb-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .cb-status {
          margin-top: 14px;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 0.875rem;
          text-align: center;
        }

        .cb-status.success {
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.2);
          color: #fbbf24;
        }

        .cb-status.error {
          background: rgba(200,50,50,0.1);
          border: 1px solid rgba(200,50,50,0.2);
          color: #fca5a5;
        }

        /* Decorative rakhi threads */
        .cb-decoration {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 20px;
        }
        .cb-thread {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,120,0,0.3));
        }
        .cb-thread.right {
          background: linear-gradient(90deg, rgba(212,120,0,0.3), transparent);
        }
        .cb-dot { color: rgba(245,158,11,0.5); font-size: 0.6rem; }

        /* ── Celebration Overlay ── */
        .celebration-overlay {
          position: fixed;
          inset: 0;
          z-index: 1000;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(26,10,0,0.97);
          animation: fadeInOverlay 0.3s ease forwards;
        }

        @keyframes fadeInOverlay {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        .celebration-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background: linear-gradient(135deg, rgba(200,80,0,0.3), rgba(245,158,11,0.3));
          border: 3px solid #f59e0b;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: popIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
          box-shadow: 0 0 60px rgba(245,158,11,0.4), 0 0 120px rgba(245,158,11,0.15);
        }

        @keyframes popIn {
          0% { transform: scale(0); opacity: 0; }
          70% { transform: scale(1.15); }
          100% { transform: scale(1); opacity: 1; }
        }

        .celebration-checkmark {
          font-size: 3.5rem;
          animation: checkIn 0.4s ease 0.3s both;
        }

        @keyframes checkIn {
          from { transform: scale(0) rotate(-30deg); opacity: 0; }
          to { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        .celebration-title {
          font-family: 'Yatra One', cursive;
          font-size: 1.8rem;
          color: #f59e0b;
          margin-top: 28px;
          text-shadow: 0 0 30px rgba(245,158,11,0.5);
          animation: slideUp 0.4s ease 0.5s both;
          text-align: center;
        }

        .celebration-subtitle {
          font-family: 'Hind', sans-serif;
          font-size: 0.95rem;
          color: rgba(255,200,100,0.5);
          margin-top: 8px;
          animation: slideUp 0.4s ease 0.65s both;
          text-align: center;
        }

        @keyframes slideUp {
          from { transform: translateY(16px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }

        /* Confetti particles */
        .confetti-wrap {
          position: absolute;
          inset: 0;
          pointer-events: none;
          overflow: hidden;
        }

        .confetti-piece {
          position: absolute;
          top: -10px;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          animation: confettiFall linear forwards;
        }

        @keyframes confettiFall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }

      `}</style>

      <div className="cb-wrap">
        {showCelebration && (
          <div className="celebration-overlay">
            {/* Confetti */}
            <div className="confetti-wrap">
              {[...Array(30)].map((_, i) => (
                <div
                  key={i}
                  className="confetti-piece"
                  style={{
                    left: `${Math.random() * 100}%`,
                    background: ['#f59e0b','#c85000','#fb923c','#fbbf24','#fff8eb'][i % 5],
                    width: `${6 + Math.random() * 8}px`,
                    height: `${6 + Math.random() * 8}px`,
                    animationDuration: `${2 + Math.random() * 2}s`,
                    animationDelay: `${Math.random() * 0.8}s`,
                  }}
                />
              ))}
            </div>

            {/* Main content */}
            <div className="celebration-circle">
              <span className="celebration-checkmark">🪢</span>
            </div>
            <h2 className="celebration-title">Rakhi Tied!</h2>
            <p className="celebration-subtitle">
              Your bond with {bondedName} is now blessed ✦
            </p>
          </div>
        )}
        <div className="cb-card">
          <h2 className="cb-title">🪢 Tie a Rakhi</h2>
          <p className="cb-subtitle">Enter your brother's email to create a sacred bond</p>

          <div className="cb-decoration">
            <div className="cb-thread"></div>
            <span className="cb-dot">✦</span>
            <span className="cb-dot">✦</span>
            <span className="cb-dot">✦</span>
            <div className="cb-thread right"></div>
          </div>

          <label className="cb-label">Brother's Email</label>
          <input
            className="cb-input"
            type="email"
            placeholder="brother@example.com"
            value={brotherEmail}
            onChange={(e) => setBrotherEmail(e.target.value)}
          />

          <label className="cb-label">Your Message (optional)</label>
          <textarea
            className="cb-textarea"
            placeholder="Write something from the heart..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <button
            className="cb-btn"
            onClick={handleCreateBond}
            disabled={loading || !brotherEmail}
          >
            {loading ? 'Tying Rakhi...' : 'Tie Rakhi 🪢'}
          </button>

          {status && (
            <div className={`cb-status ${statusType}`}>{status}</div>
          )}
        </div>
      </div>
    </>
  )
}