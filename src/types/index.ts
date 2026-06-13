export type UserRole = 'freelancer' | 'client' | 'admin'

export type JobCategory =
  | 'content_writer' | 'copywriter' | 'technical_writer'
  | 'ui_ux_designer' | 'graphic_designer'
  | 'frontend_developer' | 'backend_developer' | 'fullstack_developer'
  | 'seo_consultant' | 'digital_marketing_strategist'

export const JOB_CATEGORY_LABELS: Record<JobCategory, string> = {
  content_writer: 'Content Writer',
  copywriter: 'Copywriter',
  technical_writer: 'Technical Writer',
  ui_ux_designer: 'UI/UX Designer',
  graphic_designer: 'Graphic Designer',
  frontend_developer: 'Frontend Developer',
  backend_developer: 'Backend Developer',
  fullstack_developer: 'Full-Stack Developer',
  seo_consultant: 'SEO Consultant',
  digital_marketing_strategist: 'Digital Marketing Strategist',
}

export interface Profile {
  id: string
  role: UserRole
  full_name: string
  email: string
  created_at: string
}

export interface FreelancerProfile {
  id: string
  mock_test_paid: boolean
  mock_test_passed: boolean
  portfolio_url: string | null
  linkedin_url: string | null
  subscription_active: boolean
  subscription_expires_at: string | null
  last_bid_date: string | null
}

export interface JobPost {
  id: string
  client_id: string
  title: string
  description: string
  category: JobCategory
  budget_min: number
  budget_max: number
  duration: string
  status: 'draft' | 'active' | 'closed' | 'awarded'
  created_at: string
}

export interface Bid {
  id: string
  job_id: string
  freelancer_id: string
  proposal_text: string
  bid_amount: number
  bid_date: string
  created_at: string
}
