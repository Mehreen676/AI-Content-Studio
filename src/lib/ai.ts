// AI utility that works both locally (via .z-ai-config) and in Docker/remote (via env variables)
// Set these env vars in Docker: ZAI_BASE_URL, ZAI_API_KEY, ZAI_CHAT_ID, ZAI_USER_ID, ZAI_TOKEN
// If no config is available, falls back to demo/mock mode

interface AIConfig {
  baseUrl: string
  apiKey: string
  chatId?: string
  userId?: string
  token?: string
}

let cachedConfig: AIConfig | null = null
let configAvailable = true

async function getAIConfig(): Promise<AIConfig | null> {
  if (!configAvailable && !cachedConfig) return null
  if (cachedConfig) return cachedConfig

  // First try environment variables (for Docker/HF deployment)
  const envBaseUrl = process.env.ZAI_BASE_URL
  const envApiKey = process.env.ZAI_API_KEY

  if (envBaseUrl && envApiKey) {
    cachedConfig = {
      baseUrl: envBaseUrl,
      apiKey: envApiKey,
      chatId: process.env.ZAI_CHAT_ID,
      userId: process.env.ZAI_USER_ID,
      token: process.env.ZAI_TOKEN,
    }
    return cachedConfig
  }

  // Fall back to z-ai-web-dev-sdk (uses .z-ai-config file locally)
  try {
    const ZAI = (await import('z-ai-web-dev-sdk')).default
    const zai = await ZAI.create()
    // Extract config from the SDK instance
    cachedConfig = (zai as any).config as AIConfig
    return cachedConfig
  } catch {
    console.warn('AI configuration not found. AI features will use demo mode.')
    configAvailable = false
    return null
  }
}

export interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// Generate demo content when AI service is unavailable
function generateDemoContent(type: string, topic: string, tone: string): string {
  const toneAdj = tone || 'professional'

  switch (type) {
    case 'blog':
      return `# ${topic}\n\n## Introduction\n\nIn today's rapidly evolving landscape, ${topic.toLowerCase()} has become more important than ever. This comprehensive guide explores the key aspects and provides actionable insights for professionals and enthusiasts alike.\n\n## Understanding the Fundamentals\n\nAt its core, ${topic.toLowerCase()} represents a significant shift in how we approach modern challenges. The ${toneAdj} perspective reveals several critical dimensions that deserve our attention.\n\n### Key Principles\n\n1. **Strategic Alignment** - Ensuring ${topic.toLowerCase()} initiatives align with broader organizational goals\n2. **Data-Driven Decision Making** - Leveraging analytics and insights to guide implementation\n3. **Continuous Improvement** - Adopting an iterative approach to refine and optimize outcomes\n4. **Stakeholder Engagement** - Building consensus and collaboration across teams\n\n## Best Practices and Strategies\n\nSuccessful implementation of ${topic.toLowerCase()} requires a structured approach. Here are proven strategies that deliver results:\n\n- Start with a clear vision and measurable objectives\n- Invest in the right tools and infrastructure\n- Build cross-functional teams with diverse expertise\n- Monitor progress and adjust course as needed\n\n## Real-World Applications\n\nOrganizations across industries are leveraging ${topic.toLowerCase()} to drive transformation. From startups to enterprise-level implementations, the principles remain consistent while the scale varies.\n\n## Conclusion\n\n${topic} continues to shape the future of innovation. By understanding its core principles and applying strategic frameworks, professionals can unlock significant value and stay ahead of the curve. The key is to start small, learn fast, and scale what works.\n\n---\n*This content was generated in demo mode. Connect an AI service for fully personalized content.*`

    case 'social':
      return `📱 **Short Post:**\n${topic} is transforming the game! Here's what you need to know... 🚀 #Innovation #Trending\n\n📝 **Medium Post:**\nExcited to share my thoughts on ${topic}! This is reshaping how we think about the future. Whether you're a beginner or expert, there's something here for everyone.\n\nKey takeaway: Stay curious, keep learning. 💡\n\n#${topic.replace(/\s+/g, '')} #Growth #Future\n\n📊 **Long Post:**\nLet's talk about ${topic} — one of the most ${toneAdj} shifts happening right now.\n\nI've been diving deep into this topic, and here are my top 3 insights:\n\n1️⃣ The landscape is evolving faster than ever\n2️⃣ Early adopters are seeing massive advantages\n3️⃣ The best time to get started is NOW\n\nWhat's your take? Drop your thoughts below! 👇\n\n#${topic.replace(/\s+/g, '')} #Innovation #Leadership #FutureOfWork\n\n---\n*Demo mode content. Connect AI service for personalized posts.*`

    case 'ad':
      return `🎯 **AIDA Framework:**\n\n**[Attention]** Tired of falling behind on ${topic}?\n**[Interest]** Discover how leading companies are using ${topic} to gain a competitive edge.\n**[Desire]** Imagine transforming your approach with proven, results-driven strategies.\n**[Action]** Start your free trial today → [Link]\n\n⚡ **PAS Framework:**\n\n**[Problem]** Struggling to keep up with ${topic} trends?\n**[Agitation]** While you're hesitating, your competitors are already miles ahead.\n**[Solution]** Our platform makes ${topic} simple. Get started in minutes.\n\n🌟 **BAB Framework:**\n\n**[Before]** You're overwhelmed by ${topic} complexity.\n**[After]** Imagine having clear, actionable insights at your fingertips.\n**[Bridge]** That's exactly what we deliver. Try it now →\n\n---\n*Demo mode content. Connect AI service for optimized ad copy.*`

    case 'email':
      return `**Subject Line Options:**\n1. 🚀 Transform Your Approach to ${topic}\n2. Urgent: ${topic} Changes Everything\n3. The ${topic} Secret Top Companies Know\n\n**Preview Text:** Discover the ${toneAdj} strategies that are reshaping the industry...\n\n---\n\nHi [Name],\n\nI hope this email finds you well. I wanted to reach out about something that could significantly impact your approach to ${topic}.\n\nWe've been working on innovative solutions that address the key challenges in ${topic}, and I believe they could be valuable for your team.\n\n**Here's what makes our approach different:**\n\n- Proven results with [X]+ organizations\n- ${toneAdj.charAt(0).toUpperCase() + toneAdj.slice(1)} methodology backed by research\n- Quick implementation with ongoing support\n\nWould you be open to a brief 15-minute call this week to explore this further?\n\nBest regards,\n[Your Name]\n\n---\n*Demo mode content. Connect AI service for personalized emails.*`

    case 'product':
      return `# ${topic}\n\n**Transform the way you work with ${topic}**\n\nAre you ready to elevate your ${toneAdj} game? Our solution delivers unmatched value and performance.\n\n## ✨ Key Features & Benefits\n\n1. **Smart Automation** — Save hours with intelligent workflow automation\n2. **Real-Time Analytics** — Make data-driven decisions instantly\n3. **Seamless Integration** — Works with your existing tools\n4. **Enterprise Security** — Bank-level encryption and compliance\n5. **24/7 Support** — Expert help whenever you need it\n\n## 🏆 What Customers Say\n\n> "This product revolutionized our approach to ${topic}. ROI within the first month!"\n> — Sarah M., VP of Operations\n\n## 📋 Technical Specifications\n\n- Cloud-based SaaS platform\n- 99.9% uptime SLA\n- API-first architecture\n- SOC 2 Type II certified\n\n**[Get Started Today →]**\n\n---\n*Demo mode content. Connect AI service for tailored product descriptions.*`

    case 'seo':
      return `**Title Tag:** ${topic}: The Complete Guide for ${new Date().getFullYear()}\n\n**Meta Description:** Discover expert strategies for ${topic.toLowerCase()}. Learn proven techniques, best practices, and actionable tips to succeed.\n\n---\n\n# ${topic}: The Complete Guide\n\n## What is ${topic}?\n\n${topic} represents a critical component of modern digital strategy. Understanding its fundamentals is essential for anyone looking to establish a strong online presence.\n\n## Why ${topic} Matters in ${new Date().getFullYear()}\n\nThe digital landscape continues to evolve, and ${topic.toLowerCase()} remains at the forefront of effective strategies. Organizations that prioritize this see measurable improvements in visibility and engagement.\n\n### Key Statistics\n- 87% of professionals consider ${topic.toLowerCase()} essential\n- Companies investing in ${topic.toLowerCase()} see 3x better results\n- The market is projected to grow by 45% in the next year\n\n## How to Get Started with ${topic}\n\n### Step 1: Audit Your Current Position\nAssess where you stand and identify opportunities for improvement.\n\n### Step 2: Develop a Strategy\nCreate a comprehensive plan with clear goals and timelines.\n\n### Step 3: Implement and Monitor\nExecute your strategy and track key performance indicators.\n\n## Internal Linking Suggestions\n- Link to related resources on ${topic.toLowerCase()}\n- Create pillar content clusters around key themes\n\n## Schema Markup Recommendations\n- Article schema for blog content\n- FAQ schema for common questions\n- HowTo schema for tutorial content\n\n---\n*Demo mode content. Connect AI service for SEO-optimized content.*`

    default:
      return `# ${topic}\n\nThis is a ${toneAdj} piece about ${topic.toLowerCase()}. In today's world, understanding ${topic.toLowerCase()} is essential for success.\n\n## Key Points\n\n- ${topic} is becoming increasingly important\n- A ${toneAdj} approach yields the best results\n- Continuous learning and adaptation are crucial\n\n---\n*Demo mode content. Connect AI service for fully personalized content.*`
  }
}

