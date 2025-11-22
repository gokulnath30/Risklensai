
import React from 'react';
import { DimensionDetail } from '../types';
import RiskBadge from './RiskBadge';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface DimensionCardProps {
  title: string;
  data: DimensionDetail;
  icon: React.ReactNode;
}

const DimensionCard: React.FC<DimensionCardProps> = ({ title, data, icon }) => {
  const { level, score, trend, insight } = data;

  const getTrendIcon = () => {
    if (trend === 'Improving') return <TrendingDown className="w-4 h-4 text-emerald-600" />; // Risk going down is good
    if (trend === 'Worsening') return <TrendingUp className="w-4 h-4 text-rose-600" />; // Risk going up is bad
    return <Minus className="w-4 h-4 text-slate-400" />;
  };

  const getProgressColor = () => {
    if (score < 40) return 'bg-emerald-500';
    if (score < 70) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-5 hover:shadow-md transition-all duration-200 flex flex-col h-full">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 text-slate-800 font-bold">
          <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 text-slate-600">
            {icon}
          </div>
          <span className="text-sm">{title}</span>
        </div>
        <RiskBadge level={level} size="sm" />
      </div>

      <div className="mb-4">
         <div className="flex justify-between items-end mb-1">
           <span className="text-xs font-semibold text-slate-500 uppercase">Risk Score</span>
           <span className="text-lg font-bold text-slate-900">{score}<span className="text-slate-400 text-xs font-normal">/100</span></span>
         </div>
         <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
           <div 
             className={`h-full rounded-full ${getProgressColor()}`} 
             style={{ width: `${score}%` }}
           ></div>
         </div>
      </div>

      <p className="text-xs text-slate-600 flex-grow mb-4 leading-relaxed border-t border-slate-100 pt-3 mt-auto">
        {insight}
      </p>

      <div className="flex items-center justify-between pt-2 border-t border-slate-50">
        <span className="text-xs text-slate-400 font-medium">Trend (12mo)</span>
        <div className="flex items-center gap-1.5 bg-slate-50 px-2 py-1 rounded text-xs font-medium">
           {getTrendIcon()}
           <span className={trend === 'Worsening' ? 'text-rose-700' : trend === 'Improving' ? 'text-emerald-700' : 'text-slate-600'}>
             {trend}
           </span>
        </div>
      </div>
    </div>
  );
};

export default DimensionCard;
