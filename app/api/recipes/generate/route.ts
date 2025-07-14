import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getRecipeGenerationPrompt } from '@/lib/ai/prompts'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    // Check if API key exists
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set')
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      )
    }
    
    const preferences = await request.json()
    
    const prompt = getRecipeGenerationPrompt(preferences)
    
    const response = await anthropic.messages.create({
      model: 'claude-3-5-haiku-20241022',
      max_tokens: 8000,
      temperature: 0.8,
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
      // Try to parse the entire response as JSON first
      recipes = JSON.parse(content.text)
    } catch (firstError) {
      // If that fails, try to find JSON array in the response
      try {
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
    }
    
    // Validate recipe structure
    if (!Array.isArray(recipes) || recipes.length === 0) {
      throw new Error('Invalid recipe format')
    }
    
    // Ensure all recipes have required fields
    recipes = recipes.map(recipe => ({
      title: recipe.title || 'Untitled Recipe',
      description: recipe.description || '',
      servings: recipe.servings || 2,
      prepTime: recipe.prepTime || 15,
      cookingTime: recipe.cookingTime || 30,
      ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients : [],
      instructions: Array.isArray(recipe.instructions) ? recipe.instructions : []
    }))
    
    return NextResponse.json({ recipes })
  } catch (error) {
    console.error('Recipe generation error:', error)
    
    // More specific error messages
    if (error instanceof Error) {
      if (error.message.includes('API key')) {
        return NextResponse.json(
          { error: 'API key error: ' + error.message },
          { status: 500 }
        )
      }
      if (error.message.includes('rate limit')) {
        return NextResponse.json(
          { error: 'Rate limit exceeded. Please try again later.' },
          { status: 429 }
        )
      }
      return NextResponse.json(
        { error: 'Error: ' + error.message },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: 'Failed to generate recipes' },
      { status: 500 }
    )
  }
}