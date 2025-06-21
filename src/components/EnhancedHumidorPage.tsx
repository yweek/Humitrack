import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, BarChart3, Download, AlertTriangle, ChevronDown, ChevronUp, Grid, List, Camera, Star, Calendar, Tag, Archive } from 'lucide-react';
import { Cigar, TastingNote, UserTag, Humidor } from '../types';
import EnhancedCigarCard from './EnhancedCigarCard';
import EnhancedAddCigarForm from './EnhancedAddCigarForm';
import EnhancedTastingNotesModal from './EnhancedTastingNotesModal';
import HumidorManager from './HumidorManager';
import { motion, AnimatePresence } from 'framer-motion';
import { useSwipeable } from 'react-swipeable';

interface EnhancedHumidorPageProps {
  cigars: Cigar[];
  tastingNotes: TastingNote[];
  userTags: UserTag[];
  onAddCigar: (cigar: Omit<Cigar, 'id'>) => void;
  onUpdateCigar: (cigar: Cigar) => void;
  onDeleteCigar: (id: string) => void;
  onAddTastingNote: (note: Omit<TastingNote, 'id'>) => void;
  onCreateTag: (tag: Omit<UserTag, 'id'>) => void;
}

export default function EnhancedHumidorPage({
  cigars,
  tastingNotes,
  userTags,
  onAddCigar,
  onUpdateCigar,
  onDeleteCigar,
  onAddTastingNote,
  onCreateTag
}: EnhancedHumidorPageProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTastingModal, setShowTastingModal] = useState(false);
  const [editingCigar, setEditingCigar] = useState<Cigar | null>(null);
  const [selectedCigar, setSelectedCigar] = useState<Cigar | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('brand');
  const [filterStrength, setFilterStrength] = useState('');
  const [filterTag, setFilterTag] = useState('');
  const [showLowStockOnly, setShowLowStockOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedHumidor, setSelectedHumidor] = useState<string>('all');
  const [showHumidorManager, setShowHumidorManager] = useState(false);

  // Mock humidors data - in a real app, this would come from the database
  const [humidors, setHumidors] = useState<Humidor[]>([
    {
      id: 'default',
      name: 'Main Humidor',
      description: 'Primary collection',
      location: 'Living Room',
      capacity: 100,
      temperature: 70,
      humidity: 65,
      createdDate: new Date().toISOString(),
      isDefault: true
    }
  ]);

  // Humidor management functions
  const handleAddHumidor = (humidorData: Omit<Humidor, 'id'>) => {
    const newHumidor: Humidor = {
      ...humidorData,
      id: `humidor-${Date.now()}`,
    };
    setHumidors(prev => [...prev, newHumidor]);
  };

  const handleUpdateHumidor = (updatedHumidor: Humidor) => {
    setHumidors(prev => prev.map(h => h.id === updatedHumidor.id ? updatedHumidor : h));
  };

  const handleDeleteHumidor = (humidorId: string) => {
    setHumidors(prev => prev.filter(h => h.id !== humidorId));
    if (selectedHumidor === humidorId) {
      setSelectedHumidor('all');
    }
  };

  const lowStockCigars = cigars.filter(cigar => 
    cigar.lowStockAlert && cigar.quantity <= cigar.lowStockAlert
  );

  const filteredAndSortedCigars = cigars
    .filter(cigar => {
      const matchesSearch = 
        cigar.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cigar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cigar.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (cigar.factory && cigar.factory.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStrength = !filterStrength || cigar.strength === filterStrength;
      const matchesTag = !filterTag || (cigar.tags && cigar.tags.includes(filterTag));
      const matchesLowStock = !showLowStockOnly || (cigar.lowStockAlert && cigar.quantity <= cigar.lowStockAlert);
      const matchesHumidor = selectedHumidor === 'all' || cigar.humidorId === selectedHumidor || (!cigar.humidorId && selectedHumidor === 'default');
      
      return matchesSearch && matchesStrength && matchesTag && matchesLowStock && matchesHumidor;
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
        case 'aging':
          const aAging = a.agingStartDate ? new Date().getTime() - new Date(a.agingStartDate).getTime() : 0;
          const bAging = b.agingStartDate ? new Date().getTime() - new Date(b.agingStartDate).getTime() : 0;
          return bAging - aAging;
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

  const exportData = () => {
    const csvContent = [
      ['Brand', 'Name', 'Size', 'Format', 'Country', 'Strength', 'Wrapper', 'Price', 'Quantity', 'Tags', 'Date Added'].join(','),
      ...cigars.map(cigar => [
        cigar.brand,
        cigar.name,
        cigar.size,
        cigar.format,
        cigar.country,
        cigar.strength,
        cigar.wrapper,
        cigar.price,
        cigar.quantity,
        cigar.tags?.join(';') || '',
        new Date(cigar.addedDate).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'my-collection.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const totalValue = cigars.reduce((sum, cigar) => sum + (cigar.price * cigar.quantity), 0);
  const totalCigars = cigars.reduce((sum, cigar) => sum + cigar.quantity, 0);
  const allTags = [...new Set(cigars.flatMap(c => c.tags || []))];

  return (
    <div className="space-y-6">
      {/* Humidor Selector */}
      <div className="bg-white rounded-2xl p-4 shadow-lg border border-amber-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-600 rounded-xl">
              <Archive className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-amber-900">Humidor Selection</h2>
              <p className="text-xs sm:text-sm text-amber-600">Choose which humidor to view</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-3">
            <select
              value={selectedHumidor}
              onChange={(e) => setSelectedHumidor(e.target.value)}
              className="px-3 py-2 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-amber-900 font-medium text-sm"
            >
              <option value="all">All Humidors</option>
              {humidors.map(humidor => (
                <option key={humidor.id} value={humidor.id}>
                  {humidor.name} ({cigars.filter(c => c.humidorId === humidor.id || (!c.humidorId && humidor.isDefault)).reduce((sum, c) => sum + c.quantity, 0)} cigars)
                </option>
              ))}
            </select>
            <button
              onClick={() => setShowHumidorManager(true)}
              className="px-3 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm"
            >
              Manage Humidors
            </button>
          </div>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockCigars.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-amber-50 border border-amber-200 rounded-2xl p-4 shadow-md"
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-amber-600 rounded-xl shadow-md">
              <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-amber-800">Low Stock Alert</h3>
          </div>
          <p className="text-amber-700 mb-3 font-medium text-sm">
            {lowStockCigars.length} cigar{lowStockCigars.length !== 1 ? 's' : ''} running low
          </p>
          <div className="flex flex-wrap gap-2">
            {lowStockCigars.map(cigar => (
              <span key={cigar.id} className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-xl font-medium">
                {cigar.brand} {cigar.name} ({cigar.quantity})
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Header Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-amber-200"
        >
          <div className="flex items-center justify-center sm:justify-start">
            <div className="p-2 sm:p-3 bg-amber-600 rounded-xl shadow-md">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
            </div>
            <div className="ml-3 sm:ml-4 text-center sm:text-left">
              <p className="text-xs sm:text-sm text-amber-700 font-medium">Total Cigars</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-900">{totalCigars}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-amber-200"
        >
          <div className="flex items-center justify-center sm:justify-start">
            <div className="p-2 sm:p-3 bg-amber-600 rounded-xl shadow-md">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
            </div>
            <div className="ml-3 sm:ml-4 text-center sm:text-left">
              <p className="text-xs sm:text-sm text-amber-700 font-medium">Collection Value</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-900">${totalValue.toFixed(2)}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-amber-200"
        >
          <div className="flex items-center justify-center sm:justify-start">
            <div className="p-2 sm:p-3 bg-amber-600 rounded-xl shadow-md">
              <Tag className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
            </div>
            <div className="ml-3 sm:ml-4 text-center sm:text-left">
              <p className="text-xs sm:text-sm text-amber-700 font-medium">Unique Brands</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-900">{new Set(cigars.map(c => c.brand)).size}</p>
            </div>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg border border-amber-200"
        >
          <div className="flex items-center justify-center sm:justify-start">
            <div className="p-2 sm:p-3 bg-amber-600 rounded-xl shadow-md">
              <Star className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 text-white" />
            </div>
            <div className="ml-3 sm:ml-4 text-center sm:text-left">
              <p className="text-xs sm:text-sm text-amber-700 font-medium">Tasting Notes</p>
              <p className="text-lg sm:text-xl lg:text-2xl font-bold text-amber-900">{tastingNotes.length}</p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Search and Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-lg border border-amber-200">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
            <input
              type="text"
              placeholder="Search cigars..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 sm:pl-12 pr-4 py-3 sm:py-4 bg-amber-50 border border-amber-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-amber-900 placeholder-amber-600 text-sm sm:text-base"
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center sm:justify-end space-x-2 sm:space-x-3">
            {/* View Mode Toggle */}
            <div className="flex bg-amber-100 rounded-2xl p-1 shadow-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 sm:p-3 rounded-xl transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'text-amber-700 hover:bg-amber-200'
                }`}
              >
                <Grid className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 sm:p-3 rounded-xl transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-amber-600 text-white shadow-lg'
                    : 'text-amber-700 hover:bg-amber-200'
                }`}
              >
                <List className="h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-3 sm:p-4 bg-amber-100 hover:bg-amber-200 rounded-2xl text-amber-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Filter className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* Export Button */}
            <button
              onClick={exportData}
              className="p-3 sm:p-4 bg-amber-100 hover:bg-amber-200 rounded-2xl text-amber-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <Download className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>

            {/* Add Cigar Button */}
            <button
              onClick={() => setShowAddForm(true)}
              className="p-3 sm:p-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>
        </div>

        {/* Filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="pt-4 sm:pt-6 border-t border-amber-200 mt-4 sm:mt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Sort By */}
                  <div>
                    <label className="block text-sm font-semibold text-amber-800 mb-2">Sort By</label>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 bg-amber-50 border border-amber-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-amber-900 text-sm"
                    >
                      <option value="brand">Brand</option>
                      <option value="addedDate">Date Added</option>
                      <option value="quantity">Quantity</option>
                      <option value="price">Price</option>
                      <option value="aging">Aging Time</option>
                    </select>
                  </div>

                  {/* Strength Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-amber-800 mb-2">Strength</label>
                    <select
                      value={filterStrength}
                      onChange={(e) => setFilterStrength(e.target.value)}
                      className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-amber-900"
                    >
                      <option value="">All Strengths</option>
                      <option value="Mild">Mild</option>
                      <option value="Medium">Medium</option>
                      <option value="Full">Full</option>
                    </select>
                  </div>

                  {/* Tag Filter */}
                  <div>
                    <label className="block text-sm font-semibold text-amber-800 mb-2">Tag</label>
                    <select
                      value={filterTag}
                      onChange={(e) => setFilterTag(e.target.value)}
                      className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-amber-900"
                    >
                      <option value="">All Tags</option>
                      {allTags.map(tag => (
                        <option key={tag} value={tag}>{tag}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Low Stock Toggle */}
                <div className="mt-4 flex items-center">
                  <input
                    type="checkbox"
                    id="lowStockOnly"
                    checked={showLowStockOnly}
                    onChange={(e) => setShowLowStockOnly(e.target.checked)}
                    className="h-5 w-5 text-amber-600 focus:ring-amber-500 border-amber-300 rounded"
                  />
                  <label htmlFor="lowStockOnly" className="ml-3 text-sm font-medium text-amber-800">
                    Show low stock only
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cigars Grid/List */}
      {filteredAndSortedCigars.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16 bg-white rounded-2xl shadow-lg border border-amber-200"
        >
          <div className="p-6 bg-amber-100 rounded-3xl inline-block mb-6">
            <Camera className="h-16 w-16 text-amber-600 mx-auto" />
          </div>
          <h3 className="text-2xl font-bold text-amber-900 mb-2">No cigars found</h3>
          <p className="text-amber-700 mb-6">
            {searchTerm || filterStrength || filterTag || showLowStockOnly
              ? 'Try adjusting your filters or search terms.'
              : 'Start building your collection by adding your first cigar!'}
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-8 py-4 bg-amber-600 hover:bg-amber-700 text-white rounded-2xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Add Your First Cigar
          </button>
        </motion.div>
      ) : (
        <div className={viewMode === 'grid' 
          ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
          : 'space-y-4'
        }>
          {filteredAndSortedCigars.map((cigar, index) => (
            <motion.div
              key={cigar.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <EnhancedCigarCard
                cigar={cigar}
                onEdit={handleEdit}
                onDelete={onDeleteCigar}
                onAddTastingNote={handleAddTastingNote}
              />
            </motion.div>
          ))}
        </div>
      )}

      {/* Add/Edit Cigar Modal */}
      <EnhancedAddCigarForm
        isOpen={showAddForm}
        onClose={() => {
          setShowAddForm(false);
          setEditingCigar(null);
        }}
        onSave={handleSaveCigar}
        editingCigar={editingCigar}
        userTags={userTags}
        onCreateTag={onCreateTag}
      />

      {/* Tasting Notes Modal */}
      <EnhancedTastingNotesModal
        isOpen={showTastingModal}
        onClose={() => {
          setShowTastingModal(false);
          setSelectedCigar(null);
        }}
        onSave={onAddTastingNote}
        cigar={selectedCigar}
      />

      {/* Humidor Manager Modal */}
      <HumidorManager
        isOpen={showHumidorManager}
        onClose={() => setShowHumidorManager(false)}
        humidors={humidors}
        onAddHumidor={handleAddHumidor}
        onUpdateHumidor={handleUpdateHumidor}
        onDeleteHumidor={handleDeleteHumidor}
        cigars={cigars}
      />
    </div>
  );
}