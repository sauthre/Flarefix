import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { razorpay } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: freelancer } = await adminClient
    .from('freelancer_profiles')
    .select('mock_test_passed')
    .eq('id', user.id)
    .single()

  if (!freelancer?.mock_test_passed) {
    return NextResponse.json({ error: 'You must pass the mock test before subscribing' }, { status: 403 })
  }

  const amount = parseInt(process.env.SUBSCRIPTION_PRICE || '49900')

  const order = await razorpay.orders.create({
    amount,
    currency: 'INR',
    receipt: `sub_${user.id}_${Date.now()}`,
  })

  return NextResponse.json({
    orderId: order.id,
    amount,
    currency: 'INR',
  })
}
