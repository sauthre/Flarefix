'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

interface BidFormProps {
  jobId: string
  hasUsedBidToday: boolean
}

export default function BidForm({ jobId, hasUsedBidToday }: BidFormProps) {
  const router = useRouter()
  const [proposalText, setProposalText] = useState('')
  const [bidAmount, setBidAmount] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  if (hasUsedBidToday) {
    return (
      <Card className="border-gray-700">
        <p className="text-gray-400 text-center">
          You&apos;ve used your bid for today. Come back tomorrow.
        </p>
      </Card>
    )
  }

  if (success) {
    return (
      <Card className="border-emerald-800">
        <p className="text-emerald-400 font-semibold text-center">
          Bid placed successfully. That was your bid for today.
        </p>
      </Card>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    const res = await fetch('/api/bids', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        job_id: jobId,
        proposal_text: proposalText,
        bid_amount: parseInt(bidAmount),
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Bid failed')
      setSubmitting(false)
      return
    }

    setSuccess(true)
    setSubmitting(false)
    router.refresh()
  }

  return (
    <Card>
      <h2 className="text-xl font-bold mb-6">Place your bid</h2>
      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-3 mb-6">
        <p className="text-amber-400 text-sm font-medium">
          This is your 1 bid for today. Choose wisely.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-sm text-gray-400 block mb-1">Your proposal</label>
          <textarea
            className="w-full bg-[#111827] border border-[#2d3748] rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 transition-colors resize-none"
            placeholder="Write a genuine, specific proposal. Explain why you're the right person for this job."
            rows={6}
            value={proposalText}
            onChange={(e) => setProposalText(e.target.value)}
            required
            minLength={50}
          />
          <p className="text-xs text-gray-600 mt-1">Minimum 50 characters</p>
        </div>

        <Input
          label="Your bid amount ()"
          type="number"
          placeholder="Enter your bid amount"
          value={bidAmount}
          onChange={(e) => setBidAmount(e.target.value)}
          min={1}
          required
        />

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <Button type="submit" loading={submitting} className="w-full">
          Place Bid
        </Button>
      </form>
    </Card>
  )
}
