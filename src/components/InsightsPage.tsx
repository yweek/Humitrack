import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Cigar } from '../types';
import { motion } from 'framer-motion';
import { BarChart3, Globe, Zap, Hash } from 'lucide-react';

interface InsightsPageProps {
  cigars: Cigar[];
}

// Couleurs cohérentes avec le thème de l'application
const COLORS = ['#8B4513', '#A0522D', '#D2691E', '#CD853F', '#F4A460', '#DEB887'];

// Fonction pour agréger les données
const aggregateData = (data: any[], key: string) => {
  const result = data.reduce((acc, item) => {
    const value = item[key];
    if (value) {
      acc[value] = (acc[value] || 0) + 1;
    }
    return acc;
  }, {});
  return Object.entries(result)
    .map(([name, value]) => ({ name, value: value as number }))
    .sort((a, b) => b.value - a.value);
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-amber-200 rounded-lg shadow-lg">
        <p className="font-bold text-amber-900">{`${label}`}</p>
        <p className="text-sm text-amber-700">{`Count: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

export default function InsightsPage({ cigars }: InsightsPageProps) {
  const dataByCountry = aggregateData(cigars, 'country');
  const dataByStrength = aggregateData(cigars, 'strength');
  const dataByBrand = aggregateData(cigars, 'brand').slice(0, 10); // Top 10

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-2xl shadow-lg border border-amber-200"
      >
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-amber-600 rounded-2xl">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-amber-900">Collection Insights</h1>
            <p className="text-amber-700 font-medium">A visual overview of your humidor.</p>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Graphique par Pays */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-amber-200"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Globe className="h-6 w-6 text-amber-600"/>
            <h2 className="text-xl font-bold text-amber-900">Cigars by Country</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataByCountry}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {dataByCountry.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Graphique par Force */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-2xl shadow-lg border border-amber-200"
        >
          <div className="flex items-center space-x-3 mb-4">
            <Zap className="h-6 w-6 text-amber-600"/>
            <h2 className="text-xl font-bold text-amber-900">Cigars by Strength</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataByStrength}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                nameKey="name"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {dataByStrength.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Graphique par Marque */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white p-6 rounded-2xl shadow-lg border border-amber-200"
      >
        <div className="flex items-center space-x-3 mb-4">
          <Hash className="h-6 w-6 text-amber-600"/>
          <h2 className="text-xl font-bold text-amber-900">Top 10 Brands</h2>
        </div>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={dataByBrand} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis type="category" dataKey="name" width={100} stroke="#4A5568" />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(239, 218, 180, 0.3)' }} />
            <Bar dataKey="value" barSize={20}>
              {dataByBrand.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
} 