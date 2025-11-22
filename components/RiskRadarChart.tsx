import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { DimensionRiskLevels } from '../types';

interface Props {
  dimensions: DimensionRiskLevels;
}

const RiskRadarChart: React.FC<Props> = ({ dimensions }) => {
  const mapLevelToScore = (level: string) => {
    switch (level) {
      case 'Low': return 1; // Low risk is good, but on a risk chart, low value means low risk (better)
      case 'Medium': return 2;
      case 'High': return 3;
      default: return 0;
    }
  };

  const data = Object.entries(dimensions).map(([key, value]) => ({
    subject: key.replace(" & ", "\n& "), // Break lines for long labels
    A: mapLevelToScore(value as string),
    fullMark: 3,
    level: value
  }));

  return (
    <div className="w-full h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#e2e8f0" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#64748b', fontSize: 10 }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 3]} tick={false} axisLine={false} />
          <Radar
            name="Risk Level"
            dataKey="A"
            stroke="#6366f1"
            strokeWidth={2}
            fill="#818cf8"
            fillOpacity={0.4}
          />
          <Tooltip 
            formatter={(value: number) => {
              if (value === 1) return "Low Risk";
              if (value === 2) return "Medium Risk";
              if (value === 3) return "High Risk";
              return value;
            }}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskRadarChart;