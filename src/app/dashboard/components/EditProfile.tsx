'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

type Profile = {
  id: string
  name: string
  email: string
  avatar_url?: string
}

export default function EditProfile({ profile, onUpdate }: {
  profile: Profile
  onUpdate: (updated: Profile) => void
}) {
  const [name, setName] = useState(profile.name)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(profile.avatar_url || null)
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [statusType, setStatusType] = useState<'success' | 'error' | ''>('')

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setLoading(true)
    setStatus('')
    setStatusType('')

    let avatar_url = profile.avatar_url || ''

    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop()
      const filePath = `${profile.id}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { upsert: true })

      if (uploadError) {
        setStatus('Photo upload failed: ' + uploadError.message)
        setStatusType('error')
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      avatar_url = urlData.publicUrl
    }

    const { error } = await supabase
      .from('profiles')
      .update({ name, avatar_url })
      .eq('id', profile.id)
      .select()

    if (error) {
      setStatus(error.message)
      setStatusType('error')
    } else {
      setStatus('Profile updated successfully!')
      setStatusType('success')
      onUpdate({ ...profile, name, avatar_url })
    }

    setLoading(false)
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Yatra+One&family=Hind:wght@300;400;500;600&display=swap');

        .ep-wrap { font-family: 'Hind', sans-serif; }

        .ep-card {
          background: rgba(255,248,235,0.03);
          border: 1px solid rgba(212,120,0,0.25);
          border-radius: 20px;
          padding: 28px;
          position: relative;
          overflow: hidden;
        }

        .ep-card::before {
          content: '';
          position: absolute;
          top: 0; left: 10%; right: 10%;
          height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,180,50,0.6), transparent);
        }

        .ep-title {
          font-family: 'Yatra One', cursive;
          font-size: 1.4rem;
          color: #f59e0b;
          margin-bottom: 4px;
          text-shadow: 0 0 20px rgba(245,158,11,0.3);
        }

        .ep-subtitle {
          font-size: 0.82rem;
          color: rgba(255,200,100,0.4);
          margin-bottom: 28px;
        }

        /* Avatar section */
        .ep-avatar-section {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-bottom: 28px;
        }

        .ep-avatar-ring {
          position: relative;
          width: 96px;
          height: 96px;
          margin-bottom: 12px;
        }

        .ep-avatar-ring::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f59e0b, #c85000, #f59e0b);
          z-index: 0;
          animation: rotate-ring 4s linear infinite;
        }

        @keyframes rotate-ring {
          to { transform: rotate(360deg); }
        }

        .ep-avatar {
          position: relative;
          z-index: 1;
          width: 96px;
          height: 96px;
          border-radius: 50%;
          overflow: hidden;
          background: rgba(180,60,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          border: 3px solid #1a0a00;
        }

        .ep-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .ep-change-photo {
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.25);
          color: #f59e0b;
          font-family: 'Hind', sans-serif;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 6px 16px;
          border-radius: 20px;
          cursor: pointer;
          transition: all 0.2s;
          letter-spacing: 0.5px;
        }

        .ep-change-photo:hover {
          background: rgba(245,158,11,0.18);
          border-color: rgba(245,158,11,0.45);
        }

        .ep-label {
          display: block;
          font-size: 0.72rem;
          font-weight: 600;
          color: rgba(255,200,100,0.55);
          letter-spacing: 1.5px;
          text-transform: uppercase;
          margin-bottom: 8px;
        }

        .ep-input {
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

        .ep-input::placeholder { color: rgba(255,200,100,0.2); }

        .ep-input:focus {
          border-color: rgba(245,158,11,0.6);
          background: rgba(255,255,255,0.06);
          box-shadow: 0 0 0 3px rgba(245,158,11,0.08);
        }

        .ep-input:disabled {
          color: rgba(255,200,100,0.25);
          background: rgba(255,255,255,0.02);
          cursor: not-allowed;
        }

        .ep-input-note {
          font-size: 0.72rem;
          color: rgba(255,200,100,0.25);
          margin-top: -14px;
          margin-bottom: 18px;
          padding-left: 4px;
        }

        .ep-btn {
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

        .ep-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(200,80,0,0.5);
        }

        .ep-btn:disabled { opacity: 0.45; cursor: not-allowed; }

        .ep-status {
          margin-top: 14px;
          padding: 10px 16px;
          border-radius: 10px;
          font-size: 0.875rem;
          text-align: center;
        }

        .ep-status.success {
          background: rgba(245,158,11,0.1);
          border: 1px solid rgba(245,158,11,0.2);
          color: #fbbf24;
        }

        .ep-status.error {
          background: rgba(200,50,50,0.1);
          border: 1px solid rgba(200,50,50,0.2);
          color: #fca5a5;
        }

        .ep-divider {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 20px;
        }
        .ep-thread {
          flex: 1; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(212,120,0,0.3));
        }
        .ep-thread.right {
          background: linear-gradient(90deg, rgba(212,120,0,0.3), transparent);
        }
        .ep-dot { color: rgba(245,158,11,0.4); font-size: 0.6rem; }
      `}</style>

      <div className="ep-wrap">
        <div className="ep-card">
          <h2 className="ep-title">✏️ Edit Profile</h2>
          <p className="ep-subtitle">Update your name and profile photo</p>

          <div className="ep-divider">
            <div className="ep-thread"></div>
            <span className="ep-dot">✦</span>
            <span className="ep-dot">✦</span>
            <span className="ep-dot">✦</span>
            <div className="ep-thread right"></div>
          </div>

          {/* Avatar */}
          <div className="ep-avatar-section">
            <div className="ep-avatar-ring">
              <div className="ep-avatar">
                {preview
                  ? <img src={preview} alt="avatar" />
                  : '👤'}
              </div>
            </div>
            <label className="ep-change-photo">
              Change Photo
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Name */}
          <label className="ep-label">Display Name</label>
          <input
            className="ep-input"
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          {/* Email */}
          <label className="ep-label">Email Address</label>
          <input
            className="ep-input"
            type="email"
            value={profile.email}
            disabled
          />
          <p className="ep-input-note">Email cannot be changed</p>

          <button
            className="ep-btn"
            onClick={handleSave}
            disabled={loading || !name}
          >
            {loading ? 'Saving...' : 'Save Changes ✦'}
          </button>

          {status && (
            <div className={`ep-status ${statusType}`}>{status}</div>
          )}
        </div>
      </div>
    </>
  )
}