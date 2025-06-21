import React, { useState } from 'react';
import { X, Plus, Edit, Trash2, Archive, MapPin, Thermometer, Droplets, Package } from 'lucide-react';
import { Humidor } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface HumidorManagerProps {
  isOpen: boolean;
  onClose: () => void;
  humidors: Humidor[];
  onAddHumidor: (humidor: Omit<Humidor, 'id'>) => void;
  onUpdateHumidor: (humidor: Humidor) => void;
  onDeleteHumidor: (id: string) => void;
  cigars: any[]; // Pour calculer le nombre de cigares par humidor
}

export default function HumidorManager({
  isOpen,
  onClose,
  humidors,
  onAddHumidor,
  onUpdateHumidor,
  onDeleteHumidor,
  cigars
}: HumidorManagerProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingHumidor, setEditingHumidor] = useState<Humidor | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    capacity: '',
    temperature: '',
    humidity: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const humidorData = {
      name: formData.name,
      description: formData.description || undefined,
      location: formData.location || undefined,
      capacity: formData.capacity ? parseInt(formData.capacity) : undefined,
      temperature: formData.temperature ? parseInt(formData.temperature) : undefined,
      humidity: formData.humidity ? parseInt(formData.humidity) : undefined,
      createdDate: new Date().toISOString(),
      isDefault: humidors.length === 0 // Premier humidor = défaut
    };

    if (editingHumidor) {
      onUpdateHumidor({ ...humidorData, id: editingHumidor.id });
    } else {
      onAddHumidor(humidorData);
    }

    resetForm();
  };

  const handleEdit = (humidor: Humidor) => {
    setEditingHumidor(humidor);
    setFormData({
      name: humidor.name,
      description: humidor.description || '',
      location: humidor.location || '',
      capacity: humidor.capacity?.toString() || '',
      temperature: humidor.temperature?.toString() || '',
      humidity: humidor.humidity?.toString() || ''
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      location: '',
      capacity: '',
      temperature: '',
      humidity: ''
    });
    setEditingHumidor(null);
    setShowAddForm(false);
  };

  const getCigarCount = (humidorId: string) => {
    return cigars.filter(cigar => 
      cigar.humidorId === humidorId || (!cigar.humidorId && humidorId === 'default')
    ).reduce((sum, cigar) => sum + cigar.quantity, 0);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-amber-200">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-amber-600 rounded-xl">
              <Archive className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-amber-900">Humidor Manager</h2>
              <p className="text-amber-600">Manage your cigar collections</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-amber-100 hover:bg-amber-200 rounded-xl text-amber-700 transition-all duration-200"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Humidors List */}
          <div className="w-1/2 p-6 border-r border-amber-200 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-amber-900">Your Humidors</h3>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Humidor</span>
              </button>
            </div>

            <div className="space-y-4">
              {humidors.map((humidor) => (
                <motion.div
                  key={humidor.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-amber-50 border border-amber-200 rounded-2xl p-4 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h4 className="font-bold text-amber-900 text-lg">{humidor.name}</h4>
                        {humidor.isDefault && (
                          <span className="px-2 py-1 bg-amber-600 text-white text-xs rounded-lg font-medium">
                            Default
                          </span>
                        )}
                      </div>
                      {humidor.description && (
                        <p className="text-amber-700 text-sm mb-2">{humidor.description}</p>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(humidor)}
                        className="p-2 bg-amber-100 hover:bg-amber-200 rounded-xl text-amber-700 transition-all duration-200"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {!humidor.isDefault && (
                        <button
                          onClick={() => onDeleteHumidor(humidor.id)}
                          className="p-2 bg-red-100 hover:bg-red-200 rounded-xl text-red-600 transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {humidor.location && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-amber-600" />
                        <span className="text-amber-700">{humidor.location}</span>
                      </div>
                    )}
                    <div className="flex items-center space-x-2">
                      <Package className="h-4 w-4 text-amber-600" />
                      <span className="text-amber-700">
                        {getCigarCount(humidor.id)} cigars
                        {humidor.capacity && ` / ${humidor.capacity}`}
                      </span>
                    </div>
                    {humidor.temperature && (
                      <div className="flex items-center space-x-2">
                        <Thermometer className="h-4 w-4 text-amber-600" />
                        <span className="text-amber-700">{humidor.temperature}°F</span>
                      </div>
                    )}
                    {humidor.humidity && (
                      <div className="flex items-center space-x-2">
                        <Droplets className="h-4 w-4 text-amber-600" />
                        <span className="text-amber-700">{humidor.humidity}%</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Add/Edit Form */}
          <div className="w-1/2 p-6 overflow-y-auto">
            <AnimatePresence>
              {showAddForm ? (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <h3 className="text-xl font-bold text-amber-900 mb-6">
                    {editingHumidor ? 'Edit Humidor' : 'Add New Humidor'}
                  </h3>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-amber-800 mb-2">
                        Humidor Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-amber-900"
                        placeholder="e.g., Main Humidor, Travel Case"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-amber-800 mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-amber-900"
                        placeholder="Optional description"
                        rows={3}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-amber-800 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                        className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-amber-900"
                        placeholder="e.g., Living Room, Office"
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-amber-800 mb-2">
                          Capacity
                        </label>
                        <input
                          type="number"
                          value={formData.capacity}
                          onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                          className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-amber-900"
                          placeholder="100"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-amber-800 mb-2">
                          Temperature (°F)
                        </label>
                        <input
                          type="number"
                          value={formData.temperature}
                          onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
                          className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-amber-900"
                          placeholder="70"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-amber-800 mb-2">
                          Humidity (%)
                        </label>
                        <input
                          type="number"
                          value={formData.humidity}
                          onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
                          className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all duration-200 text-amber-900"
                          placeholder="65"
                        />
                      </div>
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        className="flex-1 py-3 px-6 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        {editingHumidor ? 'Update Humidor' : 'Add Humidor'}
                      </button>
                      <button
                        type="button"
                        onClick={resetForm}
                        className="py-3 px-6 bg-amber-100 hover:bg-amber-200 text-amber-700 rounded-xl font-semibold transition-all duration-200"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="p-6 bg-amber-100 rounded-3xl inline-block mb-6">
                    <Archive className="h-16 w-16 text-amber-600 mx-auto" />
                  </div>
                  <h3 className="text-xl font-bold text-amber-900 mb-2">Manage Your Humidors</h3>
                  <p className="text-amber-700 mb-6">
                    Add new humidors to organize your collection by location, purpose, or preference.
                  </p>
                  <button
                    onClick={() => setShowAddForm(true)}
                    className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
                  >
                    Add Your First Humidor
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 