'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Bond = {
  id: string
  message: string
  created_at: string
  sister: { name: string; email: string }
  brother: { name: string; email: string }
}

export default function BondsList({ userId }: { userId: string }) {
  const [sentBonds, setSentBonds] = useState<Bond[]>([])
  const [receivedBonds, setReceivedBonds] = useState<Bond[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBonds = async () => {
      const { data: sent } = await supabase
        .from('rakhi_bonds')
        .select(`id, message, created_at, sister:sister_id(name, email), brother:brother_id(name, email)`)
        .eq('sister_id', userId)

      const { data: received } = await supabase
        .from('rakhi_bonds')
        .select(`id, message, created_at, sister:sister_id(name, email), brother:brother_id(name, email)`)
        .eq('brother_id', userId)

      setSentBonds((sent as unknown as Bond[]) || [])
      setReceivedBonds((received as unknown as Bond[]) || [])
      setLoading(false)
    }
    fetchBonds()
  }, [userId])

  const getName = (person: any) =>
    Array.isArray(person) ? person[0]?.name : person?.name

  const getEmail = (person: any) =>
    Array.isArray(person) ? person[0]?.email : person?.email

  if (loading) return (
    <>
      <style>{`
        .bl-loading {
          text-align: center;
          padding: 48px 0;
          color: rgba(245,158,11,0.4);
          font-family: 'Hind', sans-serif;
          font-size: 0.85rem;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
      `}</style>
      <p className="bl-loading">Loading bonds...</p>
    </>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yatra+One&family=Hind:wght@300;400;500;600&display=swap');

        .bl-wrap { font-family: 'Hind', sans-serif; }

        .bl-section { margin-bottom: 36px; }

        .bl-section-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
        }

        .bl-section-title {
          font-family: 'Yatra One', cursive;
          font-size: 1.3rem;
          text-shadow: 0 0 20px rgba(245,158,11,0.3);
        }

        .bl-section-title.sent { color: #f59e0b; }
        .bl-section-title.received { color: #fb923c; }

        .bl-count {
          background: rgba(245,158,11,0.12);
          border: 1px solid rgba(245,158,11,0.2);
          color: rgba(245,158,11,0.7);
          font-size: 0.72rem;
          font-weight: 600;
          padding: 2px 10px;
          border-radius: 20px;
          letter-spacing: 0.5px;
        }

        .bl-empty {
          text-align: center;
          padding: 32px 20px;
          background: rgba(255,248,235,0.02);
          border: 1px dashed rgba(212,120,0,0.2);
          border-radius: 16px;
          color: rgba(255,200,100,0.3);
          font-size: 0.875rem;
        }

        .bl-empty-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 8px;
          opacity: 0.4;
        }

        .bl-card {
          background: rgba(255,248,235,0.03);
          border: 1px solid rgba(212,120,0,0.2);
          border-radius: 16px;
          padding: 18px 20px;
          margin-bottom: 12px;
          position: relative;
          overflow: hidden;
          transition: border-color 0.2s, transform 0.2s;
        }

        .bl-card:hover {
          border-color: rgba(245,158,11,0.35);
          transform: translateY(-1px);
        }

        .bl-card::before {
          content: '';
          position: absolute;
          left: 0; top: 20%; bottom: 20%;
          width: 3px;
          border-radius: 0 3px 3px 0;
        }

        .bl-card.sent::before { background: linear-gradient(180deg, #f59e0b, #c85000); }
        .bl-card.received::before { background: linear-gradient(180deg, #fb923c, #dc2626); }

        .bl-card-top {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 12px;
        }

        .bl-card-left { flex: 1; padding-left: 8px; }

        .bl-direction {
          font-size: 0.7rem;
          font-weight: 600;
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .bl-direction.sent { color: rgba(245,158,11,0.5); }
        .bl-direction.received { color: rgba(251,146,60,0.5); }

        .bl-person-name {
          font-size: 1rem;
          font-weight: 600;
          color: #fff8eb;
          margin-bottom: 2px;
        }

        .bl-person-email {
          font-size: 0.78rem;
          color: rgba(255,200,100,0.35);
        }

        .bl-date {
          font-size: 0.72rem;
          color: rgba(255,200,100,0.25);
          white-space: nowrap;
          margin-top: 2px;
        }

        .bl-message {
          margin-top: 12px;
          padding: 10px 14px;
          padding-left: 22px;
          background: rgba(245,158,11,0.05);
          border-left: 2px solid rgba(245,158,11,0.2);
          border-radius: 0 8px 8px 0;
          font-size: 0.85rem;
          color: rgba(255,220,150,0.55);
          font-style: italic;
        }

        .bl-divider {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 28px 0;
        }
        .bl-divider-line {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,120,0,0.2));
        }
        .bl-divider-line.right {
          background: linear-gradient(90deg, rgba(212,120,0,0.2), transparent);
        }
        .bl-divider-dot { color: rgba(245,158,11,0.3); font-size: 0.5rem; }
      `}</style>

      <div className="bl-wrap">

        {/* Sent bonds */}
        <div className="bl-section">
          <div className="bl-section-header">
            <h2 className="bl-section-title sent">🪢 Rakhis I Tied</h2>
            <span className="bl-count">{sentBonds.length}</span>
          </div>

          {sentBonds.length === 0 ? (
            <div className="bl-empty">
              <span className="bl-empty-icon">🪢</span>
              You haven't tied any Rakhis yet
            </div>
          ) : (
            sentBonds.map(bond => (
              <div key={bond.id} className="bl-card sent">
                <div className="bl-card-top">
                  <div className="bl-card-left">
                    <p className="bl-direction sent">Tied to</p>
                    <p className="bl-person-name">{getName(bond.brother)}</p>
                    <p className="bl-person-email">{getEmail(bond.brother)}</p>
                  </div>
                  <p className="bl-date">
                    {new Date(bond.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
                {bond.message && (
                  <div className="bl-message">"{bond.message}"</div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Divider */}
        <div className="bl-divider">
          <div className="bl-divider-line"></div>
          <span className="bl-divider-dot">✦</span>
          <span className="bl-divider-dot">✦</span>
          <span className="bl-divider-dot">✦</span>
          <div className="bl-divider-line right"></div>
        </div>

        {/* Received bonds */}
        <div className="bl-section">
          <div className="bl-section-header">
            <h2 className="bl-section-title received">💝 Rakhis I Received</h2>
            <span className="bl-count">{receivedBonds.length}</span>
          </div>

          {receivedBonds.length === 0 ? (
            <div className="bl-empty">
              <span className="bl-empty-icon">💝</span>
              You haven't received any Rakhis yet
            </div>
          ) : (
            receivedBonds.map(bond => (
              <div key={bond.id} className="bl-card received">
                <div className="bl-card-top">
                  <div className="bl-card-left">
                    <p className="bl-direction received">Received from</p>
                    <p className="bl-person-name">{getName(bond.sister)}</p>
                    <p className="bl-person-email">{getEmail(bond.sister)}</p>
                  </div>
                  <p className="bl-date">
                    {new Date(bond.created_at).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', year: 'numeric'
                    })}
                  </p>
                </div>
                {bond.message && (
                  <div className="bl-message">"{bond.message}"</div>
                )}
              </div>
            ))
          )}
        </div>

      </div>
    </>
  )
}