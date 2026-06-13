-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles (linked to Supabase auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('freelancer', 'client', 'admin')),
  full_name TEXT,
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Freelancer profiles
CREATE TABLE freelancer_profiles (
  id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  mock_test_paid BOOLEAN DEFAULT FALSE,
  mock_test_passed BOOLEAN DEFAULT FALSE,
  portfolio_url TEXT,
  linkedin_url TEXT,
  subscription_active BOOLEAN DEFAULT FALSE,
  subscription_expires_at TIMESTAMPTZ,
  last_bid_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mock test payments
CREATE TABLE mock_test_payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  freelancer_id UUID NOT NULL REFERENCES freelancer_profiles(id),
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  amount INTEGER NOT NULL DEFAULT 3200,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mock test questions (correct_answer NEVER returned to frontend)
CREATE TABLE mock_test_questions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_text TEXT NOT NULL,
  option_a TEXT NOT NULL,
  option_b TEXT NOT NULL,
  option_c TEXT NOT NULL,
  option_d TEXT NOT NULL,
  correct_answer TEXT NOT NULL CHECK (correct_answer IN ('a', 'b', 'c', 'd')),
  category TEXT NOT NULL CHECK (category IN ('ethics', 'communication', 'responsibility', 'platform_rules')),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mock test attempts
CREATE TABLE mock_test_attempts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  freelancer_id UUID NOT NULL REFERENCES freelancer_profiles(id),
  payment_id UUID NOT NULL REFERENCES mock_test_payments(id),
  answers JSONB NOT NULL,
  score INTEGER,
  passed BOOLEAN,
  attempted_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(payment_id) -- one attempt per payment
);

-- Job posts
CREATE TABLE job_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES profiles(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'content_writer', 'copywriter', 'technical_writer',
    'ui_ux_designer', 'graphic_designer',
    'frontend_developer', 'backend_developer', 'fullstack_developer',
    'seo_consultant', 'digital_marketing_strategist'
  )),
  budget_min INTEGER,
  budget_max INTEGER,
  duration TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'closed', 'awarded')),
  payment_verified BOOLEAN DEFAULT FALSE,
  razorpay_order_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Bids (UNIQUE constraint enforces 1 bid per freelancer per day at DB level)
CREATE TABLE bids (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id UUID NOT NULL REFERENCES job_posts(id),
  freelancer_id UUID NOT NULL REFERENCES freelancer_profiles(id),
  proposal_text TEXT NOT NULL,
  bid_amount INTEGER NOT NULL,
  bid_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(freelancer_id, bid_date) -- THE CORE SCARCITY RULE — enforced at DB level
);

-- Subscriptions
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  freelancer_id UUID NOT NULL REFERENCES freelancer_profiles(id),
  razorpay_payment_id TEXT,
  razorpay_order_id TEXT,
  amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired')),
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE freelancer_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE bids ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read their own profile
CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Freelancer profiles: own access only
CREATE POLICY "Freelancer reads own profile" ON freelancer_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Freelancer updates own profile" ON freelancer_profiles FOR UPDATE USING (auth.uid() = id);

-- Jobs: clients see their own, freelancers see active ones
CREATE POLICY "Clients see own jobs" ON job_posts FOR SELECT USING (auth.uid() = client_id);
CREATE POLICY "Freelancers see active jobs" ON job_posts FOR SELECT USING (status = 'active');

-- Bids: freelancers see own bids, clients see bids on their jobs
CREATE POLICY "Freelancers see own bids" ON bids FOR SELECT USING (auth.uid() = freelancer_id);
CREATE POLICY "Clients see bids on their jobs" ON bids FOR SELECT
  USING (EXISTS (SELECT 1 FROM job_posts WHERE job_posts.id = bids.job_id AND job_posts.client_id = auth.uid()));

-- Seed 20 mock test questions
INSERT INTO mock_test_questions (question_text, option_a, option_b, option_c, option_d, correct_answer, category) VALUES
('A client asks you to copy content from a competitor''s website for their blog. What do you do?',
 'Do it — client pays, client decides', 'Refuse and explain the copyright risk', 'Do it but change a few words', 'Ask for a higher rate first', 'b', 'ethics'),
('You finish a project but realize there is a minor bug. The client hasn''t noticed yet. What do you do?',
 'Wait to see if they notice', 'Fix it and tell the client proactively', 'Deny it if asked', 'Blame it on the client''s requirements', 'b', 'responsibility'),
