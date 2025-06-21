import React from 'react';
import { Star, Calendar, MapPin, Edit, Trash2, Heart } from 'lucide-react';
import { Cigar, TastingNote } from '../types';

interface CigarCardProps {
  cigar: Cigar;
  tastingNotes?: TastingNote[];
  onEdit: (cigar: Cigar) => void;
  onDelete: (id: string) => void;
  onAddTastingNote: (cigar: Cigar) => void;
  onToggleWishlist?: (id: string) => void;
  isWishlistView?: boolean;
}

export default function CigarCard({
  cigar,
  tastingNotes = [],
  onEdit,
  onDelete,
  onAddTastingNote,
  onToggleWishlist,
  isWishlistView = false
}: CigarCardProps) {
  const avgRating = tastingNotes.length > 0 
    ? tastingNotes.reduce((sum, note) => sum + note.rating, 0) / tastingNotes.length 
    : 0;

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Mild': return 'bg-green-100 text-green-800 border-green-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Full': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border-2 border-amber-200 hover:shadow-xl transition-all duration-300 hover:border-amber-300">
      <div className="p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-serif font-bold text-amber-900 mb-1">
              {cigar.brand}
            </h3>
            <p className="text-lg text-amber-800 font-medium">
              {cigar.name}
            </p>
          </div>
          <div className="flex space-x-2">
            {onToggleWishlist && (
              <button
                onClick={() => onToggleWishlist(cigar.id)}
                className={`p-2 rounded-full transition-colors ${
                  cigar.inWishlist 
                    ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }`}
              >
                <Heart className={`h-4 w-4 ${cigar.inWishlist ? 'fill-current' : ''}`} />
              </button>
            )}
            <button
              onClick={() => onEdit(cigar)}
              className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(cigar.id)}
              className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Details Grid */}
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

        {/* Strength and Price */}
        <div className="flex justify-between items-center mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStrengthColor(cigar.strength)}`}>
            {cigar.strength}
          </span>
          <div className="text-right">
            <p className="text-sm text-gray-600">Price</p>
            <p className="font-bold text-amber-900">${cigar.price}</p>
          </div>
        </div>

        {/* Quantity and Rating */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <p className="text-sm text-gray-600">Quantity</p>
            <p className="font-bold text-lg text-amber-900">{cigar.quantity}</p>
          </div>
          {avgRating > 0 && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Rating</p>
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="font-bold text-amber-900">{avgRating.toFixed(1)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Added Date */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <Calendar className="h-4 w-4" />
          <span>Added {new Date(cigar.addedDate).toLocaleDateString()}</span>
        </div>

        {/* Actions */}
        <div className="flex space-x-3">
          {!isWishlistView && (
            <button
              onClick={() => onAddTastingNote(cigar)}
              className="flex-1 bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors font-medium"
            >
              Add Tasting Note
            </button>
          )}
          {tastingNotes.length > 0 && (
            <span className="text-sm text-gray-600 self-center">
              {tastingNotes.length} tasting{tastingNotes.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}