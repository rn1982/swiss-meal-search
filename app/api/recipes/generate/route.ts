import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getRecipeGenerationPrompt } from '@/lib/ai/prompts'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const preferences = await request.json()
    
    const prompt = getRecipeGenerationPrompt(preferences)
    
    const response = await anthropic.messages.create({
      model: 'claude-3-haiku-20240307',
      max_tokens: 4000,
      temperature: 0.7,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    })
    
    // Extract the text content from the response
    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }
    
    // Parse the JSON response
    let recipes
    try {
      // Find JSON in the response
      const jsonMatch = content.text.match(/\[[\s\S]*\]/)
      if (jsonMatch) {
        recipes = JSON.parse(jsonMatch[0])
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', content.text)
      throw new Error('Failed to parse recipe data')
    }
    
    return NextResponse.json({ recipes })
  } catch (error) {
    console.error('Recipe generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate recipes' },
      { status: 500 }
    )
  }
}