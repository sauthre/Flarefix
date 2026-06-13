'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import Card from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import { JOB_CATEGORY_LABELS, JobCategory } from '@/types'

interface PostJobClientProps {
  jobPostPrice: number
  razorpayKeyId: string
}

declare global {
  interface Window {
    Razorpay: new (options: object) => { open(): void }
  }
}

const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window.Razorpay !== 'undefined') { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function PostJobClient({ jobPostPrice, razorpayKeyId }: PostJobClientProps) {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '' as JobCategory | '',
    budget_min: '',
    budget_max: '',
    duration: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const priceInRupees = Math.round(jobPostPrice / 100)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const loaded = await loadRazorpay()
    if (!loaded) {
      setError('Failed to load payment gateway')
      setLoading(false)
      return
    }

    const res = await fetch('/api/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        budget_min: parseInt(form.budget_min),
        budget_max: parseInt(form.budget_max),
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Failed to create job')
      setLoading(false)
      return
    }

    const options = {
      key: razorpayKeyId,
      amount: data.amount,
      currency: 'INR',
      name: 'Flarefix',
      description: 'Job Posting Fee',
      order_id: data.orderId,
      handler: async (response: {
        razorpay_payment_id: string
        razorpay_order_id: string
        razorpay_signature: string
      }) => {
        const verifyRes = await fetch('/api/jobs/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }),
        })

        if (verifyRes.ok) {
          router.push(`/client/jobs/${data.jobId}`)
        } else {
          setError('Payment verification failed. Contact support.')
        }
      },
      theme: { color: '#f59e0b' },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Navbar role="client" />
      <div className="max-w-2xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Post a Job</h1>
        <p className="text-gray-400 mb-10">
          Write a clear, specific brief. Better briefs attract better proposals.
        </p>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Job title"
              type="text"
              placeholder="e.g. Frontend Developer for SaaS Dashboard"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />

            <div>
              <label className="text-sm text-gray-400 block mb-1">Description</label>
              <textarea
                className="w-full bg-[#111827] border border-[#2d3748] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-colors resize-none"
                placeholder="Describe the project, deliverables, and expectations in detail."
                rows={6}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="text-sm text-gray-400 block mb-1">Category</label>
              <select
                className="w-full bg-[#111827] border border-[#2d3748] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as JobCategory })}
                required
              >
                <option value="">Select a category</option>
                {(Object.entries(JOB_CATEGORY_LABELS) as [JobCategory, string][]).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Budget min ()"
                type="number"
                placeholder="5000"
                value={form.budget_min}
                onChange={(e) => setForm({ ...form, budget_min: e.target.value })}
                min={1}
                required
              />
              <Input
                label="Budget max ()"
                type="number"
                placeholder="15000"
                value={form.budget_max}
                onChange={(e) => setForm({ ...form, budget_max: e.target.value })}
                min={1}
                required
              />
            </div>

            <Input
              label="Duration (optional)"
              type="text"
              placeholder="e.g. 2 weeks, 1 month"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />

            <div className="bg-[#111827] border border-[#2d3748] rounded-lg p-4 flex justify-between items-center">
              <div>
                <p className="font-semibold">Job posting fee</p>
                <p className="text-xs text-gray-500">One-time payment to activate listing</p>
              </div>
              <p className="text-xl font-bold text-amber-500">{priceInRupees}</p>
            </div>

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <Button type="submit" loading={loading} className="w-full">
              Post Job & Pay {priceInRupees}
            </Button>
          </form>
        </Card>
      </div>
    </div>
  )
}
