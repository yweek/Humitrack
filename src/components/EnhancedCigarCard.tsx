import React from 'react';
import { Star, Calendar, MapPin, Edit, Trash2, Heart, Camera, Tag, AlertTriangle, Clock, Eye, Ruler, Globe, Zap, DollarSign, Package } from 'lucide-react';
import { Cigar, TastingNote } from '../types';
import { motion } from 'framer-motion';
import defaultCigarImg from '../assets/images/default-cigar.png';

interface EnhancedCigarCardProps {
  cigar: Cigar;
  tastingNotes?: TastingNote[];
  onEdit: (cigar: Cigar) => void;
  onDelete: (id: string) => void;
  onAddTastingNote: (cigar: Cigar) => void;
  onToggleWishlist?: (id: string) => void;
  isWishlistView?: boolean;
}

export default function EnhancedCigarCard({
  cigar,
  tastingNotes = [],
  onEdit,
  onDelete,
  onAddTastingNote,
  onToggleWishlist,
  isWishlistView = false
}: EnhancedCigarCardProps) {
  const avgRating = tastingNotes.length > 0 
    ? tastingNotes.reduce((sum, note) => sum + note.rating, 0) / tastingNotes.length 
    : 0;

  const getStrengthColor = (strength: string) => {
    switch (strength) {
      case 'Mild': return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border-green-300';
      case 'Medium': return 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border-yellow-300';
      case 'Full': return 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border-red-300';
      default: return 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border-gray-300';
    }
  };

  const getAgingTime = () => {
    if (!cigar.agingStartDate) return null;
    const agingStart = new Date(cigar.agingStartDate);
    const now = new Date();
    const days = Math.floor((now.getTime() - agingStart.getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const agingDays = getAgingTime();
  const isLowStock = cigar.lowStockAlert && cigar.quantity <= cigar.lowStockAlert;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      className={`bg-white rounded-2xl shadow-lg border border-amber-200 overflow-hidden transition-all duration-300 hover:shadow-xl ${
        isWishlistView ? 'flex' : 'flex flex-col'
      }`}
    >
      {/* Low Stock Alert - Smaller and less intrusive */}
      {cigar.lowStockAlert && cigar.quantity <= cigar.lowStockAlert && (
        <div className="bg-amber-50 border-b border-amber-200 px-3 py-1">
          <div className="flex items-center justify-center space-x-1">
            <AlertTriangle className="h-3 w-3 text-amber-600" />
            <span className="text-xs font-medium text-amber-700">
              Low Stock ({cigar.quantity} left)
            </span>
          </div>
        </div>
      )}

      {/* Cigar Image */}
      <div className={`relative ${isWishlistView ? 'w-32 h-32 flex-shrink-0' : 'w-full h-48'}`}>
        {cigar.photo ? (
          <img
            src={cigar.photo}
            alt={`${cigar.brand} ${cigar.name}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-amber-100 flex items-center justify-center">
            <img 
              src={defaultCigarImg} 
              alt="Default cigar" 
              className="w-full h-full object-contain p-2"
            />
          </div>
        )}
        
        {/* Quick Actions Overlay */}
        <div className="absolute top-2 right-2 flex space-x-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(cigar);
            }}
            className="p-2 bg-white/90 hover:bg-white rounded-xl text-amber-700 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(cigar.id);
            }}
            className="p-2 bg-white/90 hover:bg-white rounded-xl text-red-600 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        {/* Aging Badge */}
        {cigar.agingStartDate && (
          <div className="absolute bottom-2 left-2">
            <div className="px-2 py-1 bg-amber-600 text-white text-xs rounded-lg font-medium shadow-md">
              {Math.floor((new Date().getTime() - new Date(cigar.agingStartDate).getTime()) / (1000 * 60 * 60 * 24))}d
            </div>
          </div>
        )}
      </div>

      {/* Cigar Info */}
      <div className={`flex-1 p-4 ${isWishlistView ? 'flex flex-col justify-center' : ''}`}>
        {/* Brand and Name */}
        <div className="mb-3">
          <h3 className="font-bold text-amber-900 text-lg leading-tight">
            {cigar.brand}
          </h3>
          <p className="text-amber-700 font-medium">
            {cigar.name}
          </p>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <Ruler className="h-3 w-3 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-amber-600 font-medium">Size</p>
              <p className="text-sm text-amber-900 font-semibold">{cigar.size}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <Tag className="h-3 w-3 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-amber-600 font-medium">Format</p>
              <p className="text-sm text-amber-900 font-semibold">{cigar.format}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <Globe className="h-3 w-3 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-amber-600 font-medium">Country</p>
              <p className="text-sm text-amber-900 font-semibold">{cigar.country}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <Zap className="h-3 w-3 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-amber-600 font-medium">Strength</p>
              <p className="text-sm text-amber-900 font-semibold">{cigar.strength}</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <Package className="h-3 w-3 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-amber-600 font-medium">Quantity</p>
              <p className="text-sm text-amber-900 font-semibold">{cigar.quantity}</p>
            </div>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center mb-4">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-amber-100 rounded-lg">
              <DollarSign className="h-3 w-3 text-amber-600" />
            </div>
            <div>
              <p className="text-xs text-amber-600 font-medium">Price</p>
              <p className="text-lg font-bold text-amber-900">${cigar.price}</p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {cigar.tags && cigar.tags.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {cigar.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-lg font-medium"
                >
                  {tag}
                </span>
              ))}
              {cigar.tags.length > 3 && (
                <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs rounded-lg font-medium">
                  +{cigar.tags.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2">
          <button
            onClick={() => onAddTastingNote(cigar)}
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
          >
            <Star className="h-4 w-4" />
            <span>Tasting Note</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}