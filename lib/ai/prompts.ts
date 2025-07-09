export function getRecipeGenerationPrompt(preferences: any) {
  const currentMonth = new Date().toLocaleString('en-US', { month: 'long' })
  
  return `Generate exactly 3 seasonal Swiss recipes for ${currentMonth}.

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

Return a JSON array with exactly 3 recipe objects. Each recipe MUST have this exact structure:
{
  "title": "Recipe Name",
  "description": "1-2 sentence description",
  "servings": 2,
  "prepTime": 15,
  "cookingTime": 30,
  "ingredients": [
    {"name": "ingredient name", "quantity": "200", "unit": "g"},
    {"name": "another ingredient", "quantity": "1", "unit": "piece"}
  ],
  "instructions": ["Step 1: Do this", "Step 2: Do that"],
  "seasonalNote": "Why this recipe is perfect for ${currentMonth} in Switzerland"
}

IMPORTANT: 
- Return ONLY the JSON array, no other text
- Each ingredient MUST have name, quantity, and unit properties
- Include 6-10 ingredients per recipe
- Include 4-8 instruction steps per recipe`
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