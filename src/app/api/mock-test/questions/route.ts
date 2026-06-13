import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data: freelancer } = await adminClient
    .from('freelancer_profiles')
    .select('mock_test_paid')
    .eq('id', user.id)
    .single()

  if (!freelancer?.mock_test_paid) {
    return NextResponse.json({ error: 'Payment required before taking the test' }, { status: 403 })
  }

  // Find the latest successful payment with no attempt yet
  const { data: payment } = await adminClient
    .from('mock_test_payments')
    .select('id')
    .eq('freelancer_id', user.id)
    .eq('status', 'success')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!payment) {
    return NextResponse.json({ error: 'No valid payment found' }, { status: 403 })
  }

  const { data: existingAttempt } = await adminClient
    .from('mock_test_attempts')
    .select('id')
    .eq('payment_id', payment.id)
    .single()

  if (existingAttempt) {
    return NextResponse.json({ error: 'You have already attempted this test' }, { status: 400 })
  }

  // CRITICAL: never include correct_answer
  const { data: questions, error } = await adminClient
    .from('mock_test_questions')
    .select('id, question_text, option_a, option_b, option_c, option_d, category')
    .eq('is_active', true)
    .limit(20)

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch questions' }, { status: 500 })
  }

  return NextResponse.json({ questions, paymentId: payment.id })
}
