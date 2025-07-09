export function generateRetailerLinks(ingredient: string) {
  const encodedIngredient = encodeURIComponent(ingredient)
  
  return {
    migros: `https://www.migros.ch/en/search?query=${encodedIngredient}`,
    coop: `https://www.coop.ch/en/search/?q=${encodedIngredient}`,
  }
}

export function formatIngredientForSearch(ingredient: string): string {
  // Remove common measurements and units for better search results
  const cleanedIngredient = ingredient
    .toLowerCase()
    .replace(/\d+\s*(g|kg|ml|l|cup|cups|tbsp|tsp|piece|pieces)/gi, '')
    .trim()
  
  return cleanedIngredient
}