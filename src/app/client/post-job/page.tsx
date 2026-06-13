import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { adminClient } from '@/lib/supabase/admin'
import PostJobClient from '@/components/client/PostJobClient'

export default async function PostJobPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/auth/login')

  const { data: profile } = await adminClient
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single()

  if (!profile || profile.role !== 'client') redirect('/freelancer/dashboard')

  return (
    <PostJobClient
      jobPostPrice={parseInt(process.env.JOB_POST_PRICE || '19900')}
      razorpayKeyId={process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || ''}
    />
  )
}
