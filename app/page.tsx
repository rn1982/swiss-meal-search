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
          Planification de repas intelligente pour les ménages suisses occupés
        </p>
        
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold mb-6">Commencer</h2>
          <p className="text-gray-600 mb-6">
            Partagez vos préférences et nous générerons des recettes saisonnières personnalisées
            avec des listes de courses pour les supermarchés suisses.
          </p>
          <Link href="/preferences">
            <Button size="lg" className="w-full sm:w-auto">
              Planifier mes repas
            </Button>
          </Link>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-semibold text-lg mb-2">Recettes saisonnières</h3>
            <p className="text-gray-600 text-sm">
              Découvrez des recettes suisses utilisant des ingrédients frais et de saison
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-semibold text-lg mb-2">Listes de courses intelligentes</h3>
            <p className="text-gray-600 text-sm">
              Obtenez des listes organisées avec liens directs vers Migros & Coop
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow">
            <h3 className="font-semibold text-lg mb-2">Gagnez du temps</h3>
            <p className="text-gray-600 text-sm">
              Passez moins de temps à planifier et plus de temps à savourer vos repas
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}