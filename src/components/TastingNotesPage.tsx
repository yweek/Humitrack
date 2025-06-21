import React, { useState, useEffect } from 'react';
import { FileText, Search, Star, Calendar, Filter, Eye, Trash2, ChevronDown, ChevronUp, Camera, Download, X, BarChart3 } from 'lucide-react';
import { TastingNote, Cigar } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedTastingNotesModal from './EnhancedTastingNotesModal';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface TastingNotesPageProps {
  tastingNotes: TastingNote[];
  cigars: Cigar[];
  onDeleteTastingNote?: (id: string) => void;
}

export default function TastingNotesPage({ tastingNotes, cigars, onDeleteTastingNote }: TastingNotesPageProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('smokedDate');
  const [filterRating, setFilterRating] = useState('');
  const [filterFlavor, setFilterFlavor] = useState('');
  const [selectedNote, setSelectedNote] = useState<TastingNote | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showTastingModal, setShowTastingModal] = useState(false);
  const [selectedCigar, setSelectedCigar] = useState<Cigar | null>(null);

  // Create a map of cigar IDs to cigar data for quick lookup
  const cigarMap = cigars.reduce((map, cigar) => {
    map[cigar.id] = cigar;
    return map;
  }, {} as Record<string, Cigar>);

  // Get all unique flavor notes
  const allFlavorNotes = Array.from(new Set(tastingNotes.flatMap(note => note.tastingNotes || [])));

  const filteredAndSortedNotes = tastingNotes
    .filter(note => {
      const cigar = cigarMap[note.cigarId];
      if (!cigar) return false;

      const matchesSearch = 
        cigar.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cigar.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (note.comment && note.comment.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (note.tastingNotes && note.tastingNotes.some(tn => tn.toLowerCase().includes(searchTerm.toLowerCase())));
      
      const matchesRating = !filterRating || note.rating.toString() === filterRating;
      const matchesFlavor = !filterFlavor || (note.tastingNotes && note.tastingNotes.includes(filterFlavor));
      
      return matchesSearch && matchesRating && matchesFlavor;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'smokedDate':
          return new Date(b.smokedDate).getTime() - new Date(a.smokedDate).getTime();
        case 'rating':
          return b.rating - a.rating;
        case 'agingTime':
          return b.agingTime - a.agingTime;
        default:
          return 0;
      }
    });

  const averageRating = tastingNotes.length > 0 
    ? tastingNotes.reduce((sum, note) => sum + note.rating, 0) / tastingNotes.length 
    : 0;

  const getRatingColor = (rating: number) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-blue-600';
    if (rating >= 2.5) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Prepare data for charts
  const flavorCounts = tastingNotes.reduce((acc, note) => {
    if (note.tastingNotes) {
      note.tastingNotes.forEach(flavor => {
        acc[flavor] = (acc[flavor] || 0) + 1;
      });
    }
    return acc;
  }, {} as Record<string, number>);

  const topFlavors = Object.entries(flavorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  const flavorChartData = {
    labels: topFlavors.map(([flavor]) => flavor),
    datasets: [
      {
        label: 'Occurrences',
        data: topFlavors.map(([, count]) => count),
        backgroundColor: 'rgba(217, 119, 6, 0.7)',
        borderColor: 'rgba(217, 119, 6, 1)',
        borderWidth: 1,
      },
    ],
  };

  const ratingCounts = tastingNotes.reduce((acc, note) => {
    const rating = note.rating.toString();
    acc[rating] = (acc[rating] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const ratingChartData = {
    labels: ['1', '2', '3', '4', '5'],
    datasets: [
      {
        label: 'Number of ratings',
        data: [
          ratingCounts['1'] || 0,
          ratingCounts['2'] || 0,
          ratingCounts['3'] || 0,
          ratingCounts['4'] || 0,
          ratingCounts['5'] || 0,
        ],
        backgroundColor: [
          'rgba(239, 68, 68, 0.7)',
          'rgba(249, 115, 22, 0.7)',
          'rgba(234, 179, 8, 0.7)',
          'rgba(34, 197, 94, 0.7)',
          'rgba(16, 185, 129, 0.7)',
        ],
        borderColor: [
          'rgba(239, 68, 68, 1)',
          'rgba(249, 115, 22, 1)',
          'rgba(234, 179, 8, 1)',
          'rgba(34, 197, 94, 1)',
          'rgba(16, 185, 129, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const exportTastingNotes = () => {
    const csvContent = [
      ['Date', 'Brand', 'Name', 'Rating', 'Flavors', 'Comment'].join(','),
      ...filteredAndSortedNotes.map(note => {
        const cigar = cigarMap[note.cigarId];
        return [
          new Date(note.smokedDate).toLocaleDateString(),
          cigar?.brand || '',
          cigar?.name || '',
          note.rating,
          note.tastingNotes ? `"${note.tastingNotes.join(', ')}"` : '',
          note.comment ? `"${note.comment.replace(/"/g, '""')}"` : ''
        ].join(',');
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tasting-notes.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6 pt-2">
      {/* Header */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md border border-amber-200">
        <div className="flex items-center space-x-3">
          <FileText className="h-6 w-6 text-amber-600" />
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-amber-900">Tasting Notes</h1>
            <p className="text-gray-600 text-sm sm:text-base">Your tasting experiences</p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-amber-200">
          <div className="flex items-center">
            <FileText className="h-5 sm:h-6 w-5 sm:w-6 text-amber-600" />
            <div className="ml-3">
              <p className="text-xs sm:text-sm text-gray-600">Total</p>
              <p className="text-lg sm:text-xl font-bold text-amber-900">{tastingNotes.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-amber-200">
          <div className="flex items-center">
            <Star className="h-5 sm:h-6 w-5 sm:w-6 text-yellow-500" />
            <div className="ml-3">
              <p className="text-xs sm:text-sm text-gray-600">Average Rating</p>
              <p className={`text-lg sm:text-xl font-bold ${getRatingColor(averageRating)}`}>
                {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md border border-amber-200 col-span-2 sm:col-span-1">
          <div className="flex items-center">
            <Calendar className="h-5 sm:h-6 w-5 sm:w-6 text-blue-600" />
            <div className="ml-3">
              <p className="text-xs sm:text-sm text-gray-600">This Month</p>
              <p className="text-lg sm:text-xl font-bold text-amber-900">
                {tastingNotes.filter(note => {
                  const noteDate = new Date(note.smokedDate);
                  const now = new Date();
                  return noteDate.getMonth() === now.getMonth() && noteDate.getFullYear() === now.getFullYear();
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white p-4 rounded-lg shadow-md border border-amber-200">
        <div className="flex flex-col space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-1"
              >
                <Filter className="h-4 w-4 text-amber-600" />
                <span className="text-sm">Filters</span>
                {showFilters ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              <button
                onClick={() => setShowStats(!showStats)}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center space-x-1"
              >
                <BarChart3 className="h-4 w-4 text-amber-600" />
                <span className="text-sm hidden sm:inline">Statistics</span>
                {showStats ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </button>
              <button
                onClick={exportTastingNotes}
                className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center space-x-1"
              >
                <Download className="h-4 w-4" />
                <span className="text-sm hidden sm:inline">Export</span>
              </button>
            </div>
          </div>
          
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-3 border-t border-gray-200 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                  >
                    <option value="smokedDate">Sort by date</option>
                    <option value="rating">Sort by rating</option>
                    <option value="agingTime">Sort by aging</option>
                  </select>
                  <select
                    value={filterRating}
                    onChange={(e) => setFilterRating(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                  >
                    <option value="">All ratings</option>
                    <option value="5">5 stars</option>
                    <option value="4">4 stars</option>
                    <option value="3">3 stars</option>
                    <option value="2">2 stars</option>
                    <option value="1">1 star</option>
                  </select>
                  <select
                    value={filterFlavor}
                    onChange={(e) => setFilterFlavor(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 text-sm"
                  >
                    <option value="">All flavors</option>
                    {allFlavorNotes.map(flavor => (
                      <option key={flavor} value={flavor}>{flavor}</option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showStats && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="pt-3 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Most Common Flavors</h3>
                      <div className="h-60">
                        <Bar 
                          data={flavorChartData} 
                          options={{
                            indexAxis: 'y',
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false,
                              },
                            },
                          }} 
                        />
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-lg border border-gray-200">
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Rating Distribution</h3>
                      <div className="h-60">
                        <Bar 
                          data={ratingChartData} 
                          options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            plugins: {
                              legend: {
                                display: false,
                              },
                            },
                          }} 
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex justify-end">
        <div className="inline-flex rounded-md shadow-sm" role="group">
          <button
            type="button"
            onClick={() => setViewMode('grid')}
            className={`px-4 py-2 text-sm font-medium rounded-l-lg ${
              viewMode === 'grid'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-300`}
          >
            Grid
          </button>
          <button
            type="button"
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 text-sm font-medium rounded-r-lg ${
              viewMode === 'list'
                ? 'bg-amber-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-300 border-l-0`}
          >
            List
          </button>
        </div>
      </div>

      {/* Tasting Notes */}
      {filteredAndSortedNotes.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md border border-amber-200">
          <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            {tastingNotes.length === 0 ? 'No tasting notes yet' : 'No notes match your search'}
          </p>
        </div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAndSortedNotes.map((note) => {
                const cigar = cigarMap[note.cigarId];
                if (!cigar) return null;

                return (
                  <motion.div 
                    key={note.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white rounded-lg shadow-md border border-amber-200 hover:shadow-lg transition-all duration-300"
                  >
                    <div className="p-4">
                      {/* Cigar Info */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="text-lg font-serif font-bold text-amber-900 line-clamp-1">
                            {cigar.brand}
                          </h3>
                          <p className="text-base text-amber-800 font-medium line-clamp-1">
                            {cigar.name}
                          </p>
                          <p className="text-xs text-gray-600">{cigar.size} - {cigar.format}</p>
                        </div>
                        <div className="flex space-x-1">
                          <button
                            onClick={() => setSelectedNote(note)}
                            className="p-1.5 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-colors"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </button>
                          {onDeleteTastingNote && (
                            <button
                              onClick={() => onDeleteTastingNote(note.id)}
                              className="p-1.5 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Rating */}
                      <div className="flex items-center space-x-1 mb-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <= note.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-bold text-amber-900 text-sm">{note.rating}/5</span>
                      </div>

                      {/* Date and Photos */}
                      <div className="flex justify-between items-center mb-2">
                        <div className="flex items-center text-xs text-gray-600">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(note.smokedDate).toLocaleDateString()}
                        </div>
                        {note.photos && note.photos.length > 0 && (
                          <div className="flex items-center text-xs text-gray-600">
                            <Camera className="h-3 w-3 mr-1" />
                            {note.photos.length} photo{note.photos.length !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>

                      {/* Flavor Notes */}
                      {note.tastingNotes && note.tastingNotes.length > 0 && (
                        <div className="mb-2">
                          <div className="flex flex-wrap gap-1">
                            {note.tastingNotes.slice(0, 3).map((flavor, index) => (
                              <span key={index} className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                                {flavor}
                              </span>
                            ))}
                            {note.tastingNotes.length > 3 && (
                              <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{note.tastingNotes.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Comment Preview */}
                      {note.comment && (
                        <div>
                          <p className="text-xs text-gray-800 line-clamp-2">
                            {note.comment}
                          </p>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-amber-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cigar
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Flavors
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredAndSortedNotes.map((note) => {
                      const cigar = cigarMap[note.cigarId];
                      if (!cigar) return null;

                      return (
                        <tr key={note.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {cigar.photo && (
                                <div className="flex-shrink-0 h-10 w-10 mr-3">
                                  <img className="h-10 w-10 rounded-full object-cover" src={cigar.photo} alt={cigar.name} />
                                </div>
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">{cigar.brand}</div>
                                <div className="text-sm text-gray-500">{cigar.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(note.smokedDate).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${
                                    star <= note.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {note.tastingNotes && note.tastingNotes.slice(0, 2).map((flavor, index) => (
                                <span key={index} className="px-2 py-0.5 bg-amber-100 text-amber-800 text-xs rounded-full">
                                  {flavor}
                                </span>
                              ))}
                              {note.tastingNotes && note.tastingNotes.length > 2 && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                                  +{note.tastingNotes.length - 2}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setSelectedNote(note)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                <Eye className="h-4 w-4" />
                              </button>
                              {onDeleteTastingNote && (
                                <button
                                  onClick={() => onDeleteTastingNote(note.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* Detailed View Modal */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedNote(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-serif font-bold text-amber-900">
                    Tasting Details
                  </h2>
                  <button 
                    onClick={() => setSelectedNote(null)} 
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X className="h-6 w-6" />
                  </button>
                </div>

                {(() => {
                  const cigar = cigarMap[selectedNote.cigarId];
                  if (!cigar) return null;

                  return (
                    <div className="space-y-6">
                      {/* Cigar Info */}
                      <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                        <div className="flex items-center space-x-4">
                          {cigar.photo && (
                            <img 
                              src={cigar.photo} 
                              alt={`${cigar.brand} ${cigar.name}`} 
                              className="w-16 h-16 object-cover rounded-lg border border-amber-300"
                            />
                          )}
                          <div>
                            <h3 className="font-serif font-bold text-amber-900">{cigar.brand}</h3>
                            <p className="text-amber-800">{cigar.name}</p>
                            <p className="text-sm text-amber-700">{cigar.size} - {cigar.format}</p>
                          </div>
                        </div>
                      </div>

                      {/* Ratings */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Overall Rating</p>
                          <div className="flex items-center space-x-2">
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-6 w-6 ${
                                    star <= selectedNote.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="font-bold text-amber-900">{selectedNote.rating}/5</span>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Strength:</span>
                            <span className="text-sm font-medium">{selectedNote.strengthRating}/5</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Aroma:</span>
                            <span className="text-sm font-medium">{selectedNote.aromaRating}/5</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Burn:</span>
                            <span className="text-sm font-medium">{selectedNote.burnRating}/5</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-600">Draw:</span>
                            <span className="text-sm font-medium">{selectedNote.drawRating}/5</span>
                          </div>
                        </div>
                      </div>

                      {/* Date and Aging */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">Date Smoked</p>
                          <p className="font-medium text-amber-900">
                            {new Date(selectedNote.smokedDate).toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Aging Time</p>
                          <p className="font-medium text-amber-900">{selectedNote.agingTime} days</p>
                        </div>
                      </div>

                      {/* Flavor Notes */}
                      {selectedNote.tastingNotes && selectedNote.tastingNotes.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Flavor Profile</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedNote.tastingNotes.map((flavor, index) => (
                              <span key={index} className="px-3 py-1 bg-amber-100 text-amber-800 text-sm rounded-full">
                                {flavor}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Comment */}
                      {selectedNote.comment && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Comments</p>
                          <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">
                            {selectedNote.comment}
                          </p>
                        </div>
                      )}

                      {/* Photos */}
                      {selectedNote.photos && selectedNote.photos.length > 0 && (
                        <div>
                          <p className="text-sm font-medium text-gray-700 mb-2">Photos</p>
                          <div className="grid grid-cols-2 gap-2">
                            {selectedNote.photos.map((photo, index) => (
                              <img
                                key={index}
                                src={photo}
                                alt={`Tasting photo ${index + 1}`}
                                className="w-full h-32 sm:h-40 object-cover rounded-lg border border-amber-200"
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasting Notes Modal */}
      <EnhancedTastingNotesModal
        isOpen={showTastingModal}
        onClose={() => {
          setShowTastingModal(false);
          setSelectedCigar(null);
        }}
        onSave={() => {}}
        cigar={selectedCigar}
      />
    </div>
  );
}