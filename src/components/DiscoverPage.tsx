import React, { useState } from 'react';
import { Search, MapPin, Star, Plus } from 'lucide-react';
import { cigarDatabase } from '../data/cigarDatabase';

interface DiscoverPageProps {
  onAddToWishlist: (cigar: any) => void;
  onAddToHumidor: (cigar: any) => void;
}

export default function DiscoverPage({ onAddToWishlist, onAddToHumidor }: DiscoverPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterStrength, setFilterStrength] = useState('');

  const countries = [...new Set(cigarDatabase.map(cigar => cigar.country))];

  const filteredCigars = cigarDatabase.filter(cigar => {
    const matchesSearch = 
      cigar.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cigar.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCountry = !filterCountry || cigar.country === filterCountry;
    const matchesStrength = !filterStrength || cigar.strength === filterStrength;
    
    return matchesSearch && matchesCountry && matchesStrength;
  });

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
          <Search className="h-8 w-8 text-amber-600" />
          <div>
            <h1 className="text-2xl font-serif font-bold text-amber-900">Discover Cigars</h1>
            <p className="text-gray-600">Browse our curated database of premium cigars</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-amber-200">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search cigars..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <select
            value={filterCountry}
            onChange={(e) => setFilterCountry(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Countries</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
          <select
            value={filterStrength}
            onChange={(e) => setFilterStrength(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
          >
            <option value="">All Strengths</option>
            <option value="Mild">Mild</option>
            <option value="Medium">Medium</option>
            <option value="Full">Full</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCigars.map((cigar) => (
          <div key={cigar.id} className="bg-white rounded-lg shadow-lg border-2 border-amber-200 hover:shadow-xl transition-all duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-serif font-bold text-amber-900 mb-1">
                    {cigar.brand}
                  </h3>
                  <p className="text-lg text-amber-800 font-medium">
                    {cigar.name}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-600">Size</p>
                  <p className="font-medium text-amber-900">{cigar.size}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Format</p>
                  <p className="font-medium text-amber-900">{cigar.format}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Country</p>
                  <div className="flex items-center space-x-1">
                    <MapPin className="h-4 w-4 text-amber-600" />
                    <p className="font-medium text-amber-900">{cigar.country}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Wrapper</p>
                  <p className="font-medium text-amber-900">{cigar.wrapper}</p>
                </div>
              </div>

              <div className="mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${
                  cigar.strength === 'Mild' ? 'bg-green-100 text-green-800 border-green-300' :
                  cigar.strength === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                  'bg-red-100 text-red-800 border-red-300'
                }`}>
                  {cigar.strength}
                </span>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Flavor Profile</p>
                <div className="flex flex-wrap gap-1">
                  {cigar.flavorProfile.map((flavor, index) => (
                    <span key={index} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full">
                      {flavor}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex space-x-2">
                <button
                  onClick={() => handleAddToWishlist(cigar)}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                >
                  Add to Wishlist
                </button>
                <button
                  onClick={() => handleAddToHumidor(cigar)}
                  className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors font-medium text-sm"
                >
                  Add to Humidor
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredCigars.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-lg border-2 border-amber-200">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            No cigars match your search criteria
          </p>
        </div>
      )}
    </div>
  );
}