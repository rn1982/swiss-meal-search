export function getRecipeGenerationPrompt(preferences: any) {
  const currentMonth = new Date().toLocaleString('fr-FR', { month: 'long' })
  
  // Map dietary needs from French to English for the AI
  const dietaryMap: any = {
    'Végétarien': 'Vegetarian',
    'Végétalien': 'Vegan',
    'Sans porc': 'No pork',
    'Sans bœuf': 'No beef',
    'Sans gluten': 'Gluten-free',
    'Sans lactose': 'Dairy-free',
    'Faible en glucides': 'Low-carb',
    'Pescétarien': 'Pescatarian'
  }
  
  const dietaryNeeds = preferences.dietaryNeeds?.map((need: string) => dietaryMap[need] || need).join(', ') || 'Aucun'
  
  return `Générez exactement 3 recettes suisses saisonnières pour ${currentMonth} EN FRANÇAIS.

Préférences utilisateur:
- Taille du ménage: ${preferences.householdSize} personnes
- Repas par jour: ${preferences.mealsPerDay}
- Temps de cuisson maximum: ${preferences.cookingTime} minutes
- Niveau de compétence: ${preferences.skillLevel === 'beginner' ? 'débutant' : preferences.skillLevel === 'intermediate' ? 'intermédiaire' : 'avancé'}
- Besoins alimentaires: ${dietaryNeeds}

Exigences:
1. Utilisez des ingrédients couramment trouvés dans les supermarchés suisses (Migros, Coop)
2. Mettez l'accent sur les produits suisses locaux et de saison pour ${currentMonth}
3. Fournissez des instructions claires, étape par étape
4. Respectez le temps de cuisson et le niveau de compétence
5. Respectez toutes les restrictions alimentaires

Retournez un tableau JSON avec exactement 3 objets de recette. Chaque recette DOIT avoir cette structure exacte (TOUT EN FRANÇAIS):
{
  "title": "Nom de la recette",
  "description": "Description de 1-2 phrases",
  "servings": 2,
  "prepTime": 15,
  "cookingTime": 30,
  "ingredients": [
    {"name": "nom de l'ingrédient", "quantity": "200", "unit": "g"},
    {"name": "autre ingrédient", "quantity": "1", "unit": "pièce"}
  ],
  "instructions": ["Étape 1: Faites ceci", "Étape 2: Faites cela"],
  "seasonalNote": "Pourquoi cette recette est parfaite pour ${currentMonth} en Suisse"
}

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