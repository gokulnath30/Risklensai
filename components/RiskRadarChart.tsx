
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { DimensionRiskLevels } from '../types';

interface Props {
  dimensions: DimensionRiskLevels;
}

const RiskRadarChart: React.FC<Props> = ({ dimensions }) => {
  const data = Object.entries(dimensions).map(([key, value]) => ({
    subject: key.replace(" & ", "\n& "), // Break lines for long labels
    A: value.score, // Use the raw score (0-100)
    fullMark: 100,
    level: value.level
  }));

  return (
    <div className="w-full h-[340px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="#e2e8f0" gridType="polygon" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }} 
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Risk Score"
            dataKey="A"
            stroke="#6366f1"
            strokeWidth={2}
            fill="#818cf8"
            fillOpacity={0.3}
          />
          <Tooltip 
            formatter={(value: number) => [`${value}/100`, "Risk Score"]}
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
            itemStyle={{ color: '#475569', fontWeight: 600 }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RiskRadarChart;
