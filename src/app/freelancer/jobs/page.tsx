import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import Navbar from '@/components/ui/Navbar'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { JOB_CATEGORY_LABELS, JobCategory, JobPost } from '@/types'

export default async function FreelancerJobsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: freelancer } = await adminClient
    .from('freelancer_profiles')
    .select('mock_test_passed, subscription_active, last_bid_date')
    .eq('id', user.id)
    .single()

  if (!freelancer?.mock_test_passed) redirect('/freelancer/mock-test')
  if (!freelancer?.subscription_active) redirect('/freelancer/subscribe')

  const params = await searchParams
  const category = params.category

  let query = adminClient
    .from('job_posts')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data: jobs } = await query

  const today = new Date().toISOString().split('T')[0]
  const hasUsedBidToday = freelancer?.last_bid_date === today

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Navbar role="freelancer" />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-1">Browse Jobs</h1>
            <p className={`text-sm ${hasUsedBidToday ? 'text-gray-500' : 'text-amber-400'}`}>
              {hasUsedBidToday
                ? 'You have used your bid for today. Come back tomorrow.'
                : '1 bid available today — choose wisely.'}
            </p>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Link
            href="/freelancer/jobs"
            className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
              !category
                ? 'border-amber-500 text-amber-500'
                : 'border-[#2d3748] text-gray-400 hover:border-gray-500'
            }`}
          >
            All
          </Link>
          {(Object.entries(JOB_CATEGORY_LABELS) as [JobCategory, string][]).map(([key, label]) => (
            <Link
              key={key}
              href={`/freelancer/jobs?category=${key}`}
              className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
                category === key
                  ? 'border-amber-500 text-amber-500'
                  : 'border-[#2d3748] text-gray-400 hover:border-gray-500'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Jobs list */}
        {!jobs || jobs.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            No active jobs in this category. Check back soon.
          </div>
        ) : (
          <div className="space-y-4">
            {(jobs as JobPost[]).map((job) => (
              <Link key={job.id} href={`/freelancer/jobs/${job.id}`}>
                <Card className="hover:border-gray-500 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge>{JOB_CATEGORY_LABELS[job.category]}</Badge>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{job.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{job.description}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-amber-500 font-semibold text-sm">
                        {job.budget_min?.toLocaleString()} – {job.budget_max?.toLocaleString()}
                      </p>
                      {job.duration && (
                        <p className="text-gray-500 text-xs mt-1">{job.duration}</p>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-4">
                    Posted {new Date(job.created_at).toLocaleDateString()}
                  </p>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
