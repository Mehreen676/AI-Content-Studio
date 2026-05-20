'use client'

import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
import {
  Sparkles, Shield, FileText, Download, PenTool, Eye,
  ArrowRight, Check, Zap, Target, Users, Star
} from 'lucide-react'

const features = [
  { icon: Sparkles, title: 'AI Resume Writing', description: 'Generate professional resume content with AI. Get compelling summaries, experience descriptions, and skill suggestions in seconds.' },
  { icon: Shield, title: 'ATS Optimization', description: 'Analyze your resume against job descriptions to ensure it passes Applicant Tracking Systems. Get keyword matching and improvement tips.' },
  { icon: FileText, title: 'Professional Templates', description: 'Choose from beautifully designed resume templates. Professional, Modern, and Minimal styles to match your industry.' },
  { icon: Download, title: 'PDF Export', description: 'Download your polished resume as a high-quality PDF. Print-ready formatting that looks great on any device.' },
  { icon: PenTool, title: 'AI Cover Letters', description: 'Generate tailored cover letters for any job application. AI crafts personalized letters using your resume data.' },
  { icon: Eye, title: 'Live Preview', description: 'See your resume update in real-time as you edit. Instant visual feedback with multiple template previews.' },
]

const steps = [
  { step: '01', title: 'Enter Your Details', description: 'Fill in your personal info, experience, education, and skills. Our AI helps you write better content.' },
  { step: '02', title: 'AI Enhances & Optimizes', description: 'Our AI polishes your content, suggests improvements, and optimizes keywords for ATS compatibility.' },
  { step: '03', title: 'Download & Apply', description: 'Pick a template, preview your resume, and download as PDF. Land your dream job with confidence.' },
]

const testimonials = [
  { name: 'Sarah K.', role: 'Software Engineer', text: 'Got 3 interview calls in the first week after using ResumeAI. The ATS score feature is a game-changer!', rating: 5 },
  { name: 'Ahmed R.', role: 'Product Manager', text: 'The AI-generated summaries are incredibly professional. Saved me hours of writing and rewriting.', rating: 5 },
  { name: 'Lisa M.', role: 'UX Designer', text: 'Love the modern templates! My resume finally looks as good as my design portfolio.', rating: 5 },
]

export default function Landing() {
  const { openAuth, setUser, setView } = useAppStore()

  const handleGetStarted = async () => {
    openAuth('signup')
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-teal-50 to-white dark:from-emerald-950/30 dark:via-teal-950/20 dark:to-background" />
        <div className="absolute inset-0 opacity-30 dark:opacity-20">
          <div className="absolute top-20 left-10 h-72 w-72 rounded-full bg-emerald-200 blur-3xl dark:bg-emerald-800" />
          <div className="absolute bottom-20 right-10 h-96 w-96 rounded-full bg-teal-200 blur-3xl dark:bg-teal-800" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-20 sm:py-28 lg:py-36">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm font-medium bg-emerald-100 text-emerald-700 dark:bg-emerald-900 dark:text-emerald-300 border-0">
              <Sparkles className="mr-1.5 h-3.5 w-3.5" />
              AI-Powered Resume Builder
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
              Build Your Perfect Resume
              <span className="block bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                with AI
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground">
              Create ATS-optimized resumes in minutes. Our AI writes compelling content, 
              checks ATS compatibility, and generates cover letters — all in one place.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="w-full sm:w-auto bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-lg px-8 py-6"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => {
                  document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="w-full sm:w-auto text-lg px-8 py-6"
              >
                See How It Works
              </Button>
            </div>

            <div className="mt-10 flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-600" />
                Free to start
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-600" />
                No credit card
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-4 w-4 text-emerald-600" />
                ATS optimized
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 sm:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">
              Everything You Need to{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Land Your Dream Job
              </span>
            </h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Our AI-powered platform provides all the tools you need to create professional, 
              ATS-friendly resumes that get you interviews.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full border-border/50 hover:border-emerald-200 dark:hover:border-emerald-800 transition-colors group">
                    <CardContent className="p-6">
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-900 dark:to-teal-900 group-hover:from-emerald-200 group-hover:to-teal-200 dark:group-hover:from-emerald-800 dark:group-hover:to-teal-800 transition-colors">
                        <Icon className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">
              How It Works
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Three simple steps to your perfect resume
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative text-center"
              >
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xl font-bold shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30">
                  {step.step}
                </div>
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-emerald-300 to-teal-300 dark:from-emerald-700 dark:to-teal-700" />
                )}
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 sm:py-28 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">
              Loved by Job Seekers
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join thousands who have landed their dream jobs with ResumeAI
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Card className="h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed">&ldquo;{t.text}&rdquo;</p>
                    <div>
                      <p className="font-semibold text-sm">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 sm:py-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl sm:text-4xl font-bold">
              Simple, Transparent Pricing
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Start free, upgrade when you need more
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Free Plan */}
            <Card className="border-border/50">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-2">Free</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">$0</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['2 Resumes', 'AI Content Generation', '1 Template', 'ATS Score Check', 'Basic Cover Letter'].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleGetStarted}
                >
                  Get Started
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="border-emerald-200 dark:border-emerald-800 relative shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white border-0 px-3">
                  <Zap className="mr-1 h-3 w-3" />
                  Most Popular
                </Badge>
              </div>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-2">Pro</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-bold">$9</span>
                  <span className="text-muted-foreground">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {['Unlimited Resumes', 'AI Content Generation', 'All Templates', 'Unlimited ATS Checks', 'Unlimited Cover Letters', 'Priority Support', 'PDF Export'].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-emerald-600 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white"
                  onClick={handleGetStarted}
                >
                  Upgrade to Pro
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 sm:py-28 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Build Your Perfect Resume?
          </h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            Join thousands of professionals who use ResumeAI to create ATS-optimized resumes and land more interviews.
          </p>
          <Button
            size="lg"
            onClick={handleGetStarted}
            className="bg-white text-emerald-700 hover:bg-emerald-50 text-lg px-8 py-6"
          >
            Start Building For Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 font-bold">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white text-xs font-bold">
                R
              </div>
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ResumeAI
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <Target className="h-4 w-4" />
                ATS Optimized
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                10K+ Users
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="h-4 w-4" />
                AI Powered
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              &copy; 2026 ResumeAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
