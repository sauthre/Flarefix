import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await adminClient
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .single()

  const { data: freelancer } = await adminClient
    .from('freelancer_profiles')
    .select('portfolio_url, linkedin_url')
    .eq('id', user.id)
    .single()

  return NextResponse.json({
    full_name: profile?.full_name,
    portfolio_url: freelancer?.portfolio_url,
    linkedin_url: freelancer?.linkedin_url,
  })
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { portfolio_url, linkedin_url } = await request.json()

  const { error } = await adminClient
    .from('freelancer_profiles')
    .update({ portfolio_url, linkedin_url })
    .eq('id', user.id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
