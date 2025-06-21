import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { Cigar, TastingNote } from '../types';

interface TastingNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (note: Omit<TastingNote, 'id'>) => void;
  cigar: Cigar | null;
}

const tastingNoteOptions = [
  'woody', 'earthy', 'spicy', 'coffee', 'chocolate', 'vanilla', 'cedar', 'leather',
  'nuts', 'pepper', 'cream', 'floral', 'honey', 'cocoa', 'dark fruit', 'citrus'
];

export default function TastingNotesModal({ isOpen, onClose, onSave, cigar }: TastingNotesModalProps) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedNotes, setSelectedNotes] = useState<string[]>([]);
  const [smokedDate, setSmokedDate] = useState(new Date().toISOString().split('T')[0]);

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
      agingTime: Math.max(0, agingTime)
    });

    // Reset form
    setRating(0);
    setComment('');
    setSelectedNotes([]);
    setSmokedDate(new Date().toISOString().split('T')[0]);
    onClose();
  };

  const toggleTastingNote = (note: string) => {
    setSelectedNotes(prev =>
      prev.includes(note)
        ? prev.filter(n => n !== note)
        : [...prev, note]
    );
  };

  if (!isOpen || !cigar) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-serif font-bold text-amber-900">
              Add Tasting Notes
            </h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
            <h3 className="font-serif font-bold text-amber-900">{cigar.brand}</h3>
            <p className="text-amber-800">{cigar.name}</p>
            <p className="text-sm text-amber-700">{cigar.size} - {cigar.format}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Rating */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className={`p-1 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                  >
                    <Star className="h-8 w-8 fill-current" />
                  </button>
                ))}
              </div>
            </div>

            {/* Smoked Date */}
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

            {/* Tasting Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tasting Notes</label>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                {tastingNoteOptions.map((note) => (
                  <button
                    key={note}
                    type="button"
                    onClick={() => toggleTastingNote(note)}
                    className={`px-3 py-2 rounded-full text-sm font-medium border transition-colors ${
                      selectedNotes.includes(note)
                        ? 'bg-amber-100 text-amber-800 border-amber-300'
                        : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                    }`}
                  >
                    {note}
                  </button>
                ))}
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Share your thoughts about this cigar..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>

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
                disabled={rating === 0}
                className="flex-1 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Tasting Notes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}