import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params

  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  const { data: job, error: jobError } = await adminClient
    .from('job_posts')
    .select('*')
    .eq('id', id)
    .single()

  if (jobError || !job) {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  if (profile.role === 'client') {
    if (job.client_id !== user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    const { data: bids } = await adminClient
      .from('bids')
      .select('*, profiles!freelancer_id(full_name), freelancer_profiles!freelancer_id(mock_test_passed)')
      .eq('job_id', id)
      .order('created_at', { ascending: false })

    return NextResponse.json({ job, bids })
  }

  // Freelancer: return job only
  if (job.status !== 'active') {
    return NextResponse.json({ error: 'Job not found' }, { status: 404 })
  }

  return NextResponse.json({ job })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const { status } = await request.json()

  if (status !== 'awarded' && status !== 'closed') {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const { data: job } = await adminClient
    .from('job_posts')
    .select('client_id')
    .eq('id', id)
    .single()

  if (!job || job.client_id !== user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await adminClient
    .from('job_posts')
    .update({ status })
    .eq('id', id)

  return NextResponse.json({ success: true })
}
