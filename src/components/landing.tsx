'use client'

import { useAppStore } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  PenTool,
  Sparkles,
  FileText,
  Megaphone,
  Mail,
  ShoppingBag,
  Search,
  Zap,
  Target,
  BarChart3,
  ArrowRight,
  CheckCircle2,
  Star,
  Quote,
} from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: FileText,
    title: 'Blog Post Generator',
    description: 'Create SEO-optimized blog posts with engaging introductions, structured sections, and compelling conclusions in seconds.',
    color: 'from-emerald-500 to-green-600',
  },
  {
    icon: Sparkles,
    title: 'Social Media Content',
    description: 'Generate viral social media posts tailored for each platform — Instagram, Twitter, LinkedIn, and Facebook with hashtags.',
    color: 'from-pink-500 to-rose-600',
  },
  {
    icon: Megaphone,
    title: 'Ad Copy Generator',
    description: 'Write high-converting ad copy using proven frameworks like AIDA, PAS, and BAB for Google and Facebook Ads.',
    color: 'from-amber-500 to-orange-600',
  },
  {
    icon: Mail,
    title: 'Email Templates',
    description: 'Craft professional emails with compelling subject lines, engaging body content, and effective calls-to-action.',
    color: 'from-sky-500 to-blue-600',
  },
  {
    icon: ShoppingBag,
    title: 'Product Descriptions',
    description: 'Write conversion-focused product descriptions that highlight benefits, features, and drive sales.',
    color: 'from-violet-500 to-purple-600',
  },
  {
    icon: Search,
    title: 'SEO Content',
    description: 'Generate search-optimized content with proper keyword placement, meta descriptions, and heading structure.',
    color: 'from-teal-500 to-cyan-600',
  },
]

const stats = [
  { label: 'Content Generated', value: '50K+' },
  { label: 'Active Users', value: '2,500+' },
  { label: 'Content Types', value: '6+' },
  { label: 'Avg. Time Saved', value: '80%' },
]

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Content Manager',
    content: 'ContentAI has completely transformed our content workflow. What used to take hours now takes minutes. The blog post generator alone saves our team 15+ hours per week.',
    rating: 5,
  },
  {
    name: 'Mike Chen',
    role: 'Marketing Director',
    content: 'The ad copy generator is incredibly good. We\'ve seen a 40% improvement in our ad click-through rates since switching to AI-generated copy. The AIDA and PAS frameworks are game-changers.',
    rating: 5,
  },
  {
    name: 'Emily Rodriguez',
    role: 'Freelance Writer',
    content: 'As a freelancer, ContentAI helps me deliver more projects in less time. The tone customization is spot-on, and the content quality is consistently impressive. My clients love the results.',
    rating: 5,
  },
]

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: 'forever',
    features: ['5 content generations/month', 'Blog & social media types', 'Basic tone options', 'Content history'],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    price: '$19',
    period: '/month',
    features: [
      'Unlimited generations',
      'All content types',
      'Advanced tone & style',
      'Content improvement tools',
      'Export to PDF/Word',
      'Priority support',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: '$49',
    period: '/month',
    features: [
      'Everything in Pro',
      'Team collaboration',
      'Custom templates',
      'API access',
      'Brand voice training',
      'Dedicated support',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
]

export default function Landing() {
  const { setAuthDialogOpen, setCurrentView } = useAppStore()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-teal-50/30 to-transparent dark:from-emerald-950/20 dark:via-teal-950/10" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border-0 px-4 py-1.5">
              <Zap className="h-3.5 w-3.5 mr-1.5" />
              AI-Powered Content Creation
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Create Stunning Content
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                10x Faster with AI
              </span>
            </h1>
            <p className="mx-auto max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10">
              Generate blog posts, social media content, ad copy, emails, product descriptions, and
              SEO content — all with the power of AI. Professional quality in seconds, not hours.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                onClick={() => setAuthDialogOpen(true)}
                className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white px-8 h-12 text-base"
              >
                Start Creating for Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setCurrentView('templates')}
                className="px-8 h-12 text-base"
              >
                View Templates
              </Button>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-16 grid grid-cols-2 sm:grid-cols-4 gap-8 max-w-3xl mx-auto"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything You Need to Create
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                {' '}Amazing Content
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Six powerful AI generators, one simple platform. Create any type of content with
              professional quality and consistent brand voice.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-all duration-300 border-0 bg-background/80 backdrop-blur group">
                  <CardContent className="p-6">
                    <div
                      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.color} text-white mb-4 group-hover:scale-110 transition-transform`}
                    >
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three simple steps to create professional content in seconds
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Choose Content Type',
                desc: 'Select from blog posts, social media, ad copy, emails, product descriptions, or SEO content.',
                icon: Target,
              },
              {
                step: '02',
                title: 'Customize & Generate',
                desc: 'Set your topic, tone, keywords, and target audience. Our AI creates tailored content instantly.',
                icon: Sparkles,
              },
              {
                step: '03',
                title: 'Edit & Export',
                desc: 'Refine with AI-powered tools, save to your library, and export in your preferred format.',
                icon: BarChart3,
              },
            ].map((item, index) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="text-center"
              >
                <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 text-white mb-4">
                  <item.icon className="h-7 w-7" />
                </div>
                <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                  STEP {item.step}
                </p>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Loved by Creators</h2>
            <p className="text-lg text-muted-foreground">
              See what content creators and marketers are saying
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="h-full border-0 bg-background/80 backdrop-blur">
                  <CardContent className="p-6">
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <Quote className="h-5 w-5 text-muted-foreground/30 mb-2" />
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{t.content}</p>
                    <div>
                      <p className="text-sm font-semibold">{t.name}</p>
                      <p className="text-xs text-muted-foreground">{t.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-muted-foreground">
              Start free, upgrade when you need more power
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card
                  className={`h-full relative ${
                    plan.popular
                      ? 'border-2 border-emerald-500 shadow-lg shadow-emerald-500/10'
                      : 'border-0 bg-background/80'
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-0 px-3">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-1">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-4">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      <span className="text-muted-foreground text-sm">{plan.period}</span>
                    </div>
                    <ul className="space-y-3 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      className={`w-full ${
                        plan.popular
                          ? 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white'
                          : ''
                      }`}
                      variant={plan.popular ? 'default' : 'outline'}
                      onClick={() => setAuthDialogOpen(true)}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Content Creation?
          </h2>
          <p className="text-lg text-emerald-100 mb-8">
            Join thousands of creators who are already using AI to produce better content, faster.
          </p>
          <Button
            size="lg"
            variant="secondary"
            onClick={() => setAuthDialogOpen(true)}
            className="px-8 h-12 text-base"
          >
            Start Creating for Free
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
                <PenTool className="h-4 w-4" />
              </div>
              <span className="font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ContentAI
              </span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2026 ContentAI. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
