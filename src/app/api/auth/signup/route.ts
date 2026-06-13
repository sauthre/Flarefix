import { NextRequest, NextResponse } from 'next/server'
import { adminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const { email, password, full_name, role } = await request.json()

  if (!email || !password || !full_name || !role) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (role !== 'freelancer' && role !== 'client') {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  const { data: authData, error: authError } = await adminClient.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })

  if (authError) {
    return NextResponse.json({ error: authError.message }, { status: 400 })
  }

  const userId = authData.user.id

  const { error: profileError } = await adminClient
    .from('profiles')
    .insert({ id: userId, role, full_name, email })

  if (profileError) {
    await adminClient.auth.admin.deleteUser(userId)
    return NextResponse.json({ error: profileError.message }, { status: 500 })
  }

  if (role === 'freelancer') {
    const { error: freelancerError } = await adminClient
      .from('freelancer_profiles')
      .insert({ id: userId })

    if (freelancerError) {
      await adminClient.auth.admin.deleteUser(userId)
      return NextResponse.json({ error: freelancerError.message }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true })
}
