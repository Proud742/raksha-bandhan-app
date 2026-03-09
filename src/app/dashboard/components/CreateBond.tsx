'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function CreateBond({ sisterName }: { sisterName: string }) {
  const [brotherEmail, setBrotherEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCreateBond = async () => {
    setLoading(true)
    setStatus('')

    // Find brother by email
    console.log('Searching for email:', brotherEmail.trim())

    const { data: brotherProfile, error: findError } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', brotherEmail.trim())
        .single()

    console.log('Result:', brotherProfile, 'Error:', findError)

    if (findError || !brotherProfile) {
      setStatus('No user found with that email. They need to sign up first!')
      setLoading(false)
      return
    }

    // Get current user (sister)
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      setStatus('You must be logged in.')
      setLoading(false)
      return
    }

    // Check if bond already exists
    const { data: existing } = await supabase
      .from('rakhi_bonds')
      .select('*')
      .eq('sister_id', user.id)
      .eq('brother_id', brotherProfile.id)
      .single()

    if (existing) {
      setStatus('You already have a Rakhi bond with this person!')
      setLoading(false)
      return
    }

    // Create the bond
    const { error: bondError } = await supabase
      .from('rakhi_bonds')
      .insert({
        sister_id: user.id,
        brother_id: brotherProfile.id,
        message: message
      })

    if (bondError) setStatus(bondError.message)
    else setStatus(`🪢 Rakhi tied to ${brotherProfile.name} successfully!`)

    setLoading(false)
  }

  return (
    <div className="bg-white rounded-2xl shadow p-6 mt-8">
      <h2 className="text-xl font-bold text-orange-500 mb-1">🪢 Tie a Rakhi</h2>
      <p className="text-gray-500 text-sm mb-4">
        Enter your brother's email to create a bond
      </p>

      <input
        type="email"
        placeholder="Brother's email address"
        value={brotherEmail}
        onChange={(e) => setBrotherEmail(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:border-orange-400"
      />

      <textarea
        placeholder="Write a message (optional)"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-orange-400 resize-none h-24"
      />

      <button
        onClick={handleCreateBond}
        disabled={loading || !brotherEmail}
        className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
      >
        {loading ? 'Tying Rakhi...' : 'Tie Rakhi 🪢'}
      </button>

      {status && (
        <p className="text-center text-sm mt-3 text-gray-600">{status}</p>
      )}
    </div>
  )
}