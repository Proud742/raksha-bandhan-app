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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setAvatarFile(file)
    setPreview(URL.createObjectURL(file))
  }

  const handleSave = async () => {
    setLoading(true)
    setStatus('')

    let avatar_url = profile.avatar_url || ''

    // Upload photo if selected
    if (avatarFile) {
      const fileExt = avatarFile.name.split('.').pop()
      const filePath = `${profile.id}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { upsert: true })

      if (uploadError) {
        setStatus('Photo upload failed: ' + uploadError.message)
        setLoading(false)
        return
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)

      avatar_url = urlData.publicUrl
    }

    // Update profile
    console.log('Updating profile with:', { name, avatar_url, id: profile.id })

    const { data: updateData, error } = await supabase
    .from('profiles')
    .update({ name, avatar_url })
    .eq('id', profile.id)
    .select()

    console.log('Update result:', updateData, 'Error:', error)

    if (error) {
      setStatus(error.message)
    } else {
      setStatus('Profile updated! ✅')
      onUpdate({ ...profile, name, avatar_url })
    }

    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8">
      <h2 className="text-xl font-bold text-orange-500 mb-4">✏️ Edit Profile</h2>

      {/* Avatar preview */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden bg-orange-100 mb-3 flex items-center justify-center">
          {preview ? (
            <img src={preview} alt="avatar" className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">👤</span>
          )}
        </div>
        <label className="cursor-pointer text-sm text-orange-500 hover:underline">
          Change photo
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {/* Name */}
      <label className="text-sm text-gray-500 mb-1 block">Display Name</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-orange-400"
      />

      {/* Email (read only) */}
      <label className="text-sm text-gray-500 mb-1 block">Email (cannot change)</label>
      <input
        type="email"
        value={profile.email}
        disabled
        className="w-full border border-gray-200 rounded-lg px-4 py-2 mb-4 bg-gray-50 text-gray-400"
      />

      <button
        onClick={handleSave}
        disabled={loading || !name}
        className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>

      {status && (
        <p className="text-center text-sm mt-3 text-gray-600">{status}</p>
      )}
    </div>
  )
}