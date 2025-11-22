import React, { useState } from 'react';
import { Search, MapPin, Activity, TrendingUp, ShieldAlert, CloudRain, Users, Wifi, History, Info, ChevronRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { RiskAssessment } from './types';
import { analyzeDistrictRisk } from './services/geminiService';
import RiskBadge from './components/RiskBadge';
import DimensionCard from './components/DimensionCard';
import RiskRadarChart from './components/RiskRadarChart';

const App: React.FC = () => {
  const [district, setDistrict] = useState('Thanjavur');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<RiskAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!district.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await analyzeDistrictRisk(district);
      setData(result);
    } catch (err) {
      setError("Failed to analyze district. Please try again or check your API Key.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
              R
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">RiskLens <span className="text-indigo-600">AI</span></span>
          </div>
          <div className="text-xs text-slate-500 font-medium flex items-center gap-1">
             Powered by Gemini 2.5 Flash
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero / Search Section */}
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-4">
            Hyper-Local Micro-Lending Intelligence
          </h1>
          <p className="text-slate-600 text-lg mb-8">
            Analyze credit risk, income stability, and socio-economic factors at the district level using multi-agent AI.
          </p>
          
          <form onSubmit={handleAnalyze} className="relative max-w-lg mx-auto">
            <div className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-30 group-hover:opacity-75 transition duration-200"></div>
              <div className="relative flex items-center bg-white rounded-full shadow-xl">
                <MapPin className="ml-4 text-slate-400 w-5 h-5" />
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Enter District Name (e.g., Thanjavur, Madurai)"
                  className="w-full py-4 px-4 text-slate-700 rounded-full focus:outline-none font-medium placeholder:font-normal"
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className="mr-1.5 py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-medium transition-colors flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  Analyze
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg flex items-center gap-3">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Results Dashboard */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Aggregating Multi-Agent Insights...</p>
            <p className="text-slate-400 text-sm mt-2">Checking Climate, Financial, and Socio-Economic vectors</p>
          </div>
        )}

        {data && !loading && (
          <div className="space-y-6 animate-fade-in">
            
            {/* Top Row: Summary & Overall Score */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left: Overall Score */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col items-center justify-center text-center">
                <h3 className="text-slate-500 uppercase tracking-wider text-xs font-bold mb-4">Overall Risk Assessment</h3>
                <div className="mb-4 transform scale-125">
                  <RiskBadge level={data["Overall Risk Level"]} size="lg" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">{data.District}</h2>
                <p className="text-sm text-slate-500">Tamil Nadu, India</p>
              </div>

              {/* Right: Executive Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 col-span-1 lg:col-span-2 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-3 text-indigo-600 font-semibold">
                  <Info className="w-5 h-5" />
                  <h3>Executive Summary</h3>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {data.Summary}
                </p>
              </div>
            </div>

            {/* Middle Row: Dimensions Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <DimensionCard 
                title="Financial Behaviour" 
                level={data["Dimension Risk Levels"]["Credit & Financial Behaviour"]} 
                icon={<TrendingUp className="w-5 h-5 text-blue-600" />} 
              />
              <DimensionCard 
                title="Income Stability" 
                level={data["Dimension Risk Levels"]["Income Stability"]} 
                icon={<Activity className="w-5 h-5 text-emerald-600" />} 
              />
              <DimensionCard 
                title="Climate Risk" 
                level={data["Dimension Risk Levels"]["Climate & Agricultural Risk"]} 
                icon={<CloudRain className="w-5 h-5 text-cyan-600" />} 
              />
              <DimensionCard 
                title="Socio-Economic" 
                level={data["Dimension Risk Levels"]["Socio-Economic Vulnerability"]} 
                icon={<Users className="w-5 h-5 text-purple-600" />} 
              />
              <DimensionCard 
                title="Infrastructure" 
                level={data["Dimension Risk Levels"]["Infrastructure & Access"]} 
                icon={<Wifi className="w-5 h-5 text-orange-600" />} 
              />
              <DimensionCard 
                title="Shock History" 
                level={data["Dimension Risk Levels"]["Shock & Event History"]} 
                icon={<History className="w-5 h-5 text-red-600" />} 
              />
            </div>

            {/* Bottom Row: Deep Dive & Chart */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Strategy Column */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Strategy Cards */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="bg-slate-50 px-6 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800">Lending Strategy Recommendations</h3>
                  </div>
                  <div className="p-6 grid gap-6">
                    <div className="flex gap-4">
                      <div className="w-1 bg-indigo-500 rounded-full"></div>
                      <div>
                        <h4 className="text-sm font-bold text-indigo-900 uppercase mb-1">Ticket Size</h4>
                        <p className="text-sm text-slate-600">{data["Lending Strategy Suggestions"]["Ticket Size Guidance"]}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-1 bg-emerald-500 rounded-full"></div>
                      <div>
                        <h4 className="text-sm font-bold text-emerald-900 uppercase mb-1">Product Design</h4>
                        <p className="text-sm text-slate-600">{data["Lending Strategy Suggestions"]["Product Design Notes"]}</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-1 bg-amber-500 rounded-full"></div>
                      <div>
                        <h4 className="text-sm font-bold text-amber-900 uppercase mb-1">Collections</h4>
                        <p className="text-sm text-slate-600">{data["Lending Strategy Suggestions"]["Collection & Operations Notes"]}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Segments */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-br from-emerald-50 to-white rounded-xl p-5 border border-emerald-100">
                    <h4 className="text-emerald-800 font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" /> Safer Segments
                    </h4>
                    <p className="text-sm text-emerald-900/80 leading-relaxed">
                      {data["Safer Borrower Segments"]}
                    </p>
                  </div>
                  <div className="bg-gradient-to-br from-rose-50 to-white rounded-xl p-5 border border-rose-100">
                    <h4 className="text-rose-800 font-semibold mb-2 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" /> High Risk Segments
                    </h4>
                    <p className="text-sm text-rose-900/80 leading-relaxed">
                      {data["High-Risk Segments"]}
                    </p>
                  </div>
                </div>

              </div>

              {/* Chart Column */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
                 <h3 className="text-sm font-bold text-slate-800 uppercase mb-6 text-center">Risk Radar Visualization</h3>
                 <div className="flex-grow flex items-center justify-center">
                   <RiskRadarChart dimensions={data["Dimension Risk Levels"]} />
                 </div>
                 <div className="mt-6">
                   <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Key Drivers</h4>
                   <ul className="space-y-2">
                     {data["Key Risk Drivers"].map((driver, idx) => (
                       <li key={idx} className="text-sm text-slate-700 flex items-start gap-2">
                         <ChevronRight className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                         {driver}
                       </li>
                     ))}
                   </ul>
                 </div>
              </div>

            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;