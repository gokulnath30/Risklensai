
import React from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  color?: 'indigo' | 'emerald' | 'rose' | 'amber' | 'slate';
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, subtext, icon, color = 'slate' }) => {
  const colorClasses = {
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-100',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    rose: 'bg-rose-50 text-rose-700 border-rose-100',
    amber: 'bg-amber-50 text-amber-700 border-amber-100',
    slate: 'bg-slate-50 text-slate-700 border-slate-100',
  };

  return (
    <div className={`rounded-xl border p-4 flex items-start justify-between ${colorClasses[color]} transition-all hover:shadow-sm`}>
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide opacity-70 mb-1">{label}</p>
        <h4 className="text-xl font-bold tracking-tight">{value}</h4>
        {subtext && <p className="text-[10px] opacity-80 mt-1 font-medium leading-tight">{subtext}</p>}
      </div>
      {icon && <div className="opacity-80 p-2 bg-white/50 rounded-lg">{icon}</div>}
    </div>
  );
};

export default MetricCard;
