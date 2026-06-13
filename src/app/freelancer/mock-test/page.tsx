import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import MockTestClient from '@/components/freelancer/MockTestClient'

export default async function MockTestPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: freelancer } = await adminClient
    .from('freelancer_profiles')
    .select('mock_test_paid, mock_test_passed')
    .eq('id', user.id)
    .single()

  // Check if they have a successful payment with no attempt yet
  let canTakeTest = false
  if (freelancer?.mock_test_paid) {
    const { data: payment } = await adminClient
      .from('mock_test_payments')
      .select('id')
      .eq('freelancer_id', user.id)
      .eq('status', 'success')
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (payment) {
      const { data: attempt } = await adminClient
        .from('mock_test_attempts')
        .select('id, passed, score')
        .eq('payment_id', payment.id)
        .single()

      canTakeTest = !attempt
    }
  }

  return (
    <MockTestClient
      mockTestPaid={freelancer?.mock_test_paid ?? false}
      mockTestPassed={freelancer?.mock_test_passed ?? false}
      canTakeTest={canTakeTest}
      mockTestPrice={parseInt(process.env.MOCK_TEST_PRICE || '3200')}
      razorpayKeyId={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ''}
    />
  )
}
