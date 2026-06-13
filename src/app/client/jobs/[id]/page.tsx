import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import Navbar from '@/components/ui/Navbar'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import AwardJobButton from '@/components/client/AwardJobButton'
import { JOB_CATEGORY_LABELS, JobPost } from '@/types'

interface BidWithProfile {
  id: string
  proposal_text: string
  bid_amount: number
  bid_date: string
  created_at: string
  profiles: { full_name: string } | null
  freelancer_profiles: { mock_test_passed: boolean } | null
}

export default async function ClientJobDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { id } = await params

  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'client') redirect('/freelancer/dashboard')

  const { data: job } = await adminClient
    .from('job_posts')
    .select('*')
    .eq('id', id)
    .eq('client_id', user.id)
    .single()

  if (!job) notFound()

  const { data: bids } = await adminClient
    .from('bids')
    .select(`
      id,
      proposal_text,
      bid_amount,
      bid_date,
      created_at,
      profiles!freelancer_id(full_name),
      freelancer_profiles!freelancer_id(mock_test_passed)
    `)
    .eq('job_id', id)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Navbar role="client" />
      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Job header */}
        <div className="mb-10">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Badge variant={job.status === 'active' ? 'success' : job.status === 'awarded' ? 'warning' : 'default'}>
                  {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                </Badge>
                <Badge>{JOB_CATEGORY_LABELS[(job as JobPost).category]}</Badge>
              </div>
              <h1 className="text-3xl font-bold">{job.title}</h1>
            </div>
            {job.status === 'active' && (
              <AwardJobButton jobId={job.id} />
            )}
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
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

          <p className="text-gray-400 whitespace-pre-wrap leading-relaxed">{job.description}</p>
        </div>

        {/* Bids */}
        <div>
          <h2 className="text-xl font-bold mb-6">
            Proposals ({bids?.length ?? 0})
          </h2>

          {!bids || bids.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No proposals yet. Active job listings typically receive proposals within 24–48 hours.
            </div>
          ) : (
            <div className="space-y-4">
              {(bids as unknown as BidWithProfile[]).map((bid) => (
                <Card key={bid.id}>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{bid.profiles?.full_name || 'Freelancer'}</p>
                        {bid.freelancer_profiles?.mock_test_passed && (
                          <Badge variant="success">Ethics Verified</Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        Submitted {new Date(bid.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-amber-500 font-bold text-lg">
                        {bid.bid_amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed">{bid.proposal_text}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
