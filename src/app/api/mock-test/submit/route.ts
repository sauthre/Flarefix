import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { answers } = await request.json()

  if (!answers || typeof answers !== 'object') {
    return NextResponse.json({ error: 'Invalid answers format' }, { status: 400 })
  }

  // Get latest successful payment with no attempt
  const { data: payment } = await adminClient
    .from('mock_test_payments')
    .select('id')
    .eq('freelancer_id', user.id)
    .eq('status', 'success')
    .order('created_at', { ascending: false })
    .limit(1)
    .single()

  if (!payment) {
    return NextResponse.json({ error: 'No valid payment found. Please pay to take the test.' }, { status: 403 })
  }

  const { data: existingAttempt } = await adminClient
    .from('mock_test_attempts')
    .select('id')
    .eq('payment_id', payment.id)
    .single()

  if (existingAttempt) {
    return NextResponse.json({ error: 'You have already submitted this attempt.' }, { status: 400 })
  }

  // Fetch questions with correct answers (server only)
  const questionIds = Object.keys(answers)
  const { data: questions, error: qError } = await adminClient
    .from('mock_test_questions')
    .select('id, correct_answer')
    .in('id', questionIds)

  if (qError || !questions) {
    return NextResponse.json({ error: 'Failed to grade test' }, { status: 500 })
  }

  let correct = 0
  for (const q of questions) {
    if (answers[q.id] === q.correct_answer) {
      correct++
    }
  }

  const score = Math.round((correct / questions.length) * 100)
  const passed = score >= 70

  await adminClient.from('mock_test_attempts').insert({
    freelancer_id: user.id,
    payment_id: payment.id,
    answers,
    score,
    passed,
  })

  if (passed) {
    await adminClient
      .from('freelancer_profiles')
      .update({ mock_test_passed: true })
      .eq('id', user.id)
  }

  // Never return correct answers
  return NextResponse.json({ passed, score })
}
