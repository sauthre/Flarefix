import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import { verifyRazorpaySignature } from '@/lib/razorpay'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = await request.json()

  if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
    return NextResponse.json({ error: 'Missing payment details' }, { status: 400 })
  }

  const isValid = verifyRazorpaySignature(razorpay_order_id, razorpay_payment_id, razorpay_signature)

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
  }

  const now = new Date()
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

  await adminClient.from('subscriptions').insert({
    freelancer_id: user.id,
    razorpay_payment_id,
    razorpay_order_id,
    amount: parseInt(process.env.SUBSCRIPTION_PRICE || '49900'),
    status: 'active',
    starts_at: now.toISOString(),
    expires_at: expiresAt.toISOString(),
  })

  await adminClient
    .from('freelancer_profiles')
    .update({
      subscription_active: true,
      subscription_expires_at: expiresAt.toISOString(),
    })
    .eq('id', user.id)

  return NextResponse.json({ success: true })
}
