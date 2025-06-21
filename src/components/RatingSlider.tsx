import React from 'react';

interface RatingSliderProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  icon?: React.ReactNode;
}

export default function RatingSlider({ 
  label, 
  value, 
  onChange, 
  min = 1, 
  max = 5, 
  step = 0.5,
  icon 
}: RatingSliderProps) {
  const getColorClass = (val: number) => {
    if (val <= 2) return 'bg-red-500';
    if (val <= 3) return 'bg-yellow-500';
    if (val <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {icon}
          <label className="text-sm font-medium text-gray-700">{label}</label>
        </div>
        <span className="text-sm font-bold text-amber-900">{value}</span>
      </div>
      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
          style={{
            background: `linear-gradient(to right, ${getColorClass(value)} 0%, ${getColorClass(value)} ${((value - min) / (max - min)) * 100}%, #e5e7eb ${((value - min) / (max - min)) * 100}%, #e5e7eb 100%)`
          }}
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}