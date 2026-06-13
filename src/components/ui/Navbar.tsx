'use client'

import Link from 'next/link'

interface NavbarProps {
  role?: 'freelancer' | 'client' | null
}

export default function Navbar({ role }: NavbarProps) {
  return (
    <nav className="border-b border-[#2d3748] bg-[#0a0e1a]">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-amber-500">
          Flarefix
        </Link>
        <div className="flex items-center gap-6">
          {!role && (
            <>
              <Link href="/about" className="text-gray-400 hover:text-white text-sm transition-colors">
                About
              </Link>
              <Link href="/for-freelancers" className="text-gray-400 hover:text-white text-sm transition-colors">
                For Freelancers
              </Link>
              <Link href="/for-clients" className="text-gray-400 hover:text-white text-sm transition-colors">
                For Clients
              </Link>
              <Link
                href="/auth/login"
                className="text-sm text-gray-400 hover:text-white transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                className="text-sm bg-amber-500 hover:bg-amber-600 text-black px-4 py-2 rounded-lg font-semibold transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
          {role === 'freelancer' && (
            <>
              <Link href="/freelancer/jobs" className="text-gray-400 hover:text-white text-sm">Browse Jobs</Link>
              <Link href="/freelancer/profile" className="text-gray-400 hover:text-white text-sm">Profile</Link>
              <Link href="/freelancer/dashboard" className="text-amber-500 text-sm font-semibold">Dashboard</Link>
            </>
          )}
          {role === 'client' && (
            <>
              <Link href="/client/post-job" className="text-gray-400 hover:text-white text-sm">Post a Job</Link>
              <Link href="/client/dashboard" className="text-amber-500 text-sm font-semibold">Dashboard</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
