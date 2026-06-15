import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { getRazorpay } from '@/lib/razorpay'
import { JobCategory } from '@/types'

const VALID_CATEGORIES: JobCategory[] = [
  'content_writer', 'copywriter', 'technical_writer',
  'ui_ux_designer', 'graphic_designer',
  'frontend_developer', 'backend_developer', 'fullstack_developer',
  'seo_consultant', 'digital_marketing_strategist',
]

export async function GET(request: NextRequest) {
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

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
  }

  if (profile.role === 'freelancer') {
    const { data: freelancer } = await adminClient
      .from('freelancer_profiles')
      .select('mock_test_passed, subscription_active')
      .eq('id', user.id)
      .single()

    if (!freelancer?.mock_test_passed || !freelancer?.subscription_active) {
      return NextResponse.json(
        { error: 'You must pass the mock test and have an active subscription to view jobs' },
        { status: 403 }
      )
    }
  }

  const { searchParams } = new URL(request.url)
  const category = searchParams.get('category')

  let query = adminClient
    .from('job_posts')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data: jobs, error } = await query

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 })
  }

  return NextResponse.json({ jobs })
}

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

  if (!profile || profile.role !== 'client') {
    return NextResponse.json({ error: 'Clients only' }, { status: 403 })
  }

  const { title, description, category, budget_min, budget_max, duration } = await request.json()

  if (!title || !description || !category || budget_min == null || budget_max == null) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  if (!VALID_CATEGORIES.includes(category)) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }

  const amount = parseInt(process.env.JOB_POST_PRICE || '19900')

  const order = await getRazorpay().orders.create({
    amount,
    currency: 'INR',
    receipt: `job_${user.id}_${Date.now()}`,
  })

  const { data: job, error: jobError } = await adminClient
    .from('job_posts')
    .insert({
      client_id: user.id,
      title,
      description,
      category,
      budget_min,
      budget_max,
      duration,
      status: 'draft',
      payment_verified: false,
      razorpay_order_id: order.id,
    })
    .select()
    .single()

  if (jobError) {
    return NextResponse.json({ error: jobError.message }, { status: 500 })
  }

  return NextResponse.json({ jobId: job.id, orderId: order.id, amount })
}
