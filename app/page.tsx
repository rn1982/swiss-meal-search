import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Swiss Meal Search
        </h1>
        <p className="text-center text-lg text-gray-600 mb-12">
          AI-powered meal planning for busy Swiss households
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Get Started</h2>
          <p className="text-gray-600 mb-6">
            Tell us about your preferences and we'll generate personalized, seasonal recipes
            with shopping lists for Swiss supermarkets.
          </p>
          <Link href="/preferences">
            <Button size="lg" className="w-full sm:w-auto">
              Start Meal Planning
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-semibold text-lg mb-2">Seasonal Recipes</h3>
            <p className="text-gray-600 text-sm">
              Discover Swiss recipes that use fresh, seasonal ingredients
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-semibold text-lg mb-2">Smart Shopping Lists</h3>
            <p className="text-gray-600 text-sm">
              Get organized lists with direct links to Migros & Coop
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-semibold text-lg mb-2">Save Time</h3>
            <p className="text-gray-600 text-sm">
              Spend less time planning and more time enjoying meals
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}