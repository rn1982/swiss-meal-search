'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Clock, Users, ChefHat } from 'lucide-react'

interface Recipe {
  title: string
  description: string
  servings: number
  prepTime: number
  cookingTime: number
  ingredients: Array<{
    name: string
    quantity: string
    unit: string
  }>
  instructions: string[]
  seasonalNote: string
}

export default function GenerateRecipesPage() {
  const router = useRouter()
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [selectedRecipes, setSelectedRecipes] = useState<Set<number>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    generateRecipes()
  }, [])

  const generateRecipes = async () => {
    try {
      const preferencesStr = sessionStorage.getItem('userPreferences')
      if (!preferencesStr) {
        router.push('/preferences')
        return
      }

      const preferences = JSON.parse(preferencesStr)
      
      const response = await fetch('/api/recipes/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      })

      if (!response.ok) {
        throw new Error('Failed to generate recipes')
      }

      const data = await response.json()
      setRecipes(data.recipes)
      setIsLoading(false)
    } catch (err) {
      setError('Failed to generate recipes. Please try again.')
      setIsLoading(false)
    }
  }

  const toggleRecipeSelection = (index: number) => {
    const newSelection = new Set(selectedRecipes)
    if (newSelection.has(index)) {
      newSelection.delete(index)
    } else {
      newSelection.add(index)
    }
    setSelectedRecipes(newSelection)
  }

  const proceedToShoppingList = () => {
    const selected = Array.from(selectedRecipes).map(i => recipes[i])
    sessionStorage.setItem('selectedRecipes', JSON.stringify(selected))
    router.push('/shopping-list')
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Generating your personalized recipes...</h2>
          <p className="text-gray-600">This may take a few moments</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">{error}</h2>
          <Button onClick={() => router.push('/preferences')}>
            Back to preferences
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Your Seasonal Swiss Recipes</h1>
        
        <div className="space-y-6 mb-8">
          {recipes.map((recipe, index) => (
            <Card 
              key={index}
              className={`cursor-pointer transition-all ${
                selectedRecipes.has(index) 
                  ? 'ring-2 ring-blue-500 bg-blue-50' 
                  : 'hover:shadow-lg'
              }`}
              onClick={() => toggleRecipeSelection(index)}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{recipe.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {recipe.description}
                    </CardDescription>
                  </div>
                  <input
                    type="checkbox"
                    checked={selectedRecipes.has(index)}
                    onChange={() => toggleRecipeSelection(index)}
                    onClick={(e) => e.stopPropagation()}
                    className="h-5 w-5 text-blue-600"
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 text-sm text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {recipe.servings} servings
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {recipe.prepTime + recipe.cookingTime} min total
                  </div>
                </div>
                
                <div className="mb-4">
                  <h4 className="font-semibold mb-2">Ingredients:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {recipe.ingredients?.slice(0, 5).map((ing, i) => (
                      <li key={i}>• {ing.quantity} {ing.unit} {ing.name}</li>
                    ))}
                    {recipe.ingredients?.length > 5 && (
                      <li className="text-gray-400">
                        ...and {recipe.ingredients.length - 5} more ingredients
                      </li>
                    )}
                  </ul>
                </div>
                
                {recipe.instructions && recipe.instructions.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-semibold mb-2">Instructions:</h4>
                    <ol className="text-sm text-gray-600 space-y-1 list-decimal list-inside">
                      {recipe.instructions.slice(0, 3).map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                      {recipe.instructions.length > 3 && (
                        <li className="text-gray-400">
                          ...and {recipe.instructions.length - 3} more steps
                        </li>
                      )}
                    </ol>
                  </div>
                )}
                
                {recipe.seasonalNote && (
                  <p className="text-sm text-green-600 italic">
                    {recipe.seasonalNote}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="sticky bottom-0 bg-white p-4 shadow-lg rounded-lg">
          <div className="flex justify-between items-center">
            <p className="text-gray-600">
              {selectedRecipes.size} recipe{selectedRecipes.size !== 1 ? 's' : ''} selected
            </p>
            <div className="space-x-4">
              <Button 
                variant="outline"
                onClick={() => generateRecipes()}
              >
                Generate new recipes
              </Button>
              <Button 
                onClick={proceedToShoppingList}
                disabled={selectedRecipes.size === 0}
              >
                Create shopping list
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}