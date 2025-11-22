import React from 'react';
import { RiskLevel } from '../types';
import RiskBadge from './RiskBadge';
import { AlertTriangle, CheckCircle, AlertCircle } from 'lucide-react';

interface DimensionCardProps {
  title: string;
  level: RiskLevel;
  description?: string;
  icon: React.ReactNode;
}

const DimensionCard: React.FC<DimensionCardProps> = ({ title, level, icon }) => {
  const getBorderColor = () => {
    switch (level) {
      case 'Low': return 'border-l-emerald-500';
      case 'Medium': return 'border-l-amber-500';
      case 'High': return 'border-l-rose-500';
    }
  };

  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-100 border-l-4 ${getBorderColor()} p-4 hover:shadow-md transition-shadow`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2 text-gray-700 font-semibold">
          {icon}
          <span>{title}</span>
        </div>
        <RiskBadge level={level} size="sm" />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {level === 'Low' && "Favorable conditions detected."}
        {level === 'Medium' && "Caution advised due to mixed signals."}
        {level === 'High' && "Significant stress factors present."}
      </p>
    </div>
  );
};

export default DimensionCard;