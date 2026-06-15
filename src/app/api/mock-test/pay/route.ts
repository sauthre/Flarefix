import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { getRazorpay } from '@/lib/razorpay'

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
    .select('mock_test_paid, mock_test_passed')
    .eq('id', user.id)
    .single()

  if (freelancer?.mock_test_paid && freelancer?.mock_test_passed) {
    return NextResponse.json({ error: 'You have already passed the mock test' }, { status: 400 })
  }

  const amount = parseInt(process.env.MOCK_TEST_PRICE || '3200')

  const order = await getRazorpay().orders.create({
    amount,
    currency: 'INR',
    receipt: `mock_test_${user.id}_${Date.now()}`,
  })

  await adminClient.from('mock_test_payments').insert({
    freelancer_id: user.id,
    razorpay_order_id: order.id,
    amount,
    status: 'pending',
  })

  return NextResponse.json({
    orderId: order.id,
    amount,
    currency: 'INR',
  })
}
