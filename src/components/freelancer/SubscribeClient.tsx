'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface SubscribeClientProps {
  subscriptionActive: boolean
  subscriptionExpiresAt: string | null
  subscriptionPrice: number
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

export default function SubscribeClient({
  subscriptionActive,
  subscriptionExpiresAt,
  subscriptionPrice,
  razorpayKeyId,
}: SubscribeClientProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const priceInRupees = Math.round(subscriptionPrice / 100)

  if (subscriptionActive) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-white">
        <Navbar role="freelancer" />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <div className="text-5xl font-bold text-emerald-400 mb-6">✓</div>
          <h1 className="text-3xl font-bold mb-4">Subscription Active</h1>
          {subscriptionExpiresAt && (
            <p className="text-gray-400 mb-8">
              Active until {new Date(subscriptionExpiresAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          )}
          <Button onClick={() => router.push('/freelancer/jobs')}>Browse Jobs</Button>
        </div>
      </div>
    )
  }

  const handleSubscribe = async () => {
    setLoading(true)
    setError('')

    const loaded = await loadRazorpay()
    if (!loaded) {
      setError('Failed to load payment gateway. Please try again.')
      setLoading(false)
      return
    }

    const res = await fetch('/api/subscription/pay', { method: 'POST' })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Payment initiation failed')
      setLoading(false)
      return
    }

    const options = {
      key: razorpayKeyId,
      amount: data.amount,
      currency: data.currency,
      name: 'Flarefix',
      description: 'Monthly Subscription',
      order_id: data.orderId,
      handler: async (response: {
        razorpay_payment_id: string
        razorpay_order_id: string
        razorpay_signature: string
      }) => {
        const verifyRes = await fetch('/api/subscription/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }),
        })

        if (verifyRes.ok) {
          router.push('/freelancer/dashboard')
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
      <Navbar role="freelancer" />
      <div className="max-w-2xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-4">Subscribe to Flarefix</h1>
        <p className="text-gray-400 mb-10">
          You&apos;ve passed the ethics test. Subscribe to unlock access to all job listings
          and your daily bid.
        </p>

        <Card className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold">Monthly Access</h3>
            <p className="text-3xl font-bold text-amber-500">{priceInRupees}/mo</p>
          </div>
          <ul className="space-y-3 text-sm text-gray-400">
            {[
              'Access to all active job listings',
              'Filter by category',
              '1 intentional bid per day',
              'Ethics badge on your profile',
              'Direct proposals to vetted clients',
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span className="text-amber-500">+</span>
                {item}
              </li>
            ))}
          </ul>
        </Card>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <Button onClick={handleSubscribe} loading={loading} className="w-full">
          Subscribe for {priceInRupees}/month
        </Button>
        <p className="text-xs text-gray-500 mt-4 text-center">
          30-day subscription. No automatic renewals in V1.
        </p>
      </div>
    </div>
  )
}
