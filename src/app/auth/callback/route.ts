import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error && data.user) {
      const userId = data.user.id
      const email = data.user.email!

      // Check if profile exists; if not, create one (Google OAuth first login)
      const { data: profile } = await adminClient
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .single()

      if (!profile) {
        // Default OAuth users to freelancer — they can choose role on first dashboard visit
        await adminClient.from('profiles').insert({
          id: userId,
          role: 'freelancer',
          full_name: data.user.user_metadata?.full_name || '',
          email,
        })
        await adminClient.from('freelancer_profiles').insert({ id: userId })
        return NextResponse.redirect(`${origin}/freelancer/dashboard`)
      }

      if (profile.role === 'client') {
        return NextResponse.redirect(`${origin}/client/dashboard`)
      }
      return NextResponse.redirect(`${origin}/freelancer/dashboard`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/login?error=oauth_failed`)
}
