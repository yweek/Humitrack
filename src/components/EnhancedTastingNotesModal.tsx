import React, { useState, useRef } from 'react';
import { X, Star, Camera, Flame, Wind, Eye, Trash2 } from 'lucide-react';
import CigarCutterIcon from './CigarCutterIcon';
import { Cigar, TastingNote } from '../types';
import { flavorTags } from '../data/cigarDatabase';
import RatingSlider from './RatingSlider';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedTastingNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<TastingNote, 'id'>) => void;
  cigar: Cigar | null;
}

export default function EnhancedTastingNotesModal({ 
  isOpen, 
  onClose, 
  onSave, 
  cigar 
}: EnhancedTastingNotesModalProps) {
  const [rating, setRating] = useState(3);
  const [strengthRating, setStrengthRating] = useState(3);
  const [aromaRating, setAromaRating] = useState(3);
  const [burnRating, setBurnRating] = useState(3);
  const [drawRating, setDrawRating] = useState(3);
  const [comment, setComment] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [smokedDate, setSmokedDate] = useState(new Date().toISOString().split('T')[0]);
  const [photos, setPhotos] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('rating');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cigar) return;

    const addedDate = new Date(cigar.addedDate);
    const smokedDateObj = new Date(smokedDate);
    const agingTime = Math.floor((smokedDateObj.getTime() - addedDate.getTime()) / (1000 * 60 * 60 * 24));

    onSave({
      cigarId: cigar.id,
      rating,
      comment,
      tastingNotes: selectedNotes,
      smokedDate,
      draw: drawRating > 3 ? 'good' : drawRating > 1 ? 'average' : 'bad',
      burn: burnRating > 3 ? 'good' : burnRating > 1 ? 'average' : 'bad',
      ash: strengthRating > 3 ? 'good' : strengthRating > 1 ? 'average' : 'bad',
      photo: photos.length > 0 ? photos[0] : undefined,
      agingTime: Math.max(0, agingTime)
    });

    // Reset form
    setRating(3);
    setStrengthRating(3);
    setAromaRating(3);
    setBurnRating(3);
    setDrawRating(3);
    setComment('');
    setSelectedNotes([]);
    setSmokedDate(new Date().toISOString().split('T')[0]);
    setPhotos([]);
    onClose();
  };

  const toggleFlavorNote = (note: string) => {
    setSelectedNotes(prev =>
      prev.includes(note)
        ? prev.filter(n => n !== note)
        : [...prev, note]
    );
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const newPhotos: string[] = [];
    
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          newPhotos.push(e.target.result as string);
          if (newPhotos.length === files.length) {
            setPhotos(prev => [...prev, ...newPhotos]);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!isOpen || !cigar) return null;

  const tabs = [
    { id: 'rating', label: 'Rating' },
    { id: 'flavors', label: 'Flavors' },
    { id: 'photos', label: 'Photos' },
    { id: 'comments', label: 'Comments' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ type: 'spring', damping: 20, stiffness: 300 }}
        className="bg-white rounded-lg shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-serif font-bold text-amber-900">
            Tasting Notes
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="p-4 bg-amber-50 border-b border-amber-200">
          <div className="flex items-center space-x-3">
            {cigar.photo && (
              <img
                src={cigar.photo}
                alt={`${cigar.brand} ${cigar.name}`}
                className="w-14 h-14 object-cover rounded-lg border border-amber-300"
              />
            )}
            <div>
              <h3 className="font-serif font-bold text-amber-900">{cigar.brand}</h3>
              <p className="text-amber-800">{cigar.name}</p>
              <p className="text-xs text-amber-700">{cigar.size} - {cigar.format}</p>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-b-2 border-amber-600 text-amber-900'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <form onSubmit={handleSubmit} className="p-4">
            <AnimatePresence mode="wait">
              {activeTab === 'rating' && (
                <motion.div
                  key="rating"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  {/* Overall Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Overall Rating</label>
                    <div className="flex justify-center space-x-1 mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          <Star className="h-10 w-10 fill-current" />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Date Smoked */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date Smoked</label>
                    <input
                      type="date"
                      value={smokedDate}
                      onChange={(e) => setSmokedDate(e.target.value)}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>

                  {/* Rating Sliders */}
                  <div className="space-y-4">
                    <RatingSlider
                      label="Strength"
                      value={strengthRating}
                      onChange={setStrengthRating}
                      icon={<Flame className="h-4 w-4 text-red-500" />}
                    />
                    <RatingSlider
                      label="Aroma"
                      value={aromaRating}
                      onChange={setAromaRating}
                      icon={<Wind className="h-4 w-4 text-blue-500" />}
                    />
                    <RatingSlider
                      label="Burn"
                      value={burnRating}
                      onChange={setBurnRating}
                      icon={<CigarCutterIcon className="h-4 w-4 text-orange-500" />}
                    />
                    <RatingSlider
                      label="Draw"
                      value={drawRating}
                      onChange={setDrawRating}
                      icon={<Eye className="h-4 w-4 text-green-500" />}
                    />
                  </div>
                </motion.div>
              )}

              {activeTab === 'flavors' && (
                <motion.div
                  key="flavors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <label className="block text-sm font-medium text-gray-700 mb-2">Flavor Profile</label>
                  <div className="grid grid-cols-3 gap-2">
                    {flavorTags.map((note) => (
                      <button
                        key={note}
                        type="button"
                        onClick={() => toggleFlavorNote(note)}
                        className={`px-3 py-2 rounded-full text-sm font-medium border transition-all ${
                          selectedNotes.includes(note)
                            ? 'bg-amber-100 text-amber-800 border-amber-300 ring-2 ring-amber-200'
                            : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                        }`}
                      >
                        {note}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}

              {activeTab === 'photos' && (
                <motion.div
                  key="photos"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="block text-sm font-medium text-gray-700">Photos</label>
                      <button
                        type="button"
                        onClick={handleCameraCapture}
                        className="text-amber-600 hover:text-amber-700 flex items-center space-x-1 text-sm"
                      >
                        <Camera className="h-4 w-4" />
                        <span>Add a photo</span>
                      </button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    {photos.length > 0 ? (
                      <div className="grid grid-cols-2 gap-2">
                        {photos.map((photo, index) => (
                          <div key={index} className="relative">
                            <img
                              src={photo}
                              alt={`Photo ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border border-gray-300"
                            />
                            <button
                              type="button"
                              onClick={() => removePhoto(index)}
                              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                            >
                              <Trash2 className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <Camera className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500 mb-2">No photos added</p>
                        <button
                          type="button"
                          onClick={handleCameraCapture}
                          className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 inline-flex items-center space-x-2"
                        >
                          <Camera className="h-4 w-4" />
                          <span>Add photos</span>
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {activeTab === 'comments' && (
                <motion.div
                  key="comments"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                    <textarea
                      rows={8}
                      placeholder="Share your thoughts about this cigar..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </form>
        </div>

        <div className="p-4 border-t border-gray-200">
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700"
            >
              Save
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}