function generateDemoImprovement(content: string, action: string): string {
  switch (action) {
    case 'improve':
      return content + '\n\n[Improved version - enhanced clarity, stronger vocabulary, and better flow. Connect AI service for intelligent content improvement.]'
    case 'rewrite':
      return `[Rewritten version of your content with fresh language and structure while preserving the core message.]\n\n${content}\n\n[Connect AI service for intelligent content rewriting.]`
    case 'expand':
      return content + '\n\n**Additional Insights:**\n\nThis topic deserves deeper exploration. The nuances and implications extend far beyond the surface level, touching on fundamental principles that drive success in this domain.\n\n**Key Takeaway:** Understanding these concepts thoroughly provides a significant competitive advantage.\n\n[Connect AI service for intelligent content expansion.]'
    case 'shorten':
      return content.split('\n').filter((line: string) => line.trim()).slice(0, Math.ceil(content.split('\n').length / 2)).join('\n') + '\n\n[Condensed version. Connect AI service for intelligent content shortening.]'
    case 'grammar':
      return content + '\n\n[Grammar and spelling checked. Connect AI service for comprehensive grammar correction.]'
    default:
      return content
  }
}

export async function createChatCompletion(
  messages: ChatMessage[],
  options: { temperature?: number; max_tokens?: number; type?: string; topic?: string } = {}
): Promise<string> {
  const config = await getAIConfig()

  // If no config available, use demo mode
  if (!config) {
    // Extract type and topic from messages for demo content
    const userMessage = messages.find(m => m.role === 'user')?.content || ''
    const type = options.type || 'blog'
    const topic = options.topic || 'the topic'
    const tone = 'professional'
    console.log('Using demo mode for AI generation')
    return generateDemoContent(type, topic, tone)
  }

  const url = `${config.baseUrl}/chat/completions`
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.apiKey}`,
    'X-Z-AI-From': 'Z',
  }

  if (config.chatId) headers['X-Chat-Id'] = config.chatId
  if (config.userId) headers['X-User-Id'] = config.userId
  if (config.token) headers['X-Token'] = config.token

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        messages,
        temperature: options.temperature ?? 0.8,
        max_tokens: options.max_tokens ?? 4000,
        thinking: { type: 'disabled' },
      }),
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`AI API request failed with status ${response.status}: ${errorBody}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  } catch (error) {
    console.error('AI API error, falling back to demo mode:', error)
    const type = options.type || 'blog'
    const topic = options.topic || 'the topic'
    return generateDemoContent(type, topic, 'professional')
  }
}

export { generateDemoContent, generateDemoImprovement }
