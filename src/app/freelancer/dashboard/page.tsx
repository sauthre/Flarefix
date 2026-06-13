import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import Navbar from '@/components/ui/Navbar'
import Card from '@/components/ui/Card'

export default async function FreelancerDashboard() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await adminClient
    .from('profiles')
    .select('full_name, role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'freelancer') redirect('/client/dashboard')

  const { data: freelancer } = await adminClient
    .from('freelancer_profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const today = new Date().toISOString().split('T')[0]
  const hasUsedBidToday = freelancer?.last_bid_date === today

  const steps = [
    {
      number: 1,
      title: 'Account created',
      status: 'done',
      desc: `Welcome, ${profile.full_name || 'Freelancer'}`,
    },
    {
      number: 2,
      title: 'Ethics mock test',
      status: freelancer?.mock_test_passed
        ? 'done'
        : freelancer?.mock_test_paid
        ? 'pending'
        : 'locked',
      desc: freelancer?.mock_test_passed
        ? 'Passed'
        : freelancer?.mock_test_paid
        ? 'Payment verified — take the test'
        : 'Pay 32 to unlock',
      href: '/freelancer/mock-test',
    },
    {
      number: 3,
      title: 'Monthly subscription',
      status: freelancer?.subscription_active
        ? 'done'
        : freelancer?.mock_test_passed
        ? 'pending'
        : 'locked',
      desc: freelancer?.subscription_active
        ? `Active until ${new Date(freelancer.subscription_expires_at!).toLocaleDateString()}`
        : freelancer?.mock_test_passed
        ? 'Subscribe for 499/month'
        : 'Complete mock test first',
      href: '/freelancer/subscribe',
    },
    {
      number: 4,
      title: 'Start bidding',
      status: freelancer?.subscription_active ? 'done' : 'locked',
      desc: freelancer?.subscription_active
        ? hasUsedBidToday
          ? 'Today\'s bid used — come back tomorrow'
          : '1 bid available today'
        : 'Subscribe to unlock',
      href: '/freelancer/jobs',
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Navbar role="freelancer" />

      <div className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-gray-400 mb-10">Your progress on Flarefix</p>

        {/* Progress steps */}
        <div className="space-y-4 mb-12">
          {steps.map((step) => (
            <Card key={step.number} className={step.status === 'locked' ? 'opacity-50' : ''}>
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                  step.status === 'done'
                    ? 'bg-emerald-500 text-black'
                    : step.status === 'pending'
                    ? 'bg-amber-500 text-black'
                    : 'bg-[#2d3748] text-gray-400'
                }`}>
                  {step.status === 'done' ? '✓' : step.number}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{step.title}</h3>
                    {step.status === 'done' && (
                      <span className="text-xs bg-emerald-900 text-emerald-300 px-2 py-0.5 rounded">Complete</span>
                    )}
                    {step.status === 'pending' && (
                      <span className="text-xs bg-amber-900 text-amber-300 px-2 py-0.5 rounded">Action needed</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-400 mt-0.5">{step.desc}</p>
                </div>
                {step.href && step.status !== 'done' && step.status !== 'locked' && (
                  <Link
                    href={step.href}
                    className="text-sm bg-amber-500 hover:bg-amber-600 text-black font-semibold px-4 py-2 rounded-lg transition-colors"
                  >
                    {step.number === 2 ? (freelancer?.mock_test_paid ? 'Take Test' : 'Pay & Test') : 'Continue'}
                  </Link>
                )}
                {step.href && step.status === 'done' && step.number === 4 && (
                  <Link
                    href={step.href}
                    className="text-sm border border-[#2d3748] hover:border-gray-500 text-gray-300 px-4 py-2 rounded-lg transition-colors"
                  >
                    Browse Jobs
                  </Link>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Bid status */}
        {freelancer?.subscription_active && (
          <Card className={hasUsedBidToday ? 'border-gray-600' : 'border-amber-500/30'}>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-1">Today&apos;s bid</h3>
                <p className={`text-sm ${hasUsedBidToday ? 'text-gray-400' : 'text-amber-400'}`}>
                  {hasUsedBidToday
                    ? 'You have used your bid for today. Come back tomorrow.'
                    : 'You have 1 bid available today. Use it wisely.'}
                </p>
              </div>
              {!hasUsedBidToday && (
                <Link
                  href="/freelancer/jobs"
                  className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-3 rounded-lg transition-colors"
                >
                  Browse Jobs
                </Link>
              )}
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}
