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
      // Bonds I sent (as sister)
      const { data: sent } = await supabase
        .from('rakhi_bonds')
        .select(`
          id, message, created_at,
          sister:sister_id(name, email),
          brother:brother_id(name, email)
        `)
        .eq('sister_id', userId)

      // Bonds I received (as brother)
      const { data: received } = await supabase
        .from('rakhi_bonds')
        .select(`
          id, message, created_at,
          sister:sister_id(name, email),
          brother:brother_id(name, email)
        `)
        .eq('brother_id', userId)

      setSentBonds((sent as unknown as Bond[]) || [])
      setReceivedBonds((received as unknown as Bond[]) || [])
      setLoading(false)
    }

    fetchBonds()
  }, [userId])

  if (loading) return <p className="text-center text-gray-400 mt-8">Loading bonds...</p>

  return (
    <div className="mt-8 space-y-8">

      {/* Rakhi I tied */}
      <div>
        <h2 className="text-xl font-bold text-orange-500 mb-4">
          🪢 Rakhis I Tied
        </h2>
        {sentBonds.length === 0 ? (
          <p className="text-gray-400 text-sm">You haven't tied any Rakhis yet.</p>
        ) : (
          <div className="space-y-3">
            {sentBonds.map(bond => (
              <div key={bond.id} className="bg-white rounded-2xl shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-700">
                      To: {Array.isArray(bond.brother) ? bond.brother[0]?.name : (bond.brother as any)?.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {Array.isArray(bond.brother) ? bond.brother[0]?.email : (bond.brother as any)?.email}
                    </p>
                    {bond.message && (
                      <p className="text-sm text-gray-500 mt-1 italic">"{bond.message}"</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-300">
                    {new Date(bond.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Rakhi I received */}
      <div>
        <h2 className="text-xl font-bold text-pink-400 mb-4">
          💝 Rakhis I Received
        </h2>
        {receivedBonds.length === 0 ? (
          <p className="text-gray-400 text-sm">You haven't received any Rakhis yet.</p>
        ) : (
          <div className="space-y-3">
            {receivedBonds.map(bond => (
              <div key={bond.id} className="bg-white rounded-2xl shadow p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-700">
                      From: {Array.isArray(bond.sister) ? bond.sister[0]?.name : (bond.sister as any)?.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {Array.isArray(bond.sister) ? bond.sister[0]?.email : (bond.sister as any)?.email}
                    </p>
                    {bond.message && (
                      <p className="text-sm text-gray-500 mt-1 italic">"{bond.message}"</p>
                    )}
                  </div>
                  <p className="text-xs text-gray-300">
                    {new Date(bond.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  )
}