'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import CreateBond from './components/CreateBond'
import BondsList from './components/BondsList'
import EditProfile from './components/EditProfile'

export default function Dashboard() {
  const [profile, setProfile] = useState<{
    id: string
    name: string
    email: string
    avatar_url?: string
  } | null>(null)
  const [activeTab, setActiveTab] = useState<'bonds' | 'tie' | 'profile'>('bonds')
  const router = useRouter()

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth'); return }
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
      setProfile(data)
    }
    getProfile()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (!profile) return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yatra+One&family=Hind:wght@300;400;500;600&display=swap');
        body { margin: 0; background: #1a0a00; }
        .loader {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          font-family: 'Hind', sans-serif;
          background: #1a0a00;
        }
        .loader-ring {
          width: 48px; height: 48px;
          border-radius: 50%;
          border: 3px solid rgba(245,158,11,0.15);
          border-top-color: #f59e0b;
          animation: spin 0.8s linear infinite;
        }
        .loader-text {
          color: rgba(245,158,11,0.5);
          margin-top: 16px;
          font-size: 0.85rem;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
      <div className="loader">
        <div className="loader-ring"></div>
        <p className="loader-text">Loading...</p>
      </div>
    </>
  )

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yatra+One&family=Hind:wght@300;400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        .dash-root {
          min-height: 100vh;
          background-color: #1a0a00;
          background-image:
            radial-gradient(ellipse at 0% 0%, rgba(180,60,0,0.25) 0%, transparent 50%),
            radial-gradient(ellipse at 100% 100%, rgba(212,120,0,0.15) 0%, transparent 50%);
          font-family: 'Hind', sans-serif;
          color: #fff8eb;
        }

        /* ── Navbar ── */
        .navbar {
          position: sticky;
          top: 0;
          z-index: 50;
          background: rgba(26,10,0,0.85);
          backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(212,120,0,0.2);
          padding: 0 24px;
          height: 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .navbar-brand {
          font-family: 'Yatra One', cursive;
          font-size: 1.3rem;
          color: #f59e0b;
          text-shadow: 0 0 20px rgba(245,158,11,0.4);
          letter-spacing: 0.5px;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .navbar-avatar {
          width: 36px; height: 36px;
          border-radius: 50%;
          overflow: hidden;
          border: 2px solid rgba(245,158,11,0.4);
          background: rgba(180,60,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1rem;
        }

        .navbar-avatar img { width: 100%; height: 100%; object-fit: cover; }

        .navbar-name {
          font-size: 0.9rem;
          color: rgba(255,220,150,0.7);
          font-weight: 500;
        }

        .logout-btn {
          background: rgba(200,80,0,0.15);
          border: 1px solid rgba(200,80,0,0.3);
          color: rgba(255,150,100,0.8);
          font-family: 'Hind', sans-serif;
          font-size: 0.8rem;
          padding: 6px 14px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.5px;
        }
        .logout-btn:hover {
          background: rgba(200,80,0,0.3);
          color: #ff9966;
        }

        /* ── Hero ── */
        .hero {
          text-align: center;
          padding: 48px 24px 32px;
          position: relative;
        }

        .hero::after {
          content: '';
          position: absolute;
          bottom: 0; left: 20%; right: 20%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,120,0,0.3), transparent);
        }

        .hero-greeting {
          font-size: 0.8rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          color: rgba(245,158,11,0.5);
          margin-bottom: 10px;
        }

        .hero-name {
          font-family: 'Yatra One', cursive;
          font-size: 2.4rem;
          color: #f59e0b;
          text-shadow: 0 0 40px rgba(245,158,11,0.3);
          line-height: 1.2;
        }

        .hero-sub {
          font-size: 0.9rem;
          color: rgba(255,220,150,0.4);
          margin-top: 8px;
        }

        /* ── Tabs ── */
        .tabs-container {
          display: flex;
          justify-content: center;
          padding: 28px 24px 0;
          gap: 8px;
        }

        .tab-btn {
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(212,120,0,0.2);
          color: rgba(255,200,100,0.45);
          font-family: 'Hind', sans-serif;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 10px 22px;
          border-radius: 24px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.5px;
        }

        .tab-btn:hover {
          border-color: rgba(245,158,11,0.4);
          color: rgba(255,200,100,0.7);
        }

        .tab-btn.active {
          background: linear-gradient(135deg, rgba(200,80,0,0.4), rgba(245,158,11,0.3));
          border-color: rgba(245,158,11,0.5);
          color: #f59e0b;
          box-shadow: 0 0 20px rgba(245,158,11,0.15);
        }

        /* ── Content ── */
        .content {
          max-width: 560px;
          margin: 0 auto;
          padding: 28px 20px 60px;
        }

        /* ── Override child component styles ── */
        .content input, .content textarea {
          background: rgba(255,255,255,0.04) !important;
          border: 1px solid rgba(212,120,0,0.25) !important;
          border-radius: 10px !important;
          color: #fff8eb !important;
          font-family: 'Hind', sans-serif !important;
          padding: 12px 16px !important;
          width: 100% !important;
          outline: none !important;
          transition: all 0.2s !important;
        }
        .content input::placeholder, .content textarea::placeholder {
          color: rgba(255,200,100,0.25) !important;
        }
        .content input:focus, .content textarea:focus {
          border-color: rgba(245,158,11,0.6) !important;
          box-shadow: 0 0 0 3px rgba(245,158,11,0.1) !important;
        }
        .content input:disabled {
          background: rgba(255,255,255,0.02) !important;
          color: rgba(255,200,100,0.3) !important;
        }

        .content button[class*="bg-orange"] {
          background: linear-gradient(135deg, #c85000, #f59e0b) !important;
          color: #1a0a00 !important;
          border: none !important;
          border-radius: 10px !important;
          font-family: 'Hind', sans-serif !important;
          font-weight: 600 !important;
          padding: 12px !important;
          width: 100% !important;
          cursor: pointer !important;
          transition: all 0.2s !important;
          box-shadow: 0 4px 20px rgba(200,80,0,0.3) !important;
        }

        .content h2[class*="text-orange"] {
          font-family: 'Yatra One', cursive !important;
          color: #f59e0b !important;
          font-size: 1.3rem !important;
        }

        /* Cards */
        .content > div > div {
          background: rgba(255,248,235,0.03) !important;
          border: 1px solid rgba(212,120,0,0.2) !important;
          border-radius: 16px !important;
        }

        /* Bond cards */
        .content p[class*="text-gray-700"] { color: #fff8eb !important; }
        .content p[class*="text-gray-500"] { color: rgba(255,200,100,0.5) !important; }
        .content p[class*="text-gray-400"] { color: rgba(255,200,100,0.35) !important; }
        .content p[class*="text-gray-300"] { color: rgba(255,200,100,0.25) !important; }
        .content span[class*="text-gray"] { color: rgba(255,200,100,0.4) !important; }
        .content label { color: rgba(255,200,100,0.6) !important; }

        /* Section headings */
        .content h2[class*="text-pink"] {
          font-family: 'Yatra One', cursive !important;
          color: #fb923c !important;
          font-size: 1.3rem !important;
        }

        /* Decorative bottom border on cards */
        .content .bg-white {
          background: rgba(255,248,235,0.03) !important;
          border: 1px solid rgba(212,120,0,0.2) !important;
          border-radius: 16px !important;
          box-shadow: 0 4px 24px rgba(0,0,0,0.2) !important;
        }
      `}</style>

      <div className="dash-root">

        {/* Navbar */}
        <nav className="navbar">
          <span className="navbar-brand">
            <img src="/rakhi.png" alt="rakhi" style={{ width: '28px', height: 'auto', display: 'inline', verticalAlign: 'middle', marginRight: '8px' }} />
            Raksha Bandhan
          </span>
          <div className="navbar-right">
            <div className="navbar-avatar">
              {profile.avatar_url
                ? <img src={profile.avatar_url} alt="avatar" />
                : '👤'}
            </div>
            <span className="navbar-name">{profile.name}</span>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </nav>

        {/* Hero */}
        <div className="hero">
          <p className="hero-greeting">Welcome back</p>
          <h1 className="hero-name">{profile.name}</h1>
          <p className="hero-sub">May your bonds remain forever blessed ✦</p>
        </div>

        {/* Tabs */}
        <div className="tabs-container">
          <button
            className={`tab-btn ${activeTab === 'bonds' ? 'active' : ''}`}
            onClick={() => setActiveTab('bonds')}
          >
            💝 My Bonds
          </button>
          <button
            className={`tab-btn ${activeTab === 'tie' ? 'active' : ''}`}
            onClick={() => setActiveTab('tie')}
          >
            🪢 Tie Rakhi
          </button>
          <button
            className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            ✏️ Profile
          </button>
        </div>

        {/* Tab Content */}
        <div className="content">
          {activeTab === 'bonds' && <BondsList userId={profile.id} />}
          {activeTab === 'tie' && <CreateBond sisterName={profile.name} />}
          {activeTab === 'profile' && (
            <EditProfile
              profile={profile}
              onUpdate={(updated) => setProfile(updated)}
            />
          )}
        </div>

      </div>
    </>
  )
}