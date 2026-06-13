import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import SubscribeClient from '@/components/freelancer/SubscribeClient'

export default async function SubscribePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: freelancer } = await adminClient
    .from('freelancer_profiles')
    .select('mock_test_passed, subscription_active, subscription_expires_at')
    .eq('id', user.id)
    .single()

  if (!freelancer?.mock_test_passed) redirect('/freelancer/mock-test')

  return (
    <SubscribeClient
      subscriptionActive={freelancer?.subscription_active ?? false}
      subscriptionExpiresAt={freelancer?.subscription_expires_at ?? null}
      subscriptionPrice={parseInt(process.env.SUBSCRIPTION_PRICE || '49900')}
      razorpayKeyId={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ''}
    />
  )
}
