import Link from 'next/link'
import Navbar from '@/components/ui/Navbar'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Navbar />

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-32 text-center">
        <div className="inline-block bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm px-4 py-1.5 rounded-full mb-8">
          A new kind of freelance platform
        </div>
        <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
          Quality freelancers.<br />
          <span className="text-amber-500">Zero noise.</span>
        </h1>
        <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-12">
          Every freelancer passes an ethics test. Every client gets serious proposals.
          One bid per day. No spam. No shortcuts.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/signup?role=freelancer"
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-8 py-4 rounded-lg text-lg transition-colors"
          >
            Join as Freelancer
          </Link>
          <Link
            href="/auth/signup?role=client"
            className="border border-[#2d3748] hover:border-gray-500 text-white font-bold px-8 py-4 rounded-lg text-lg transition-colors"
          >
            Post a Job
          </Link>
        </div>
      </section>

      {/* The Problem */}
      <section className="bg-[#111827] py-24">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">The problem with every other platform</h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            Every other platform optimizes for volume. We optimize for trust.
            The result? Clients wade through 80 spam bids. Serious freelancers
            lose to whoever bids lowest. Everyone loses.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { label: 'Spam bids per job', other: '50–200', flarefix: 'Max 5' },
              { label: 'Freelancer vetting', other: 'None', flarefix: 'Ethics test required' },
              { label: 'Daily bid limit', other: 'Unlimited', flarefix: '1 bid per day' },
            ].map((item) => (
              <div key={item.label} className="bg-[#1a2235] border border-[#2d3748] rounded-lg p-6">
                <p className="text-gray-400 text-sm mb-4">{item.label}</p>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Others</p>
                    <p className="text-red-400 font-semibold">{item.other}</p>
                  </div>
                  <div className="text-[#2d3748] font-bold">vs</div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Flarefix</p>
                    <p className="text-amber-500 font-semibold">{item.flarefix}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* The 3 Gates */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">The 3 gates every freelancer passes</h2>
          <p className="text-gray-400 text-lg">Each gate exists for a reason. Together they keep the platform honest.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              step: '01',
              title: 'Ethics Mock Test',
              price: '32',
              desc: 'Pay 32 to unlock a 20-question ethics test. Pass with 70%+ to proceed. The small fee filters out those who aren\'t serious. The test filters out those who aren\'t ethical.',
            },
            {
              step: '02',
              title: 'Monthly Subscription',
              price: '499',
              desc: 'A monthly subscription keeps freelancers accountable. No subscription = no access. This ensures only active, committed professionals are on the platform.',
            },
            {
              step: '03',
              title: '1 Bid Per Day',
              price: null,
              desc: 'One bid. Every day. That\'s it. This forces freelancers to be intentional. No spray-and-pray. Clients get fewer, better proposals.',
            },
          ].map((gate) => (
            <div key={gate.step} className="bg-[#1a2235] border border-[#2d3748] rounded-lg p-8">
              <div className="text-amber-500 text-5xl font-bold mb-6 opacity-30">{gate.step}</div>
              <h3 className="text-xl font-bold mb-2">{gate.title}</h3>
              {gate.price && (
                <p className="text-amber-500 font-semibold mb-4">
                  {gate.price === '32' ? '32 one-time' : `${gate.price}/month`}
                </p>
              )}
              <p className="text-gray-400 text-sm leading-relaxed">{gate.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-[#111827] py-24">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-4xl font-bold mb-12 text-center">Flarefix vs. Everyone Else</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[#2d3748]">
                  <th className="text-left py-4 text-gray-400">Feature</th>
                  <th className="py-4 text-gray-400">Upwork</th>
                  <th className="py-4 text-gray-400">Fiverr</th>
                  <th className="py-4 text-amber-500 font-bold">Flarefix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2d3748]">
                {[
                  ['Freelancer vetting', 'None', 'None', 'Ethics test required'],
                  ['Bid spam control', 'None', 'N/A', '1 bid per day'],
                  ['Philosophy', 'Volume', 'Gig chaos', 'Trust & scarcity'],
                  ['Serious proposals', 'Buried in spam', 'Irrelevant', 'Only serious bids'],
                  ['Accountability', 'Low', 'Low', 'Built-in'],
                ].map(([feature, upwork, fiverr, flarefix]) => (
                  <tr key={feature}>
                    <td className="py-4 text-gray-300">{feature}</td>
                    <td className="py-4 text-center text-gray-500">{upwork}</td>
                    <td className="py-4 text-center text-gray-500">{fiverr}</td>
                    <td className="py-4 text-center text-amber-400 font-medium">{flarefix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* For Clients */}
      <section className="max-w-6xl mx-auto px-6 py-24">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-amber-500 text-sm font-semibold mb-4 uppercase tracking-wider">For Clients</p>
            <h2 className="text-4xl font-bold mb-6">Read 5 serious proposals,<br />not 50 spam ones.</h2>
            <p className="text-gray-400 text-lg mb-8">
              Every freelancer on Flarefix has already proven their ethics and commitment.
              When you post a job, only vetted, subscribed freelancers can bid — and each
              freelancer can only bid on one job per day. Your time is respected.
            </p>
            <Link
              href="/for-clients"
              className="text-amber-500 hover:text-amber-400 font-semibold"
            >
              How client posting works &rarr;
            </Link>
          </div>
          <div className="space-y-4">
            {[
              'No unqualified bids ever',
              'Every freelancer passed an ethics test',
              'Flat job posting fee — no percentage cuts',
              'Clear, intentional proposals only',
            ].map((point) => (
              <div key={point} className="flex items-start gap-3 bg-[#1a2235] border border-[#2d3748] rounded-lg p-4">
                <span className="text-amber-500 mt-0.5">+</span>
                <p className="text-gray-300">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* For Freelancers */}
      <section className="bg-[#111827] py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="space-y-4 order-2 md:order-1">
              {[
                'Your ethics set you apart from day one',
                'Compete on quality, not desperation',
                'One bid = full focus on the right job',
                'Clients who value serious work',
              ].map((point) => (
                <div key={point} className="flex items-start gap-3 bg-[#0a0e1a] border border-[#2d3748] rounded-lg p-4">
                  <span className="text-amber-500 mt-0.5">+</span>
                  <p className="text-gray-300">{point}</p>
                </div>
              ))}
            </div>
            <div className="order-1 md:order-2">
              <p className="text-amber-500 text-sm font-semibold mb-4 uppercase tracking-wider">For Freelancers</p>
              <h2 className="text-4xl font-bold mb-6">Win jobs on quality,<br />not desperation.</h2>
              <p className="text-gray-400 text-lg mb-8">
                On every other platform, you compete against hundreds of freelancers
                undercutting each other. On Flarefix, you compete on merit. Your ethics
                badge signals you&apos;re serious before a client reads your proposal.
              </p>
              <Link
                href="/for-freelancers"
                className="text-amber-500 hover:text-amber-400 font-semibold"
              >
                See the freelancer path &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="max-w-4xl mx-auto px-6 py-32 text-center">
        <h2 className="text-5xl font-bold mb-6">
          Ready to work differently?
        </h2>
        <p className="text-gray-400 text-xl mb-12">
          Join a platform built on trust, not volume.
          Start today — the test is waiting.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/auth/signup?role=freelancer"
            className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-10 py-5 rounded-lg text-lg transition-colors"
          >
            Start as Freelancer
          </Link>
          <Link
            href="/auth/signup?role=client"
            className="border border-[#2d3748] hover:border-gray-500 text-white font-bold px-10 py-5 rounded-lg text-lg transition-colors"
          >
            Hire on Flarefix
          </Link>
        </div>
      </section>

      <footer className="border-t border-[#2d3748] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <span className="text-amber-500 font-bold">Flarefix</span>
          <div className="flex gap-6 text-sm text-gray-500">
            <Link href="/about" className="hover:text-gray-300">About</Link>
            <Link href="/for-freelancers" className="hover:text-gray-300">Freelancers</Link>
            <Link href="/for-clients" className="hover:text-gray-300">Clients</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}
