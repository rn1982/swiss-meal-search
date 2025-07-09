'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { generateRetailerLinks, formatIngredientForSearch } from '@/lib/retailers'
import { Download, ExternalLink, Check } from 'lucide-react'

interface Ingredient {
  name: string
  quantity: string
  unit: string
}

export default function ShoppingListPage() {
  const router = useRouter()
  const [ingredients, setIngredients] = useState<Ingredient[]>([])
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadShoppingList()
  }, [])

  const loadShoppingList = async () => {
    try {
      const recipesStr = sessionStorage.getItem('selectedRecipes')
      if (!recipesStr) {
        router.push('/preferences')
        return
      }

      const recipes = JSON.parse(recipesStr)
      
      // Extract ingredients from recipes
      const response = await fetch('/api/recipes/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipes }),
      })

      if (!response.ok) {
        throw new Error('Failed to extract ingredients')
      }

      const data = await response.json()
      setIngredients(data.ingredients)
      setIsLoading(false)
    } catch (err) {
      console.error('Failed to load shopping list:', err)
      setIsLoading(false)
    }
  }

  const toggleItem = (ingredientName: string) => {
    const newChecked = new Set(checkedItems)
    if (newChecked.has(ingredientName)) {
      newChecked.delete(ingredientName)
    } else {
      newChecked.add(ingredientName)
    }
    setCheckedItems(newChecked)
  }

  const exportList = () => {
    const listText = ingredients
      .map(ing => `${ing.quantity} ${ing.unit} ${ing.name}`)
      .join('\n')
    
    const blob = new Blob([listText], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'shopping-list.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-semibold mb-4">Création de votre liste de courses...</h2>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Votre liste de courses</h1>
          <Button onClick={exportList} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exporter la liste
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Ingrédients</CardTitle>
            <CardDescription>
              Cliquez sur les liens des détaillants pour rechercher directement les articles
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {ingredients.map((ingredient, index) => {
                const links = generateRetailerLinks(
                  formatIngredientForSearch(ingredient.name)
                )
                const isChecked = checkedItems.has(ingredient.name)
                
                return (
                  <div 
                    key={index}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      isChecked ? 'bg-gray-50 opacity-60' : 'bg-white'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => toggleItem(ingredient.name)}
                        className="h-5 w-5 text-blue-600"
                      />
                      <span className={isChecked ? 'line-through' : ''}>
                        {ingredient.quantity} {ingredient.unit} {ingredient.name}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      <a
                        href={links.migros}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-600 hover:text-orange-700 font-medium text-sm flex items-center gap-1"
                      >
                        Migros
                        <ExternalLink className="h-3 w-3" />
                      </a>
                      <a
                        href={links.coop}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-700 font-medium text-sm flex items-center gap-1"
                      >
                        Coop
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-between">
          <Button 
            variant="outline"
            onClick={() => router.push('/recipes/generate')}
          >
            Retour aux recettes
          </Button>
          <Button onClick={() => router.push('/')}>
            Nouveau plan de repas
          </Button>
        </div>
      </div>
    </div>
  )
}