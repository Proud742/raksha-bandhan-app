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
const router = useRouter()

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth')
        return
      }

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
    <div className="min-h-screen bg-orange-50 flex items-center justify-center">
      <p className="text-orange-400 text-lg">Loading...</p>
    </div>
  )

  return (
    <div className="min-h-screen bg-orange-50">
      
      {/* Navbar */}
      <div className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-orange-500">🪢 Raksha Bandhan</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full overflow-hidden bg-orange-100 flex items-center justify-center">
              {profile.avatar_url ? (
                <img src={profile.avatar_url} alt="avatar" className="w-full h-full object-cover" />
              ) : (
                <span className="text-sm">👤</span>
              )}
            </div>
            <span className="text-gray-600">Hey, {profile.name}!</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm text-red-400 hover:text-red-600"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-2xl mx-auto mt-12 px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-700 mb-2">
          Welcome, {profile.name}! 🎉
        </h2>
        <p className="text-gray-500">
          Your Raksha Bandhan dashboard is ready.
        </p>
        <CreateBond sisterName={profile.name} />
        <BondsList userId={profile.id} />
        <EditProfile 
          profile={profile} 
          onUpdate={(updated) => setProfile(updated)} 
        />
      </div>

    </div>
  )
}