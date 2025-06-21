import React from 'react';
import { BarChart3, Star, TrendingUp } from 'lucide-react';
import { Cigar, TastingNote } from '../types';
import { cigarDatabase } from '../data/cigarDatabase';

interface RecommendationsPageProps {
  cigars: Cigar[];
  tastingNotes: TastingNote[];
  onAddToWishlist: (cigar: any) => void;
  onAddToHumidor: (cigar: any) => void;
}

export default function RecommendationsPage({
  cigars,
  tastingNotes,
  onAddToWishlist,
  onAddToHumidor
}: RecommendationsPageProps) {
  // Get user preferences based on highly rated cigars
  const getRecommendations = () => {
    const highRatedNotes = tastingNotes.filter(note => note.rating >= 4);
    const likedCigars = cigars.filter(cigar => 
      highRatedNotes.some(note => note.cigarId === cigar.id)
    );

    if (likedCigars.length === 0) {
      return cigarDatabase.slice(0, 6); // Show popular cigars if no preferences
    }

    // Get preferred strengths and countries
    const preferredStrengths = [...new Set(likedCigars.map(c => c.strength))];
    const preferredCountries = [...new Set(likedCigars.map(c => c.country))];
    const ownedBrands = new Set(cigars.map(c => c.brand));

    // Filter recommendations
    return cigarDatabase
      .filter(cigar => 
        (preferredStrengths.includes(cigar.strength) || 
         preferredCountries.includes(cigar.country)) &&
        !ownedBrands.has(cigar.brand)
      )
      .slice(0, 6);
  };

  const recommendations = getRecommendations();

  // Calculate stats
  const avgRating = tastingNotes.length > 0 
    ? tastingNotes.reduce((sum, note) => sum + note.rating, 0) / tastingNotes.length 
    : 0;

  const strengthPreference = cigars.reduce((acc, cigar) => {
    acc[cigar.strength] = (acc[cigar.strength] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topStrength = Object.entries(strengthPreference)
    .sort(([,a], [,b]) => b - a)[0]?.[0] || 'Medium';

  const handleAddToWishlist = (cigar: any) => {
    onAddToWishlist({
      brand: cigar.brand,
      name: cigar.name,
      size: cigar.size,
      format: cigar.format,
      country: cigar.country,
      strength: cigar.strength,
      wrapper: cigar.wrapper,
      price: 0,
      quantity: 1,
      addedDate: new Date().toISOString(),
      inWishlist: true
    });
  };

  const handleAddToHumidor = (cigar: any) => {
    onAddToHumidor({
      brand: cigar.brand,
      name: cigar.name,
      size: cigar.size,
      format: cigar.format,
      country: cigar.country,
      strength: cigar.strength,
      wrapper: cigar.wrapper,
      price: 0,
      quantity: 1,
      addedDate: new Date().toISOString()
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-amber-200">
        <div className="flex items-center space-x-3">
          <BarChart3 className="h-8 w-8 text-amber-600" />
          <div>
            <h1 className="text-2xl font-serif font-bold text-amber-900">Recommendations</h1>
            <p className="text-gray-600">Personalized suggestions based on your preferences</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-amber-200">
          <div className="flex items-center">
            <Star className="h-8 w-8 text-yellow-500" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-amber-900">
                {avgRating > 0 ? avgRating.toFixed(1) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-amber-200">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Preferred Strength</p>
              <p className="text-2xl font-bold text-amber-900">{topStrength}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-amber-200">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Tastings Logged</p>
              <p className="text-2xl font-bold text-amber-900">{tastingNotes.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-amber-200">
        <h2 className="text-xl font-serif font-bold text-amber-900 mb-4">
          Cigars You Might Enjoy
        </h2>
        
        {recommendations.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              Start rating cigars to get personalized recommendations!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((cigar) => (
              <div key={cigar.id} className="bg-gray-50 rounded-lg p-4 border border-amber-200 hover:border-amber-300 transition-colors">
                <div className="mb-3">
                  <h3 className="font-serif font-bold text-amber-900">{cigar.brand}</h3>
                  <p className="text-amber-800">{cigar.name}</p>
                  <p className="text-sm text-gray-600">{cigar.size} - {cigar.format}</p>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      cigar.strength === 'Mild' ? 'bg-green-100 text-green-800' :
                      cigar.strength === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {cigar.strength}
                    </span>
                    <span className="text-sm text-gray-600">{cigar.country}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1">
                    {cigar.flavorProfile.slice(0, 3).map((flavor, index) => (
                      <span key={index} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                        {flavor}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => handleAddToWishlist(cigar)}
                    className="flex-1 bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 transition-colors text-sm"
                  >
                    Wishlist
                  </button>
                  <button
                    onClick={() => handleAddToHumidor(cigar)}
                    className="flex-1 bg-amber-600 text-white py-2 px-3 rounded-lg hover:bg-amber-700 transition-colors text-sm"
                  >
                    Add to Humidor
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tips */}
      <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
        <h3 className="font-serif font-bold text-amber-900 mb-3">
          💡 Improve Your Recommendations
        </h3>
        <ul className="text-amber-800 space-y-2">
          <li>• Rate more cigars to get better suggestions</li>
          <li>• Add detailed tasting notes for more accurate recommendations</li>
          <li>• Try cigars from different regions and strengths</li>
          <li>• Keep track of aging times for optimal smoking experiences</li>
        </ul>
      </div>
    </div>
  );
}