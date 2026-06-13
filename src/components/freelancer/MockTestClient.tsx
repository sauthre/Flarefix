'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/ui/Navbar'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'

interface Question {
  id: string
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  category: string
}

interface MockTestClientProps {
  mockTestPaid: boolean
  mockTestPassed: boolean
  canTakeTest: boolean
  mockTestPrice: number
  razorpayKeyId: string
}

declare global {
  interface Window {
    Razorpay: new (options: object) => { open(): void }
  }
}

const loadRazorpay = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window.Razorpay !== 'undefined') { resolve(true); return }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function MockTestClient({
  mockTestPaid,
  mockTestPassed,
  canTakeTest,
  mockTestPrice,
  razorpayKeyId,
}: MockTestClientProps) {
  const router = useRouter()
  const [paying, setPaying] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState<{ passed: boolean; score: number } | null>(null)
  const [error, setError] = useState('')

  const handlePay = async () => {
    setPaying(true)
    setError('')

    const loaded = await loadRazorpay()
    if (!loaded) {
      setError('Failed to load payment gateway. Please try again.')
      setPaying(false)
      return
    }

    const res = await fetch('/api/mock-test/pay', { method: 'POST' })
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Payment initiation failed')
      setPaying(false)
      return
    }

    const options = {
      key: razorpayKeyId,
      amount: data.amount,
      currency: data.currency,
      name: 'Flarefix',
      description: 'Ethics Mock Test',
      order_id: data.orderId,
      handler: async (response: {
        razorpay_payment_id: string
        razorpay_order_id: string
        razorpay_signature: string
      }) => {
        const verifyRes = await fetch('/api/mock-test/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_order_id: response.razorpay_order_id,
            razorpay_signature: response.razorpay_signature,
          }),
        })

        if (verifyRes.ok) {
          router.refresh()
        } else {
          setError('Payment verification failed. Contact support.')
        }
      },
      theme: { color: '#f59e0b' },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
    setPaying(false)
  }

  const handleLoadQuestions = async () => {
    const res = await fetch('/api/mock-test/questions')
    const data = await res.json()
    if (!res.ok) {
      setError(data.error)
      return
    }
    setQuestions(data.questions)
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      setError('Please answer all questions before submitting.')
      return
    }

    setSubmitting(true)
    setError('')

    const res = await fetch('/api/mock-test/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answers }),
    })

    const data = await res.json()
    if (!res.ok) {
      setError(data.error)
      setSubmitting(false)
      return
    }

    setResult(data)
    setSubmitting(false)
  }

  // Passed state
  if (mockTestPassed) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-white">
        <Navbar role="freelancer" />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <div className="text-6xl mb-6 text-emerald-400 font-bold">✓</div>
          <h1 className="text-3xl font-bold mb-4">You passed the ethics test</h1>
          <p className="text-gray-400 mb-8">
            Your ethics badge is active. You can now subscribe and start bidding.
          </p>
          <Button onClick={() => router.push('/freelancer/subscribe')}>
            Subscribe Now
          </Button>
        </div>
      </div>
    )
  }

  // Test result state
  if (result) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-white">
        <Navbar role="freelancer" />
        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          {result.passed ? (
            <>
              <div className="text-6xl mb-6 text-emerald-400 font-bold">✓</div>
              <h1 className="text-3xl font-bold mb-4">Congratulations — you passed!</h1>
              <p className="text-gray-400 mb-2">Score: {result.score}%</p>
              <p className="text-gray-400 mb-8">You can now subscribe and start bidding on jobs.</p>
              <Button onClick={() => router.push('/freelancer/subscribe')}>Subscribe Now</Button>
            </>
          ) : (
            <>
              <div className="text-6xl mb-6 text-red-400 font-bold">✗</div>
              <h1 className="text-3xl font-bold mb-4">You did not pass</h1>
              <p className="text-gray-400 mb-2">Score: {result.score}%</p>
              <p className="text-gray-400 mb-8">
                You need 70% or higher to pass. Pay 32 to try again.
              </p>
              <Button onClick={handlePay} loading={paying}>
                Pay 32 and Retry
              </Button>
            </>
          )}
        </div>
      </div>
    )
  }

  // Taking the test
  if (questions.length > 0) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-white">
        <Navbar role="freelancer" />
        <div className="max-w-3xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl font-bold">Ethics Mock Test</h1>
            <span className="text-gray-400 text-sm">
              {Object.keys(answers).length} / {questions.length} answered
            </span>
          </div>

          <div className="space-y-8">
            {questions.map((q, index) => (
              <Card key={q.id}>
                <p className="font-semibold mb-4">
                  <span className="text-amber-500 mr-2">{index + 1}.</span>
                  {q.question_text}
                </p>
                <div className="space-y-2">
                  {(['a', 'b', 'c', 'd'] as const).map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        answers[q.id] === opt
                          ? 'bg-amber-500/10 border border-amber-500'
                          : 'border border-[#2d3748] hover:border-gray-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name={q.id}
                        value={opt}
                        checked={answers[q.id] === opt}
                        onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                        className="mt-0.5 accent-amber-500"
                      />
                      <span className="text-sm">
                        <span className="font-semibold uppercase mr-2">{opt}.</span>
                        {q[`option_${opt}` as keyof Question]}
                      </span>
                    </label>
                  ))}
                </div>
              </Card>
            ))}
          </div>

          {error && <p className="text-red-400 text-sm mt-4">{error}</p>}

          <div className="mt-8">
            <Button
              onClick={handleSubmit}
              loading={submitting}
              disabled={Object.keys(answers).length < questions.length}
            >
              Submit Test ({Object.keys(answers).length}/{questions.length} answered)
            </Button>
          </div>
        </div>
      </div>
    )
  }

  // Can take test (paid, not yet attempted)
  if (canTakeTest) {
    return (
      <div className="min-h-screen bg-[#0a0e1a] text-white">
        <Navbar role="freelancer" />
        <div className="max-w-2xl mx-auto px-6 py-20">
          <h1 className="text-3xl font-bold mb-4">Ethics Mock Test</h1>
          <p className="text-gray-400 mb-8">
            Your payment is confirmed. You can now take the test. 20 questions,
            pass with 70% or higher.
          </p>
          <div className="space-y-3 mb-8">
            {[
              'Ethics in client relationships',
              'Professional communication standards',
              'Responsibility and accountability',
              'Platform rules and guidelines',
            ].map((topic) => (
              <div key={topic} className="flex items-center gap-2 text-gray-400 text-sm">
                <span className="text-amber-500">+</span>
                {topic}
              </div>
            ))}
          </div>
          {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
          <Button onClick={handleLoadQuestions}>Start Test</Button>
        </div>
      </div>
    )
  }

  // Not paid state
  return (
    <div className="min-h-screen bg-[#0a0e1a] text-white">
      <Navbar role="freelancer" />
      <div className="max-w-2xl mx-auto px-6 py-20">
        <h1 className="text-3xl font-bold mb-4">Ethics Mock Test</h1>
        <p className="text-gray-400 mb-8">
          The ethics test is the first gate to working on Flarefix. Pay 32
          to unlock it. Pass with 70% or higher to move forward.
        </p>

        <div className="bg-[#1a2235] border border-[#2d3748] rounded-lg p-6 mb-8">
          <h3 className="font-semibold mb-4">What the test covers</h3>
          <div className="space-y-3">
            {[
              { label: 'Ethics', desc: 'How you handle client relationships and trust' },
              { label: 'Communication', desc: 'Professional honesty and expectation setting' },
              { label: 'Responsibility', desc: 'Ownership of your work and commitments' },
              { label: 'Platform rules', desc: 'Understanding Flarefix policies' },
            ].map((item) => (
              <div key={item.label} className="flex gap-3">
                <span className="text-amber-500 text-xs font-semibold mt-0.5 uppercase">{item.label}</span>
                <span className="text-gray-400 text-sm">{item.desc}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1a2235] border border-amber-500/20 rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center">
            <div>
              <p className="font-semibold">One-time payment</p>
              <p className="text-gray-400 text-sm">Required per attempt</p>
            </div>
            <p className="text-2xl font-bold text-amber-500">32</p>
          </div>
        </div>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        <Button onClick={handlePay} loading={paying}>
          Pay 32 and Unlock Test
        </Button>
      </div>
    </div>
  )
}
