'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

function SignupForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialRole = searchParams.get('role') === 'client' ? 'client' : 'freelancer'

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: initialRole as 'freelancer' | 'client',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const res = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Signup failed')
      setLoading(false)
      return
    }

    // Sign in after account creation
    const supabase = createClient()
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: formData.email,
      password: formData.password,
    })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push(formData.role === 'client' ? '/client/dashboard' : '/freelancer/dashboard')
  }

  const handleGoogleSignup = async () => {
    const supabase = createClient()
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Link href="/" className="text-amber-500 font-bold text-xl block mb-10">
          Flarefix
        </Link>

        <h1 className="text-3xl font-bold mb-2">Create your account</h1>
        <p className="text-gray-400 mb-8">
          Already have one?{' '}
          <Link href="/auth/login" className="text-amber-500 hover:text-amber-400">
            Log in
          </Link>
        </p>

        {/* Role selector */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {(['freelancer', 'client'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setFormData({ ...formData, role: r })}
              className={`p-4 rounded-lg border text-left transition-colors ${
                formData.role === r
                  ? 'border-amber-500 bg-amber-500/10'
                  : 'border-[#2d3748] bg-[#1a2235] hover:border-gray-500'
              }`}
            >
              <div className="font-semibold capitalize mb-1">{r}</div>
              <div className="text-xs text-gray-400">
                {r === 'freelancer' ? 'Find work and get paid' : 'Post jobs and hire talent'}
              </div>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full name"
            type="text"
            placeholder="Your full name"
            value={formData.full_name}
            onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <Input
            label="Password"
            type="password"
            placeholder="Minimum 8 characters"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            minLength={8}
            required
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <Button type="submit" loading={loading} className="w-full">
            Create account
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#2d3748]"></div>
          </div>
          <div className="relative flex justify-center text-xs uppercase text-gray-500 bg-[#0a0e1a] px-4">
            or
          </div>
        </div>

        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 border border-[#2d3748] rounded-lg py-3 text-gray-300 hover:border-gray-500 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  )
}

export default function SignupPage() {
  return (
    <Suspense>
      <SignupForm />
    </Suspense>
  )
}
