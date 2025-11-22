
import React, { useState } from 'react';
import { SubRegion } from '../types';
import { MapPin, Info } from 'lucide-react';

interface Props {
  subRegions: SubRegion[];
  districtName: string;
}

// Organic shapes representing a generic district divided into 6 regions
// These paths interlock to form a complete map shape.
const MAP_PATHS = [
  // Top Left
  "M 100,50 Q 150,40 200,60 T 300,50 L 300,150 Q 250,180 200,160 T 100,150 Z",
  // Top Right
  "M 300,50 Q 400,30 500,60 L 520,160 Q 450,200 400,180 T 300,150 Z",
  // Middle Left
  "M 80,150 Q 150,140 200,160 T 320,180 L 300,280 Q 250,320 180,300 T 60,250 Z",
  // Center Right
  "M 320,180 Q 400,160 480,180 T 540,250 L 500,350 Q 420,380 350,340 T 300,280 Z",
  // Bottom Left
  "M 60,250 Q 150,240 200,280 T 300,320 L 280,450 Q 180,480 120,440 T 40,350 Z",
  // Bottom Right
  "M 300,320 Q 380,300 450,340 T 500,350 L 480,460 Q 380,500 300,480 T 280,450 Z"
];

const GeoMap: React.FC<Props> = ({ subRegions, districtName }) => {
  const [hoveredRegion, setHoveredRegion] = useState<SubRegion | null>(null);

  // We map the first 6 regions to our paths. 
  // If fewer regions, we just don't render those paths (or render neutral).
  const mapData = subRegions.slice(0, 6);

  const getFillColor = (level: string) => {
    switch (level) {
      case 'High': return '#f43f5e'; // rose-500
      case 'Medium': return '#f59e0b'; // amber-500
      case 'Low': return '#10b981'; // emerald-500
      default: return '#94a3b8'; // slate-400
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-indigo-600" />
            Geo-Spatial Risk Map
          </h3>
          <p className="text-xs text-slate-500">Projected risk distribution for {districtName}</p>
        </div>
      </div>

      <div className="relative flex-grow flex items-center justify-center bg-slate-50 rounded-xl overflow-hidden p-4 border border-slate-100">
        <svg viewBox="0 0 600 520" className="w-full h-full drop-shadow-xl max-h-[400px]">
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          
          {mapData.map((region, index) => (
            <g 
              key={index} 
              onMouseEnter={() => setHoveredRegion(region)}
              onMouseLeave={() => setHoveredRegion(null)}
              className="cursor-pointer transition-all duration-300"
              style={{ transformOrigin: 'center' }}
            >
              <path
                d={MAP_PATHS[index] || MAP_PATHS[0]}
                fill={getFillColor(region.riskLevel)}
                stroke="white"
                strokeWidth="3"
                className="hover:opacity-90 transition-all duration-300 hover:scale-[1.02]"
                opacity="0.85"
              />
              {/* Region Label embedded in map */}
              <text 
                x={index % 2 === 0 ? 150 : 400} // Rough X positioning based on left/right paths
                y={100 + (Math.floor(index / 2) * 120)} // Rough Y positioning
                textAnchor="middle"
                fill="white"
                className="text-[10px] font-bold pointer-events-none uppercase tracking-wider drop-shadow-md"
                style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.5)' }}
              >
                {region.name.substring(0, 12)}
              </text>
            </g>
          ))}
        </svg>

        {/* Floating Tooltip */}
        {hoveredRegion && (
          <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-slate-200 animate-in slide-in-from-bottom-2">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-slate-900">{hoveredRegion.name}</h4>
                <p className="text-xs text-slate-500 uppercase">{hoveredRegion.type}</p>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-bold ${
                hoveredRegion.riskLevel === 'High' ? 'bg-rose-100 text-rose-700' : 
                hoveredRegion.riskLevel === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                'bg-emerald-100 text-emerald-700'
              }`}>
                Score: {hoveredRegion.riskScore}
              </span>
            </div>
            <p className="text-sm text-slate-700 mt-2 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              {hoveredRegion.mainRiskFactor}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 flex justify-center gap-4 text-xs font-medium text-slate-600">
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> Low Risk</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-500 rounded-sm"></div> Medium Risk</div>
        <div className="flex items-center gap-2"><div className="w-3 h-3 bg-rose-500 rounded-sm"></div> High Risk</div>
      </div>
    </div>
  );
};

export default GeoMap;
