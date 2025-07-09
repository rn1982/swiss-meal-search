export function getRecipeGenerationPrompt(preferences: any) {
  const currentMonth = new Date().toLocaleString('en-US', { month: 'long' })
  
  return `Generate 3 seasonal Swiss recipes for ${currentMonth}.

User preferences:
- Household size: ${preferences.householdSize} people
- Meals per day: ${preferences.mealsPerDay}
- Maximum cooking time: ${preferences.cookingTime} minutes
- Skill level: ${preferences.skillLevel}
- Dietary needs: ${preferences.dietaryNeeds?.join(', ') || 'None'}

Requirements:
1. Use ingredients commonly found in Swiss supermarkets (Migros, Coop)
2. Emphasize seasonal, local Swiss produce for ${currentMonth}
3. Provide clear, step-by-step instructions
4. Match the cooking time and skill level
5. Respect all dietary restrictions

For each recipe, provide:
- Title (in English)
- Description (1-2 sentences)
- Servings
- Prep time and cooking time
- List of ingredients with quantities
- Step-by-step instructions
- Why it's perfect for ${currentMonth} in Switzerland

Format as JSON array with 3 recipes.`
}

export function getIngredientExtractionPrompt(recipe: string) {
  return `Extract ONLY the main ingredients from this recipe. 
Ignore common pantry items like:
- Salt, pepper, basic spices
- Oil, butter (unless specific type needed)
- Water
- Basic seasonings

Recipe: ${recipe}

Return as JSON array with objects containing:
- name: ingredient name
- quantity: amount needed
- unit: measurement unit

Focus on ingredients that need to be purchased at the supermarket.`
}