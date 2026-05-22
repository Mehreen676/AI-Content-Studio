import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

export async function POST(request: NextRequest) {
  try {
    const { type, topic, tone, keywords, platform, targetAudience, wordCount, additionalInstructions } = await request.json()

    if (!type || !topic) {
      return NextResponse.json({ error: 'type and topic are required' }, { status: 400 })
    }

    const zai = await ZAI.create()

    let systemPrompt = ''
    let userPrompt = ''

    const toneInstruction = `Write in a ${tone || 'professional'} tone.`
    const keywordsInstruction = keywords ? `Include these keywords naturally: ${keywords}.` : ''
    const audienceInstruction = targetAudience ? `Target audience: ${targetAudience}.` : ''
    const wordCountInstruction = wordCount ? `Aim for approximately ${wordCount} words.` : ''
    const extraInstructions = additionalInstructions ? `Additional instructions: ${additionalInstructions}.` : ''

    switch (type) {
      case 'blog':
        systemPrompt = 'You are an expert content writer and SEO specialist. Write engaging, well-structured blog posts that are informative and optimized for search engines. Use proper headings, subheadings, and formatting.'
        userPrompt = `Write a comprehensive blog post about "${topic}". ${toneInstruction} ${keywordsInstruction} ${audienceInstruction} ${wordCountInstruction} ${extraInstructions}

Structure the blog post with:
- An attention-grabbing title
- An engaging introduction that hooks the reader
- Multiple well-organized sections with clear subheadings
- Actionable takeaways or insights
- A compelling conclusion with a call-to-action

Make it informative, engaging, and valuable to the reader.`
        break

      case 'social':
        systemPrompt = 'You are a social media expert who creates viral, engaging content. Write social media posts that drive engagement, use effective hashtags, and match the platform best practices.'
        const platformContext = platform ? `Platform: ${platform}.` : 'Platform: General social media.'
        userPrompt = `Create social media content about "${topic}". ${platformContext} ${toneInstruction} ${keywordsInstruction} ${extraInstructions}

Generate:
- 3 different post variations (short, medium, long)
- Relevant hashtags for each post
- A call-to-action for engagement
- Emoji usage appropriate for the platform

Make the posts shareable and engaging.`
        break

      case 'ad':
        systemPrompt = 'You are a master copywriter specializing in advertising. Write compelling ad copy that converts, following proven copywriting frameworks like AIDA, PAS, or BAB.'
        userPrompt = `Write high-converting ad copy for "${topic}". ${toneInstruction} ${keywordsInstruction} ${audienceInstruction} ${extraInstructions}

Create 3 variations:
1. AIDA framework (Attention, Interest, Desire, Action)
2. PAS framework (Problem, Agitation, Solution)
3. BAB framework (Before, After, Bridge)

For each variation include:
- A powerful headline
- Compelling body copy
- A strong call-to-action
- Key benefits highlighted`
        break

      case 'email':
        systemPrompt = 'You are an email marketing expert who writes high-converting email sequences. Write emails with strong subject lines, engaging body content, and effective CTAs.'
        userPrompt = `Write a professional email about "${topic}". ${toneInstruction} ${keywordsInstruction} ${audienceInstruction} ${extraInstructions}

Include:
- 3 subject line options (including one with urgency)
- A compelling preview text
- Well-structured email body
- Clear call-to-action
- Professional sign-off

Make it personal, engaging, and action-oriented.`
        break

      case 'product':
        systemPrompt = 'You are an expert product description writer who creates compelling, conversion-focused copy. Write descriptions that highlight benefits, features, and social proof.'
        userPrompt = `Write a compelling product description for "${topic}". ${toneInstruction} ${keywordsInstruction} ${audienceInstruction} ${extraInstructions}

Include:
- An attention-grabbing headline
- A powerful opening statement
- Key features and their benefits (at least 5)
- Social proof / credibility elements
- Technical specifications section
- A strong call-to-action

Focus on benefits over features and use sensory, emotive language.`
        break

      case 'seo':
        systemPrompt = 'You are an SEO content specialist who writes content that ranks. You understand keyword optimization, meta descriptions, and search intent.'
        userPrompt = `Create SEO-optimized content for "${topic}". ${toneInstruction} ${keywordsInstruction} ${audienceInstruction} ${extraInstructions}

Generate:
- An SEO-optimized title tag (under 60 characters)
- A compelling meta description (under 160 characters)
- H1, H2, H3 heading suggestions
- SEO-optimized body content with natural keyword placement
- Internal linking suggestions
- Schema markup recommendations

Focus on search intent and readability.`
        break

      default:
        systemPrompt = 'You are an expert content writer. Write high-quality, engaging content.'
        userPrompt = `Write content about "${topic}". ${toneInstruction} ${keywordsInstruction} ${extraInstructions}`
    }

    const completion = await zai.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 4000,
    })

    const generatedContent = completion.choices[0]?.message?.content || ''

    return NextResponse.json({ content: generatedContent })
  } catch (error) {
    console.error('AI generation error:', error)
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 })
  }
}