('A client wants results in 3 days but you need 7. What is the right response?',
 'Promise 3 days and rush the work', 'Refuse the project', 'Honestly say 7 days and explain why', 'Say 5 days hoping they accept', 'c', 'communication'),
('A client asks you to inflate engagement metrics using fake accounts. What do you do?',
 'Do it — it''s what they want', 'Refuse and explain why it''s harmful', 'Do it once as a favor', 'Ask another freelancer to do it', 'b', 'ethics'),
('You receive payment for a job but realize you misunderstood the scope. What do you do?',
 'Keep the money and deliver something close', 'Immediately discuss the scope gap with the client', 'Refund and disappear', 'Blame the client for unclear brief', 'b', 'communication'),
('A client shares confidential business data with you to do your work. After the project ends, what do you do?',
 'Keep it — might be useful later', 'Delete or destroy all confidential data', 'Share it with peers for feedback', 'Use it for your own portfolio', 'b', 'ethics'),
('You''re midway through a project and realize you don''t have the skills to complete it well. What is the right action?',
 'Pretend and deliver poor work', 'Tell the client immediately and offer options', 'Hire someone else secretly', 'Ask for more money and try anyway', 'b', 'responsibility'),
('A client is rude during feedback. How should you respond?',
 'Be equally rude back', 'Ignore them and stop working', 'Stay professional and address the feedback calmly', 'Immediately end the contract', 'c', 'communication'),
('A new client offers double pay if you start today, but you already have a committed deadline with another client. What do you do?',
 'Take the new project and delay the old client', 'Honor your existing commitment and decline or negotiate the new one', 'Ask the old client for a deadline extension without reason', 'Do both and rush everything', 'b', 'responsibility'),
('You find a faster way to complete the project but it skips a step the client specifically asked for. What do you do?',
 'Skip the step — faster is better', 'Tell the client and get approval before changing the approach', 'Do it your way and don''t mention it', 'Charge the same rate for less work', 'b', 'ethics'),
('A client asks you to write a fake 5-star review for their business. What do you do?',
 'Do it — it''s just a review', 'Refuse — this is deceptive and unethical', 'Do it anonymously', 'Ask for extra payment first', 'b', 'ethics'),
('You disagree with a client''s creative direction. What is the professional response?',
 'Ignore their direction and do it your way', 'Share your perspective respectfully, then follow their final decision', 'Refuse to continue the project', 'Complain to other freelancers about the client', 'b', 'communication'),
('A client asks you to backdate a document to make it appear earlier than it was. What do you do?',
 'Do it — it''s a small favor', 'Refuse — falsifying dates is fraudulent', 'Do it but keep a copy for yourself', 'Ask why before deciding', 'b', 'ethics'),
('You delivered work on time but the client says it doesn''t meet expectations. What is the first step?',
 'Argue that you followed the brief', 'Ask for specific feedback to understand the gap', 'Offer a refund and leave', 'Blame unclear requirements', 'b', 'communication'),
('A client asks you to work outside the platform to avoid fees. What do you do?',
 'Agree — more money for both', 'Decline and explain the platform protects both parties', 'Ask how much they''d save first', 'Report them immediately without discussion', 'b', 'platform_rules'),
('You notice another freelancer is submitting plagiarized work on the platform. What do you do?',
 'Ignore it — not your problem', 'Report it to the platform admin', 'Copy their approach too', 'Confront them publicly', 'b', 'platform_rules'),
('A client asks for unlimited revisions beyond the agreed scope. What do you do?',
 'Keep revising — client is always right', 'Politely refer to the agreed scope and discuss additional terms', 'Stop working immediately', 'Do the revisions but charge secretly later', 'b', 'responsibility'),
('You accidentally send a wrong file containing another client''s data to a new client. What do you do?',
 'Hope they don''t notice', 'Immediately inform both clients and fix the mistake', 'Ask the new client to delete it quietly', 'Blame a technical error', 'b', 'ethics'),
('A client offers a bonus if you can guarantee their website will rank #1 on Google within 30 days. What do you say?',
 'Accept — it sounds great', 'Explain honestly that no one can guarantee Google rankings', 'Accept the bonus and disappear after 30 days', 'Say yes and hope for the best', 'b', 'responsibility'),
('You are offered a project that is technically legal but you personally find it unethical. What do you do?',
 'Always take the money', 'You have the right to decline work that conflicts with your values', 'Complain but take it anyway', 'Ask a friend to take it instead', 'b', 'ethics');
