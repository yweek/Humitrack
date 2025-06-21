import React, { useState, useEffect } from 'react';
import { X, Search, Camera, AlertTriangle } from 'lucide-react';
import { Cigar, CigarDatabase, UserTag } from '../types';
import { cigarDatabase, defaultTags } from '../data/cigarDatabase';
import TagManager from './TagManager';
import PhotoCapture from './PhotoCapture';

interface EnhancedAddCigarFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (cigar: Omit<Cigar, 'id'>) => void;
  editingCigar?: Cigar | null;
  userTags: UserTag[];
  onCreateTag: (tag: Omit<UserTag, 'id'>) => void;
}

export default function EnhancedAddCigarForm({ 
  isOpen, 
  onClose, 
  onSave, 
  editingCigar,
  userTags,
  onCreateTag
}: EnhancedAddCigarFormProps) {
  const [formData, setFormData] = useState({
    brand: '',
    name: '',
    size: '',
    format: '',
    country: '',
    strength: 'Medium' as const,
    wrapper: '',
    price: '',
    quantity: '1',
    ringGauge: '',
    factory: '',
    releaseYear: '',
    purchaseLocation: '',
    lowStockAlert: '5'
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [photo, setPhoto] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<CigarDatabase[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [showPhotoCapture, setShowPhotoCapture] = useState(false);

  useEffect(() => {
    if (editingCigar) {
      setFormData({
        brand: editingCigar.brand,
        name: editingCigar.name,
        size: editingCigar.size,
        format: editingCigar.format,
        country: editingCigar.country,
        strength: editingCigar.strength,
        wrapper: editingCigar.wrapper,
        price: editingCigar.price.toString(),
        quantity: editingCigar.quantity.toString(),
        ringGauge: editingCigar.ringGauge?.toString() || '',
        factory: editingCigar.factory || '',
        releaseYear: editingCigar.releaseYear?.toString() || '',
        purchaseLocation: editingCigar.purchaseLocation || '',
        lowStockAlert: editingCigar.lowStockAlert?.toString() || '5'
      });
      setSelectedTags(editingCigar.tags || []);
      setPhoto(editingCigar.photo || '');
    } else {
      setFormData({
        brand: '',
        name: '',
        size: '',
        format: '',
        country: '',
        strength: 'Medium',
        wrapper: '',
        price: '',
        quantity: '1',
        ringGauge: '',
        factory: '',
        releaseYear: '',
        purchaseLocation: '',
        lowStockAlert: '5'
      });
      setSelectedTags([]);
      setPhoto('');
    }
  }, [editingCigar, isOpen]);

  useEffect(() => {
    if (searchTerm.length > 1) {
      const results = cigarDatabase.filter(cigar =>
        cigar.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cigar.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSearchResults(results);
      setShowSearch(true);
    } else {
      setSearchResults([]);
      setShowSearch(false);
    }
  }, [searchTerm]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSearchSelect = (selectedCigar: CigarDatabase) => {
    setFormData({
      brand: selectedCigar.brand,
      name: selectedCigar.name,
      size: selectedCigar.size,
      format: selectedCigar.format,
      country: selectedCigar.country,
      strength: selectedCigar.strength,
      wrapper: selectedCigar.wrapper,
      ringGauge: selectedCigar.ringGauge.toString(),
      factory: selectedCigar.factory || '',
      releaseYear: selectedCigar.releaseYear?.toString() || '',
      price: '',
      quantity: '1',
      purchaseLocation: '',
      lowStockAlert: '5'
    });
    setSearchTerm('');
    setShowSearch(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price) || 0,
      quantity: parseInt(formData.quantity) || 1,
      ringGauge: parseInt(formData.ringGauge) || undefined,
      releaseYear: parseInt(formData.releaseYear) || undefined,
      lowStockAlert: parseInt(formData.lowStockAlert) || 5,
      addedDate: editingCigar?.addedDate || new Date().toISOString(),
      agingStartDate: editingCigar?.agingStartDate || new Date().toISOString(),
      tags: selectedTags,
      photo
    });
    onClose();
  };

  const handlePhotoCapture = (capturedPhoto: string) => {
    setPhoto(capturedPhoto);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[95vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-amber-900">
              {editingCigar ? 'Edit Cigar' : 'Add New Cigar'}
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Search Bar */}
          {!editingCigar && (
            <div className="mb-6 relative">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search cigar database..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              {showSearch && searchResults.length > 0 && (
                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                  {searchResults.map((cigar) => (
                    <button
                      key={cigar.id}
                      onClick={() => handleSearchSelect(cigar)}
                      className="w-full text-left px-4 py-3 hover:bg-amber-50 border-b border-gray-100 last:border-b-0"
                    >
                      <div className="font-medium text-amber-900">{cigar.brand}</div>
                      <div className="text-sm text-gray-600">{cigar.name} - {cigar.size}</div>
                      <div className="text-xs text-gray-500">{cigar.country} • {cigar.factory}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Photo Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-gray-700">Photo</label>
                <button
                  type="button"
                  onClick={() => setShowPhotoCapture(true)}
                  className="text-amber-600 hover:text-amber-700 flex items-center space-x-1 text-sm"
                >
                  <Camera className="h-4 w-4" />
                  <span>{photo ? 'Change Photo' : 'Add Photo'}</span>
                </button>
              </div>
              {photo && (
                <div className="mb-4">
                  <img
                    src={photo}
                    alt="Cigar"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-amber-200"
                  />
                </div>
              )}
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Brand *</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Size and Format */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Size *</label>
                <input
                  type="text"
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  placeholder="e.g., 6 x 52"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Format *</label>
                <input
                  type="text"
                  name="format"
                  value={formData.format}
                  onChange={handleInputChange}
                  placeholder="e.g., Robusto, Churchill"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ring Gauge</label>
                <input
                  type="number"
                  name="ringGauge"
                  value={formData.ringGauge}
                  onChange={handleInputChange}
                  placeholder="e.g., 52"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Origin and Production */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                <input
                  type="text"
                  name="country"
                  value={formData.country}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Factory</label>
                <input
                  type="text"
                  name="factory"
                  value={formData.factory}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Strength and Wrapper */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Strength *</label>
                <select
                  name="strength"
                  value={formData.strength}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                >
                  <option value="Mild">Mild</option>
                  <option value="Medium">Medium</option>
                  <option value="Full">Full</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Wrapper *</label>
                <input
                  type="text"
                  name="wrapper"
                  value={formData.wrapper}
                  onChange={handleInputChange}
                  placeholder="e.g., Connecticut, Maduro"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Release Year</label>
                <input
                  type="number"
                  name="releaseYear"
                  value={formData.releaseYear}
                  onChange={handleInputChange}
                  placeholder="e.g., 2020"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Purchase Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  step="0.01"
                  min="0"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <span>Low Stock Alert</span>
                  </div>
                </label>
                <input
                  type="number"
                  name="lowStockAlert"
                  value={formData.lowStockAlert}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Purchase Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Location</label>
              <input
                type="text"
                name="purchaseLocation"
                value={formData.purchaseLocation}
                onChange={handleInputChange}
                placeholder="e.g., Local tobacco shop, Online retailer"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

            {/* Tags */}
            <TagManager
              selectedTags={selectedTags}
              onTagsChange={setSelectedTags}
              userTags={userTags}
              onCreateTag={onCreateTag}
            />

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
              >
                {editingCigar ? 'Update Cigar' : 'Add Cigar'}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showPhotoCapture && (
        <PhotoCapture
          onPhotoCapture={handlePhotoCapture}
          onClose={() => setShowPhotoCapture(false)}
          existingPhoto={photo}
        />
      )}
    </div>
  );
}