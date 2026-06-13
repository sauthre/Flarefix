import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-20">
        <p className="text-amber-500 text-sm font-semibold uppercase tracking-wider mb-4">The Manifesto</p>
        <h1 className="text-5xl font-bold mb-8">Why Flarefix exists</h1>
        <p className="text-xl text-gray-400 mb-16">
          A platform built on the conviction that trust is more valuable than volume,
          and that friction can be a feature.
        </p>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">The problem with freelance platforms today</h2>
          <div className="space-y-4 text-gray-400 leading-relaxed">
            <p>
              Most freelance platforms were built to optimize one metric: transaction volume.
              More freelancers. More clients. More bids. More fees. The entire incentive
              structure pushes toward noise, not quality.
            </p>
            <p>
              The result? Clients post a job and receive 80 bids within 6 hours.
              Half are copy-pasted templates. A quarter are from accounts that don&apos;t
              understand the brief. The remaining quarter are buried so deep that the
              client gives up and picks whoever bid first.
            </p>
            <p>
              Freelancers aren&apos;t doing better. They spend hours writing proposals that
              never get read. They race to the bottom on price. They compete against
              unvetted accounts that game the system. Skill and ethics don&apos;t surface
              — bid speed and price do.
            </p>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Flarefix&apos;s 3-part philosophy</h2>
          <div className="space-y-8">
            {[
              {
                title: 'Scarcity over abundance',
                desc: 'One bid per day. This is not a bug — it\'s the core of the platform. Scarcity forces intentionality. When you can only bid once, you choose carefully. You write better. You pick jobs you actually want.',
              },
              {
                title: 'Friction over speed',
                desc: 'The ethics test, the small payment, the subscription — these are deliberate barriers. Every barrier removed someone who was going to waste a client\'s time. The platform is better because of what these gates keep out.',
              },
              {
                title: 'Accountability over anonymity',
                desc: 'Every freelancer on Flarefix has taken a position — on ethics, on professional conduct, on platform rules. That\'s not just a test. It\'s a commitment. Clients can see who passed. That badge means something.',
              },
            ].map((item) => (
              <div key={item.title} className="border-l-2 border-amber-500 pl-6">
                <h3 className="text-lg font-bold mb-2">{item.title}</h3>
                <p className="text-gray-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">The 3 non-negotiable gates</h2>
          <div className="space-y-6">
            <div className="bg-[#1a2235] border border-[#2d3748] rounded-lg p-6">
              <div className="flex items-start gap-4">
                <span className="text-amber-500 font-bold text-2xl">1</span>
                <div>
                  <h3 className="font-bold mb-2">Ethics Mock Test (32)</h3>
                  <p className="text-gray-400 text-sm">
                    20 questions on ethics, communication, responsibility, and platform rules.
                    Pass with 70% or higher. The 32 is a commitment fee — not a revenue stream.
                    Each retry requires a new payment, by design.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#1a2235] border border-[#2d3748] rounded-lg p-6">
              <div className="flex items-start gap-4">
                <span className="text-amber-500 font-bold text-2xl">2</span>
                <div>
                  <h3 className="font-bold mb-2">Monthly Subscription (499/month)</h3>
                  <p className="text-gray-400 text-sm">
                    Active subscription = active freelancer. No subscription means no access
                    to jobs. This keeps the platform free of dormant accounts and ensures
                    clients are only reaching people who are actually working.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-[#1a2235] border border-[#2d3748] rounded-lg p-6">
              <div className="flex items-start gap-4">
                <span className="text-amber-500 font-bold text-2xl">3</span>
                <div>
                  <h3 className="font-bold mb-2">1 Bid Per Day</h3>
                  <p className="text-gray-400 text-sm">
                    This constraint is enforced at the database level. Not a soft limit.
                    Not a guideline. One bid per day, per freelancer, enforced by a database
                    unique constraint. This is the scarcity mechanism that makes the platform work.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">What Flarefix is NOT</h2>
          <ul className="space-y-3 text-gray-400">
            {[
              'Not a Fiverr clone — there are no gig listings or service packages',
              'Not an Upwork clone — there are no boosts, connects, or pay-to-bid mechanics',
              'Not a gig economy platform — we do not optimize for speed or transaction count',
              'Not a social network — no feeds, follower counts, or engagement metrics',
              'Not a race to the bottom — price competition is disincentivized by design',
            ].map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="text-red-400 mt-1">-</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </section>

        <section className="bg-[#1a2235] border border-amber-500/20 rounded-lg p-8">
          <h2 className="text-xl font-bold mb-4 text-amber-500">One-sentence mission</h2>
          <p className="text-2xl font-bold">
            Flarefix is a gated freelance platform where limited access, ethical screening,
            and intentional bidding replace spam, volume, and distrust.
          </p>
        </section>

        <div className="mt-16 text-center">
          <p className="text-gray-400 mb-6">Ready to join a platform built differently?</p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/auth/signup?role=freelancer"
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-4 rounded-lg transition-colors"
            >
              Apply as Freelancer
            </Link>
            <Link
              href="/auth/signup?role=client"
              className="border border-[#2d3748] hover:border-gray-500 text-white font-bold px-8 py-4 rounded-lg transition-colors"
            >
              Post a Job
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
