import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'freelancer') {
    return NextResponse.json({ error: 'Freelancers only' }, { status: 403 })
  }

  const { data: freelancer } = await adminClient
    .from('freelancer_profiles')
    .select('mock_test_passed, subscription_active')
    .eq('id', user.id)
    .single()

  if (!freelancer?.mock_test_passed) {
    return NextResponse.json({ error: 'You must pass the mock test to place bids' }, { status: 403 })
  }

  if (!freelancer?.subscription_active) {
    return NextResponse.json({ error: 'You must have an active subscription to place bids' }, { status: 403 })
  }

  const { job_id, proposal_text, bid_amount } = await request.json()

  if (!job_id || !proposal_text || !bid_amount) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const { data: job } = await adminClient
    .from('job_posts')
    .select('status')
    .eq('id', job_id)
    .single()

  if (!job || job.status !== 'active') {
    return NextResponse.json({ error: 'Job is not available for bidding' }, { status: 400 })
  }

  const today = new Date().toISOString().split('T')[0]

  const { data: existingBid } = await adminClient
    .from('bids')
    .select('id')
    .eq('freelancer_id', user.id)
    .eq('bid_date', today)
    .single()

  if (existingBid) {
    return NextResponse.json(
      { error: 'You have already placed your one bid for today.' },
      { status: 400 }
    )
  }

  const { error: bidError } = await adminClient.from('bids').insert({
    job_id,
    freelancer_id: user.id,
    proposal_text,
    bid_amount,
    bid_date: today,
  })

  if (bidError) {
    if (bidError.code === '23505') {
      return NextResponse.json(
        { error: 'You have already placed your one bid for today.' },
        { status: 400 }
      )
    }
    return NextResponse.json({ error: bidError.message }, { status: 500 })
  }

  await adminClient
    .from('freelancer_profiles')
    .update({ last_bid_date: today })
    .eq('id', user.id)

  return NextResponse.json({ success: true })
}
