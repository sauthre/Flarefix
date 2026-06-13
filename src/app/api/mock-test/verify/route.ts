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

  await adminClient
    .from('mock_test_payments')
    .update({ status: 'success', razorpay_payment_id })
    .eq('razorpay_order_id', razorpay_order_id)
    .eq('freelancer_id', user.id)

  await adminClient
    .from('freelancer_profiles')
    .update({ mock_test_paid: true })
    .eq('id', user.id)

  return NextResponse.json({ success: true })
}
