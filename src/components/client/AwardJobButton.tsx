'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Button from '@/components/ui/Button'

export default function AwardJobButton({ jobId }: { jobId: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleAward = async () => {
    setLoading(true)
    await fetch(`/api/jobs/${jobId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'awarded' }),
    })
    router.refresh()
    setLoading(false)
  }

  return (
    <Button variant="outline" onClick={handleAward} loading={loading}>
      Award Job
    </Button>
  )
}
