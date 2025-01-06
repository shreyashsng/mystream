'use client'
import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { signUp, signInWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signUp(email, password)
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An error occurred')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-gray-900/50 p-8 rounded-2xl border border-white/10">
        <div>
          <h1 className="text-3xl font-bold text-white text-center">
            my<span className="text-red-600">stream</span>
          </h1>
          <h2 className="mt-6 text-center text-2xl font-bold text-white">
            Create your account
          </h2>
        </div>

        {/* Google Sign In Button */}
        <div>
          <button
            onClick={handleGoogleSignIn}
            className="w-full py-3 px-4 rounded-lg bg-white hover:bg-gray-100 
                   text-gray-900 font-semibold transition-colors duration-200
                   flex items-center justify-center gap-2"
          >
            <img src="/google-icon.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-gray-900/50 text-gray-400">Or continue with</span>
          </div>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="text-red-500 text-center text-sm">{error}</div>
          )}
          <div className="space-y-4">
            <div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 
                        text-white placeholder-gray-400 focus:outline-none focus:border-red-600"
                placeholder="Email address"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 
                        text-white placeholder-gray-400 focus:outline-none focus:border-red-600"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full py-3 px-4 rounded-lg bg-red-600 hover:bg-red-700 
                     text-white font-semibold transition-colors duration-200"
            >
              Create account
            </button>
          </div>
        </form>

        <p className="text-center text-gray-400">
          Already have an account?{' '}
          <Link href="/login" className="text-red-600 hover:text-red-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
} 