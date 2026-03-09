'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/dist/client/components/navigation'


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
      // Login
      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) setMessage(error.message)
      else router.push('/dashboard')
    } else {
      // Signup
      const { data, error } = await supabase.auth.signUp({ email, password })
      if (error) {
        setMessage(error.message)
      } else if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({ id: data.user.id, name, email })
        if (profileError) setMessage(profileError.message)
        else setMessage('Account created! Check your email to confirm.')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
        
        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-orange-500 mb-2">
          🪢 Raksha Bandhan
        </h1>
        <p className="text-center text-gray-500 mb-6">
          {isLogin ? 'Welcome back!' : 'Create your account'}
        </p>

        {/* Name field (signup only) */}
        {!isLogin && (
          <input
            type="text"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:border-orange-400"
          />
        )}

        {/* Email */}
        <input
          type="email"
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-3 focus:outline-none focus:border-orange-400"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-4 py-2 mb-4 focus:outline-none focus:border-orange-400"
        />

        {/* Button */}
        <button
          onClick={handleAuth}
          disabled={loading}
          className="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-600 transition disabled:opacity-50"
        >
          {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
        </button>

        {/* Message */}
        {message && (
          <p className="text-center text-sm mt-3 text-gray-600">{message}</p>
        )}

        {/* Toggle */}
        <p className="text-center text-sm mt-4 text-gray-500">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-orange-500 font-semibold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>

      </div>
    </div>
  )
}