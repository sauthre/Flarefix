import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import Navbar from '@/components/ui/Navbar'
import Card from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { JOB_CATEGORY_LABELS, JobPost } from '@/types'

export default async function ClientDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await adminClient
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'client') redirect('/freelancer/dashboard')

  const { data: jobs } = await adminClient
    .from('job_posts')
    .select('*')
    .eq('client_id', user.id)
    .order('created_at', { ascending: false })

  const statusBadge = (status: JobPost['status']) => {
    const map: Record<JobPost['status'], 'default' | 'success' | 'warning' | 'error'> = {
      draft: 'default',
      active: 'success',
      closed: 'error',
      awarded: 'warning',
    }
    return map[status]
  }

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Navbar role="client" />
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold mb-1">Dashboard</h1>
            <p className="text-gray-400">Welcome back, {profile.full_name || 'Client'}</p>
          </div>
          <Link
            href="/client/post-job"
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-lg transition-colors"
          >
            Post a New Job
          </Link>
        </div>

        {!jobs || jobs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-500 mb-6">You haven&apos;t posted any jobs yet.</p>
            <Link
              href="/client/post-job"
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-4 rounded-lg transition-colors"
            >
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-400">Your jobs ({jobs.length})</h2>
            {(jobs as JobPost[]).map((job) => (
              <Link key={job.id} href={`/client/jobs/${job.id}`}>
                <Card className="hover:border-gray-500 transition-colors cursor-pointer">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant={statusBadge(job.status)}>
                          {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                        </Badge>
                        <Badge>{JOB_CATEGORY_LABELS[job.category]}</Badge>
                      </div>
                      <h3 className="font-semibold">{job.title}</h3>
                    </div>
                    <div className="text-right text-sm text-gray-400">
                      {new Date(job.created_at).toLocaleDateString()}
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
