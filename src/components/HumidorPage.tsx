import React, { useState } from 'react';
import { Plus, Search, Filter, BarChart3 } from 'lucide-react';
import { Cigar, TastingNote } from '../types';
import CigarCard from './CigarCard';
import AddCigarForm from './AddCigarForm';
import TastingNotesModal from './TastingNotesModal';

interface HumidorPageProps {
  cigars: Cigar[];
  tastingNotes: TastingNote[];
  onAddCigar: (cigar: Omit<Cigar, 'id'>) => void;
  onUpdateCigar: (cigar: Cigar) => void;
  onDeleteCigar: (id: string) => void;
  onAddTastingNote: (note: Omit<TastingNote, 'id'>) => void;
}

export default function HumidorPage({
  cigars,
  tastingNotes,
  onAddCigar,
  onUpdateCigar,
  onDeleteCigar,
  onAddTastingNote
}: HumidorPageProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTastingModal, setShowTastingModal] = useState(false);
  const [editingCigar, setEditingCigar] = useState<Cigar | null>(null);
  const [selectedCigar, setSelectedCigar] = useState<Cigar | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('brand');
  const [filterStrength, setFilterStrength] = useState('');

  const filteredAndSortedCigars = cigars
    .filter(cigar => {
      const matchesSearch = 
        cigar.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cigar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cigar.country.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = !filterStrength || cigar.strength === filterStrength;
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'brand':
          return a.brand.localeCompare(b.brand);
        case 'addedDate':
          return new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime();
        case 'quantity':
          return b.quantity - a.quantity;
        case 'price':
          return b.price - a.price;
        default:
          return 0;
      }
    });

  const handleEdit = (cigar: Cigar) => {
    setEditingCigar(cigar);
    setShowAddForm(true);
  };

  const handleAddTastingNote = (cigar: Cigar) => {
    setSelectedCigar(cigar);
    setShowTastingModal(true);
  };

  const handleSaveCigar = (cigarData: Omit<Cigar, 'id'>) => {
    if (editingCigar) {
      onUpdateCigar({ ...cigarData, id: editingCigar.id });
    } else {
      onAddCigar(cigarData);
    }
    setEditingCigar(null);
    setShowAddForm(false);
  };

  const totalValue = cigars.reduce((sum, cigar) => sum + (cigar.price * cigar.quantity), 0);
  const totalCigars = cigars.reduce((sum, cigar) => sum + cigar.quantity, 0);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-amber-200">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-amber-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Cigars</p>
              <p className="text-2xl font-bold text-amber-900">{totalCigars}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-amber-200">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Collection Value</p>
              <p className="text-2xl font-bold text-amber-900">${totalValue.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-amber-200">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Brands</p>
              <p className="text-2xl font-bold text-amber-900">
                {new Set(cigars.map(c => c.brand)).size}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg border-2 border-amber-200">
          <div className="flex items-center">
            <BarChart3 className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Tasting Notes</p>
              <p className="text-2xl font-bold text-amber-900">{tastingNotes.length}</p>
            </div>
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
                placeholder="Search your collection..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
            >
              <option value="brand">Sort by Brand</option>
              <option value="addedDate">Sort by Date Added</option>
              <option value="quantity">Sort by Quantity</option>
              <option value="price">Sort by Price</option>
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
            <button
              onClick={() => setShowAddForm(true)}
              className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 flex items-center space-x-2"
            >
              <Plus className="h-5 w-5" />
              <span>Add Cigar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cigars Grid */}
      {filteredAndSortedCigars.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-lg border-2 border-amber-200">
          <p className="text-gray-500 text-lg mb-4">
            {cigars.length === 0 ? 'Your humidor is empty' : 'No cigars match your search'}
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-amber-600 text-white rounded-lg hover:bg-amber-700 inline-flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>Add Your First Cigar</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedCigars.map((cigar) => (
            <CigarCard
              key={cigar.id}
              cigar={cigar}
              tastingNotes={tastingNotes.filter(note => note.cigarId === cigar.id)}
              onEdit={handleEdit}
              onDelete={onDeleteCigar}
              onAddTastingNote={handleAddTastingNote}
            />
          ))}
        </div>
      )}

      {/* Modals */}
      <AddCigarForm
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setEditingCigar(null);
        }}
        onSave={handleSaveCigar}
        editingCigar={editingCigar}
      />

      <TastingNotesModal
        isOpen={showTastingModal}
        onClose={() => {
          setShowTastingModal(false);
          setSelectedCigar(null);
        }}
        onSave={onAddTastingNote}
        cigar={selectedCigar}
      />
    </div>
  );
}