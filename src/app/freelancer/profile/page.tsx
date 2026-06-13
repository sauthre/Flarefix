'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import Navbar from '@/components/ui/Navbar'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'

export default function FreelancerProfilePage() {
  const router = useRouter()
  const [portfolioUrl, setPortfolioUrl] = useState('')
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [fullName, setFullName] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/auth/login'); return }

      const res = await fetch('/api/freelancer/profile')
      if (res.ok) {
        const data = await res.json()
        setPortfolioUrl(data.portfolio_url || '')
        setLinkedinUrl(data.linkedin_url || '')
        setFullName(data.full_name || '')
      }
      setLoading(false)
    }
    fetchProfile()
  }, [router])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setError('')
    setSuccess(false)

    const res = await fetch('/api/freelancer/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ portfolio_url: portfolioUrl, linkedin_url: linkedinUrl }),
    })

    if (res.ok) {
      setSuccess(true)
    } else {
      const data = await res.json()
      setError(data.error || 'Save failed')
    }
    setSaving(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-white">
        <Navbar role="freelancer" />
        <div className="max-w-2xl mx-auto px-6 py-20 text-gray-400">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Navbar role="freelancer" />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Your Profile</h1>
        <p className="text-gray-400 mb-10">V1 trust layers: portfolio and LinkedIn links.</p>

        <Card>
          <form onSubmit={handleSave} className="space-y-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Name</p>
              <p className="text-white font-medium">{fullName || 'Not set'}</p>
            </div>

            <Input
              label="Portfolio URL"
              type="url"
              placeholder="https://yourportfolio.com"
              value={portfolioUrl}
              onChange={(e) => setPortfolioUrl(e.target.value)}
            />
            <Input
              label="LinkedIn URL"
              type="url"
              placeholder="https://linkedin.com/in/yourprofile"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}
            {success && <p className="text-emerald-400 text-sm">Profile saved successfully.</p>}

            <Button type="submit" loading={saving}>Save Profile</Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
