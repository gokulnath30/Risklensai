import React from 'react';
import { RiskLevel } from '../types';

interface RiskBadgeProps {
  level: RiskLevel;
  size?: 'sm' | 'md' | 'lg';
}

const RiskBadge: React.FC<RiskBadgeProps> = ({ level, size = 'md' }) => {
  let colorClass = '';
  
  switch (level) {
    case 'Low':
      colorClass = 'bg-emerald-100 text-emerald-800 border-emerald-200';
      break;
    case 'Medium':
      colorClass = 'bg-amber-100 text-amber-800 border-amber-200';
      break;
    case 'High':
      colorClass = 'bg-rose-100 text-rose-800 border-rose-200';
      break;
    default:
      colorClass = 'bg-gray-100 text-gray-800 border-gray-200';
  }

  const sizeClass = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base font-semibold',
  };

  return (
    <span className={`inline-flex items-center justify-center rounded-full border ${colorClass} ${sizeClass[size]} font-medium shadow-sm`}>
      {level} Risk
    </span>
  );
};

export default RiskBadge;