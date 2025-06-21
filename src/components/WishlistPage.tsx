import React, { useState } from 'react';
import { Plus, Search, Heart } from 'lucide-react';
import { Cigar } from '../types';
import CigarCard from './CigarCard';
import AddCigarForm from './AddCigarForm';

interface WishlistPageProps {
  wishlist: Cigar[];
  onAddToWishlist: (cigar: Omit<Cigar, 'id'>) => void;
  onRemoveFromWishlist: (id: string) => void;
  onMoveToHumidor: (cigar: Cigar) => void;
}

export default function WishlistPage({
  wishlist,
  onAddToWishlist,
  onRemoveFromWishlist,
  onMoveToHumidor
}: WishlistPageProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredWishlist = wishlist.filter(cigar =>
    cigar.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cigar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cigar.country.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveCigar = (cigarData: Omit<Cigar, 'id'>) => {
    onAddToWishlist({ ...cigarData, inWishlist: true });
    setShowAddForm(false);
  };

  const handleEdit = (cigar: Cigar) => {
    // For wishlist, we'll move to humidor instead of editing
    onMoveToHumidor(cigar);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-red-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Heart className="h-8 w-8 text-red-600" />
            <div>
              <h1 className="text-2xl font-serif font-bold text-amber-900">My Wishlist</h1>
              <p className="text-gray-600">Cigars you'd like to try or purchase</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-red-600">{wishlist.length}</p>
            <p className="text-sm text-gray-600">cigars</p>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-amber-200">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search your wishlist..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add to Wishlist</span>
          </button>
        </div>
      </div>

      {/* Wishlist Grid */}
      {filteredWishlist.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-lg border-2 border-amber-200">
          <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-4">
            {wishlist.length === 0 ? 'Your wishlist is empty' : 'No cigars match your search'}
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Your First Wishlist Item</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWishlist.map((cigar) => (
            <div key={cigar.id} className="relative">
              <CigarCard
                cigar={cigar}
                onEdit={handleEdit}
                onDelete={onRemoveFromWishlist}
                onAddTastingNote={() => {}}
                isWishlistView={true}
              />
              <div className="absolute top-4 right-4">
                <div className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Wishlist
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Form */}
      <AddCigarForm
        isOpen={showAddForm}
        onClose={() => setShowAddForm(false)}
        onSave={handleSaveCigar}
      />
    </div>
  );
}