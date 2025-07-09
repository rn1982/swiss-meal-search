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
          <p className="text-gray-600 mb-4">
            Tell us about your preferences and we'll generate personalized, seasonal recipes
            with shopping lists for Swiss supermarkets.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            Start Meal Planning
          </button>
        </div>
      </div>
    </div>
  )
}