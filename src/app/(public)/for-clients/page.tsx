import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'
import { JOB_CATEGORY_LABELS, JobCategory } from '@/types'

export default function ForClientsPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-4">For Clients</p>
        <h1 className="text-5xl font-bold mb-6">Better bids because of better vetting</h1>
        <p className="text-xl text-gray-400 mb-16">
          Every freelancer on Flarefix has passed an ethics test and maintains a paid subscription.
          When you post a job, only serious people can respond.
        </p>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">How posting a job works</h2>
          <div className="space-y-4">
            {[
              { n: 1, title: 'Create your account', desc: 'Sign up as a client. No vetting required — the vetting is on the freelancer side.' },
              { n: 2, title: 'Write your job post', desc: 'Title, description, category, budget range, and expected duration. Clear briefs attract better proposals.' },
              { n: 3, title: 'Pay the posting fee (199)', desc: 'A one-time fee activates your job listing. This filters out clients who aren\'t serious too.' },
              { n: 4, title: 'Receive proposals', desc: 'Vetted, subscribed freelancers — each limited to 1 bid per day — send you intentional proposals.' },
              { n: 5, title: 'Award the job', desc: 'Review the proposals and award to the best fit. The platform does not take a percentage cut on the contract.' },
            ].map((item) => (
              <div key={item.n} className="flex gap-6 bg-[#1a2235] border border-[#2d3748] rounded-lg p-5">
                <div className="text-amber-500 text-2xl font-bold w-8 shrink-0">{item.n}</div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Why the vetting matters for you</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Ethics-tested professionals', desc: 'Every freelancer has answered 20 questions on professional ethics, client communication, and responsibility.' },
              { title: 'Committed to the platform', desc: 'Paying subscribers are active, working freelancers — not dormant accounts or casual browsers.' },
              { title: 'Intentional bids only', desc: 'The 1-bid-per-day rule means every proposal you receive was a deliberate choice, not a mass submission.' },
              { title: 'No spam, no noise', desc: 'The gates mean a job post typically receives fewer than 10 bids — all from people who chose your job specifically.' },
            ].map((item) => (
              <div key={item.title} className="bg-[#111827] border border-[#2d3748] rounded-lg p-5">
                <h3 className="font-semibold text-amber-500 mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Available job categories</h2>
          <div className="flex flex-wrap gap-3">
            {(Object.keys(JOB_CATEGORY_LABELS) as JobCategory[]).map((key) => (
              <span
                key={key}
                className="bg-[#1a2235] border border-[#2d3748] text-gray-300 px-4 py-2 rounded-lg text-sm"
              >
                {JOB_CATEGORY_LABELS[key]}
              </span>
            ))}
          </div>
        </section>

        <div className="text-center">
          <Link
            href="/auth/signup?role=client"
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-10 py-5 rounded-lg text-lg transition-colors"
          >
            Post Your First Job
          </Link>
        </div>
      </div>
    </div>
  )
}
