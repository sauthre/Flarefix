import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'

export default function ForFreelancersPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-20">
        <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-4">For Freelancers</p>
        <h1 className="text-5xl font-bold mb-6">The path to working on Flarefix</h1>
        <p className="text-xl text-gray-400 mb-16">
          Four steps. No shortcuts. Every step is a filter — against people who
          aren&apos;t serious, aren&apos;t ethical, and aren&apos;t ready.
        </p>

        {/* Steps */}
        <section className="mb-20">
          <h2 className="text-2xl font-bold mb-8">How it works</h2>
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: 'Sign up with your name and email',
                desc: 'Create your account. Email or Google. No portfolio required at this stage. You haven\'t earned that review yet.',
              },
              {
                step: 2,
                title: 'Pay 32 and take the ethics test',
                desc: '20 questions on ethics, professional communication, and responsibility. Score 70% or higher to pass. The fee is a commitment signal — not a revenue source. Each retry costs 32.',
              },
              {
                step: 3,
                title: 'Subscribe for 499/month',
                desc: 'Once you pass, subscribe to unlock job access. Your subscription is how we know you\'re actively working. No subscription = no job listings.',
              },
              {
                step: 4,
                title: 'Place 1 bid per day',
                desc: 'Browse jobs and place exactly one bid per day. Choose carefully. Write a real proposal. This is the scarcity mechanism that makes Flarefix different from every other platform.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6 bg-[#1a2235] border border-[#2d3748] rounded-lg p-6">
                <div className="text-amber-500 text-3xl font-bold w-10 shrink-0">{item.step}</div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Who it's for */}
        <section className="mb-20 grid md:grid-cols-2 gap-8">
          <div className="bg-[#111827] border border-emerald-800/30 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4 text-emerald-400">Who this is for</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              {[
                'Freelancers who value their reputation',
                'People who write proposals from scratch',
                'Professionals who meet deadlines',
                'Those who communicate proactively',
                'Anyone tired of competing with spam',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-emerald-400">+</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-[#111827] border border-red-800/30 rounded-lg p-6">
            <h3 className="font-bold text-lg mb-4 text-red-400">Who this is NOT for</h3>
            <ul className="space-y-3 text-gray-400 text-sm">
              {[
                'People who mass-apply to every job',
                'Those who ghost clients after payment',
                'Anyone who overpromises and underdelivers',
                'Freelancers who copy-paste proposals',
                'Anyone here just to test the system',
              ].map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-red-400">-</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Frequently asked questions</h2>
          <div className="space-y-6">
            {[
              {
                q: 'What happens if I fail the ethics test?',
                a: 'You can retake it by paying the 32 fee again. There is no limit on retakes — but each attempt requires a new payment.',
              },
              {
                q: 'Can I bid on more than one job per day?',
                a: 'No. One bid per day is a hard limit enforced at the database level. This is intentional and non-negotiable.',
              },
              {
                q: 'What happens to my subscription if I don\'t get hired?',
                a: 'Your subscription stays active for 30 days regardless. You keep access to all job listings and can bid every day during that period.',
              },
              {
                q: 'Is the 32 refundable if I fail?',
                a: 'No. The fee is a commitment signal, not a purchase of guaranteed access. This is clearly stated upfront.',
              },
              {
                q: 'Can my subscription be transferred or paused?',
                a: 'In V1, subscriptions run for 30 days from activation and cannot be paused or transferred.',
              },
            ].map((item) => (
              <div key={item.q} className="border-b border-[#2d3748] pb-6">
                <h3 className="font-semibold mb-2">{item.q}</h3>
                <p className="text-gray-400 text-sm">{item.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center">
          <Link
            href="/auth/signup?role=freelancer"
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-10 py-5 rounded-lg text-lg transition-colors"
          >
            Start the process
          </Link>
        </div>
      </div>
    </div>
  )
}
