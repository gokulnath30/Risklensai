
import React from 'react';
import { SubRegion } from '../types';
import { MapPin, AlertTriangle, CheckCircle } from 'lucide-react';

interface Props {
  subRegions: SubRegion[];
  districtName: string;
}

const BlockHeatmap: React.FC<Props> = ({ subRegions, districtName }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            Hyper-Local Heatmap
          </h3>
          <p className="text-sm text-slate-500">Block/Taluk level risk variance within {districtName}</p>
        </div>
        <div className="flex gap-2 text-xs font-medium">
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-emerald-100 border border-emerald-200"></div> Low</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-amber-100 border border-amber-200"></div> Medium</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-rose-100 border border-rose-200"></div> High</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {subRegions.map((region, idx) => {
          let bgClass = '';
          let textClass = '';
          let borderClass = '';
          
          if (region.riskLevel === 'High') {
            bgClass = 'bg-rose-50 hover:bg-rose-100';
            textClass = 'text-rose-900';
            borderClass = 'border-rose-200';
          } else if (region.riskLevel === 'Medium') {
            bgClass = 'bg-amber-50 hover:bg-amber-100';
            textClass = 'text-amber-900';
            borderClass = 'border-amber-200';
          } else {
            bgClass = 'bg-emerald-50 hover:bg-emerald-100';
            textClass = 'text-emerald-900';
            borderClass = 'border-emerald-200';
          }

          return (
            <div key={idx} className={`${bgClass} border ${borderClass} rounded-xl p-4 transition-all duration-200 relative group`}>
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-bold uppercase tracking-wider opacity-60 ${textClass}`}>{region.type}</span>
                <span className={`text-xs font-bold px-1.5 py-0.5 rounded bg-white/60 ${textClass}`}>{region.riskScore}</span>
              </div>
              <h4 className={`font-bold text-lg mb-1 ${textClass}`}>{region.name}</h4>
              <div className="flex items-center gap-1.5 mt-2">
                {region.riskLevel === 'High' ? <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> : <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />}
                <span className={`text-xs font-medium ${textClass} opacity-90 truncate`}>
                  {region.mainRiskFactor}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BlockHeatmap;
