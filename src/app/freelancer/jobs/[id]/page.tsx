import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import Navbar from '@/components/ui/Navbar'
import Badge from '@/components/ui/Badge'
import BidForm from '@/components/freelancer/BidForm'
import { JOB_CATEGORY_LABELS, JobPost } from '@/types'

export default async function FreelancerJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { id } = await params

  const { data: freelancer } = await adminClient
    .from('freelancer_profiles')
    .select('mock_test_passed, subscription_active, last_bid_date')
    .eq('id', user.id)
    .single()

  if (!freelancer?.mock_test_passed) redirect('/freelancer/mock-test')
  if (!freelancer?.subscription_active) redirect('/freelancer/subscribe')

  const { data: job } = await adminClient
    .from('job_posts')
    .select('*')
    .eq('id', id)
    .eq('status', 'active')
    .single()

  if (!job) notFound()

  const today = new Date().toISOString().split('T')[0]
  const hasUsedBidToday = freelancer?.last_bid_date === today

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Navbar role="freelancer" />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge>{JOB_CATEGORY_LABELS[(job as JobPost).category]}</Badge>
            <Badge variant="success">Active</Badge>
          </div>
          <h1 className="text-3xl font-bold mb-4">{job.title}</h1>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-[#1a2235] border border-[#2d3748] rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Budget</p>
              <p className="font-semibold text-amber-500">
                {job.budget_min?.toLocaleString()} – {job.budget_max?.toLocaleString()}
              </p>
            </div>
            {job.duration && (
              <div className="bg-[#1a2235] border border-[#2d3748] rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Duration</p>
                <p className="font-semibold">{job.duration}</p>
              </div>
            )}
            <div className="bg-[#1a2235] border border-[#2d3748] rounded-lg p-4">
              <p className="text-xs text-gray-500 mb-1">Posted</p>
              <p className="font-semibold">{new Date(job.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="prose prose-invert max-w-none">
            <h2 className="text-xl font-semibold mb-4">Job description</h2>
            <p className="text-gray-400 whitespace-pre-wrap leading-relaxed">{job.description}</p>
          </div>
        </div>

        <BidForm
          jobId={job.id}
          hasUsedBidToday={hasUsedBidToday}
        />
      </div>
    </div>
  )
}
