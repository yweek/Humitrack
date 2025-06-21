import React from 'react';

interface CigarCutterIconProps {
  className?: string;
}

export default function CigarCutterIcon({ className = "h-6 w-6" }: CigarCutterIconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Corps principal de la coupe-cigare */}
      <path d="M6 8h12a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2z" />
      
      {/* Lame de coupe */}
      <path d="M8 6l8 0" />
      <path d="M8 18l8 0" />
      
      {/* Poignée */}
      <path d="M4 10h2" />
      <path d="M18 10h2" />
      
      {/* Détails de la lame */}
      <path d="M10 6l4 0" strokeWidth="1.5" />
      <path d="M10 18l4 0" strokeWidth="1.5" />
      
      {/* Indicateur de coupe */}
      <circle cx="12" cy="12" r="1" fill="currentColor" />
    </svg>
  );
} 