export function getRecipeGenerationPrompt(preferences: any) {
  const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long' })
  
  // Calculate number of recipes needed for 5 days
  const recipesNeeded = parseInt(preferences.mealsPerDay) * 5
  
  // Map dietary needs from French to English for the AI
  const dietaryMap: any = {
    'Végétarien': 'Vegetarian',
    'Végétalien': 'Vegan',
    'Sans porc': 'No pork',
    'Sans gluten': 'Gluten-free',
    'Sans lactose': 'Dairy-free',
  }
  
  const dietaryNeeds = preferences.dietaryNeeds?.map((need: string) => dietaryMap[need] || need).join(', ') || 'Aucun'
  
  return `Générez exactement ${recipesNeeded} recettes suisses VARIÉES et saisonnières pour ${currentMonth} EN FRANÇAIS. IMPORTANT: Assurez une grande diversité dans les types de plats (entrées, plats principaux, accompagnements), les techniques de cuisson et les ingrédients principaux.

Préférences utilisateur:
- Taille du ménage: ${preferences.householdSize} personnes
- Repas par jour: ${preferences.mealsPerDay}
- Temps de préparation TOTAL maximum: ${preferences.cookingTime} minutes
- Niveau de compétence: ${preferences.skillLevel === 'beginner' ? 'débutant' : preferences.skillLevel === 'intermediate' ? 'intermédiaire' : 'avancé'}
- Besoins alimentaires: ${dietaryNeeds}

Exigences CRITIQUES:
1. CHAQUE recette DOIT avoir un temps TOTAL (prepTime + cookingTime) ≤ ${preferences.cookingTime} minutes
2. Les portions DOIVENT être pour ${preferences.householdSize} personne(s)
3. Utilisez des ingrédients couramment trouvés dans les supermarchés suisses (Migros, Coop)
4. Mettez l'accent sur les produits suisses locaux et de saison pour ${currentMonth}
5. Fournissez des instructions claires, étape par étape
6. Respectez STRICTEMENT le temps maximum et le niveau de compétence
7. Respectez toutes les restrictions alimentaires

Retournez un tableau JSON avec exactement ${recipesNeeded} objets de recette. Chaque recette DOIT avoir cette structure exacte (TOUT EN FRANÇAIS):
{
  "title": "Nom de la recette",
  "description": "Description de 1-2 phrases",
  "servings": ${preferences.householdSize},
  "prepTime": 10,
  "cookingTime": 20,
  "ingredients": [
    {"name": "nom de l'ingrédient", "quantity": "200", "unit": "g"},
    {"name": "autre ingrédient", "quantity": "1", "unit": "pièce"}
  ],
  "instructions": ["Étape 1: Faites ceci", "Étape 2: Faites cela"]
}

RAPPEL CRITIQUE: prepTime + cookingTime DOIT être ≤ ${preferences.cookingTime} minutes pour CHAQUE recette!

IMPORTANT: 
- Retournez UNIQUEMENT le tableau JSON, aucun autre texte
- Tous les textes doivent être en FRANÇAIS
- Chaque ingrédient DOIT avoir les propriétés name, quantity et unit
- Incluez 6-10 ingrédients par recette
- Incluez 4-8 étapes d'instructions par recette`
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