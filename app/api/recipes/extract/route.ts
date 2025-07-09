import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { getIngredientExtractionPrompt } from '@/lib/ai/prompts'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export async function POST(request: NextRequest) {
  try {
    const { recipes } = await request.json()
    
    const extractedIngredients = await Promise.all(
      recipes.map(async (recipe: any) => {
        const prompt = getIngredientExtractionPrompt(
          JSON.stringify({
            title: recipe.title,
            ingredients: recipe.ingredients,
          })
        )
        
        const response = await anthropic.messages.create({
          model: 'claude-3-haiku-20240307',
          max_tokens: 1000,
          temperature: 0.3,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        })
        
        const content = response.content[0]
        if (content.type !== 'text') {
          throw new Error('Unexpected response type')
        }
        
        try {
          const jsonMatch = content.text.match(/\[[\s\S]*\]/)
          if (jsonMatch) {
            return JSON.parse(jsonMatch[0])
          }
          throw new Error('No JSON found')
        } catch {
          // Fallback to original ingredients if extraction fails
          return recipe.ingredients
        }
      })
    )
    
    // Combine and deduplicate ingredients
    const allIngredients = extractedIngredients.flat()
    const uniqueIngredients = new Map()
    
    allIngredients.forEach((ingredient: any) => {
      const key = ingredient.name.toLowerCase()
      if (!uniqueIngredients.has(key)) {
        uniqueIngredients.set(key, ingredient)
      } else {
        // If duplicate, combine quantities (simplified logic)
        const existing = uniqueIngredients.get(key)
        uniqueIngredients.set(key, {
          ...existing,
          quantity: `${existing.quantity} + ${ingredient.quantity}`,
        })
      }
    })
    
    return NextResponse.json({
      ingredients: Array.from(uniqueIngredients.values()),
    })
  } catch (error) {
    console.error('Ingredient extraction error:', error)
    return NextResponse.json(
      { error: 'Failed to extract ingredients' },
      { status: 500 }
    )
  }
}