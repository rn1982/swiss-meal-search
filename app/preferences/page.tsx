'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'

const preferencesSchema = z.object({
  householdSize: z.string().min(1, 'Please select household size'),
  mealsPerDay: z.string().min(1, 'Please select meals per day'),
  cookingTime: z.string().min(1, 'Please select cooking time'),
  skillLevel: z.string().min(1, 'Please select skill level'),
  dietaryNeeds: z.array(z.string()).optional(),
})

type PreferencesForm = z.infer<typeof preferencesSchema>

export default function PreferencesPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [dietaryNeeds, setDietaryNeeds] = useState<string[]>([])

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PreferencesForm>({
    resolver: zodResolver(preferencesSchema),
  })

  const onSubmit = async (data: PreferencesForm) => {
    setIsSubmitting(true)
    
    // Store preferences in sessionStorage for MVP
    const preferences = {
      ...data,
      dietaryNeeds,
    }
    sessionStorage.setItem('userPreferences', JSON.stringify(preferences))
    
    // Navigate to recipe generation
    router.push('/recipes/generate')
  }

  const toggleDietaryNeed = (need: string) => {
    setDietaryNeeds(prev =>
      prev.includes(need)
        ? prev.filter(n => n !== need)
        : [...prev, need]
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Tell us about your preferences</CardTitle>
            <CardDescription>
              Help us create the perfect meal plan for you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="householdSize">Household Size</Label>
                <Select id="householdSize" {...register('householdSize')}>
                  <option value="">Select household size</option>
                  <option value="1">1 person</option>
                  <option value="2">2 people</option>
                  <option value="3">3 people</option>
                  <option value="4">4 people</option>
                  <option value="5">5+ people</option>
                </Select>
                {errors.householdSize && (
                  <p className="text-sm text-red-600">{errors.householdSize.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mealsPerDay">Meals per day</Label>
                <Select id="mealsPerDay" {...register('mealsPerDay')}>
                  <option value="">Select meals per day</option>
                  <option value="1">1 meal</option>
                  <option value="2">2 meals</option>
                  <option value="3">3 meals</option>
                </Select>
                {errors.mealsPerDay && (
                  <p className="text-sm text-red-600">{errors.mealsPerDay.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cookingTime">Maximum cooking time</Label>
                <Select id="cookingTime" {...register('cookingTime')}>
                  <option value="">Select cooking time</option>
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90+ minutes</option>
                </Select>
                {errors.cookingTime && (
                  <p className="text-sm text-red-600">{errors.cookingTime.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="skillLevel">Cooking skill level</Label>
                <Select id="skillLevel" {...register('skillLevel')}>
                  <option value="">Select skill level</option>
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </Select>
                {errors.skillLevel && (
                  <p className="text-sm text-red-600">{errors.skillLevel.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Dietary needs (optional)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    'Vegetarian',
                    'Vegan',
                    'No pork',
                    'No beef',
                    'Gluten-free',
                    'Dairy-free',
                    'Low-carb',
                    'Pescatarian',
                  ].map((need) => (
                    <label
                      key={need}
                      className="flex items-center space-x-2 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={dietaryNeeds.includes(need)}
                        onChange={() => toggleDietaryNeed(need)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm">{need}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Creating your meal plan...' : 'Generate meal plan'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}