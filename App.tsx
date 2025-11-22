
import React, { useState } from 'react';
import { Search, MapPin, Activity, TrendingUp, ShieldAlert, CloudRain, Users, Wifi, History, Loader2, CheckCircle, AlertCircle, Building2, Wallet, Scale, AlertTriangle, Bot, BrainCircuit, FileText, Download, LayoutDashboard, Map as MapIcon } from 'lucide-react';
import { RiskAssessment } from './types';
import { analyzeDistrictRisk } from './services/geminiService';
import RiskBadge from './components/RiskBadge';
import DimensionCard from './components/DimensionCard';
import RiskRadarChart from './components/RiskRadarChart';
import MetricCard from './components/MetricCard';
import BlockHeatmap from './components/BlockHeatmap';
import GeoMap from './components/GeoMap';

const App: React.FC = () => {
  const [district, setDistrict] = useState('Thanjavur');
  const [loading, setLoading] = useState(false);
  const [loadingStatus, setLoadingStatus] = useState("Initializing...");
  const [activeAgent, setActiveAgent] = useState<string | null>(null);
  const [data, setData] = useState<RiskAssessment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'heatmap' | 'geomap'>('geomap');

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!district.trim()) return;

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await analyzeDistrictRisk(district, (status, agentName) => {
        setLoadingStatus(status);
        if (agentName) setActiveAgent(agentName);
      });
      setData(result);
    } catch (err) {
      setError("Failed to analyze district. Please try again or check your API Key.");
    } finally {
      setLoading(false);
      setActiveAgent(null);
    }
  };

  const handleExport = () => {
    if (!data) return;

    const timestamp = new Date().toLocaleString();
    const reportContent = `
RISKLENS AI - MICRO-LENDING RISK REPORT
Generated on: ${timestamp}
Target District: ${data.District}
--------------------------------------------------

EXECUTIVE SUMMARY
${data.Summary}

OVERALL RISK PROFILE
Score: ${data["Overall Risk Score"]}/100
Level: ${data["Overall Risk Level"]}

BANK INTELLIGENCE
- Predicted Default Rate: ${data["Bank Intelligence"].predictedDefaultRate}
- Recommended Interest Spread: ${data["Bank Intelligence"].recommendedInterestSpread}
- Max Exposure per Borrower: ${data["Bank Intelligence"].maxExposurePerBorrower}
- Collection Difficulty: ${data["Bank Intelligence"].collectionDifficultyScore}/10

SUB-REGION ANALYSIS (Hyper-Local Risk)
${data["SubRegion Analysis"].map(r => `- ${r.name} (${r.type}): ${r.riskLevel} Risk (Score: ${r.riskScore}). Factor: ${r.mainRiskFactor}`).join('\n')}

RISK DIMENSIONS
1. Financial Behaviour: ${data["Dimension Insights"]["Credit & Financial Behaviour"].level} - ${data["Dimension Insights"]["Credit & Financial Behaviour"].insight}
2. Income Stability: ${data["Dimension Insights"]["Income Stability"].level} - ${data["Dimension Insights"]["Income Stability"].insight}
3. Climate Risk: ${data["Dimension Insights"]["Climate & Agricultural Risk"].level} - ${data["Dimension Insights"]["Climate & Agricultural Risk"].insight}

STRATEGIC RECOMMENDATIONS
- Product: ${data["Lending Strategy Suggestions"]["Product Design Notes"]}
- Collections: ${data["Lending Strategy Suggestions"]["Collection & Operations Notes"]}
- Ticket Size: ${data["Lending Strategy Suggestions"]["Ticket Size Guidance"]}

--------------------------------------------------
Powered by RiskLens AI Multi-Agent System
    `;

    const blob = new Blob([reportContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `RiskLens_Report_${data.District}_${new Date().toISOString().slice(0,10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const AgentLoadingView = () => (
    <div className="flex flex-col items-center justify-center py-24 animate-in fade-in max-w-2xl mx-auto">
      <div className="relative mb-12">
        <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-2 shadow-sm">
          <BrainCircuit className="w-8 h-8 text-indigo-600" />
        </div>
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-2">{loadingStatus}</h3>
      <p className="text-slate-500 mb-8 text-center max-w-md">
        Orchestrating multi-agent swarm to analyze regulatory, environmental, and socio-economic vectors for {district}.
      </p>

      {/* Agent Visualization */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
        {[
          { id: 'Regulatory Compliance Agent', icon: <Scale className="w-4 h-4" />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { id: 'Socio-Economic Risk Agent', icon: <Users className="w-4 h-4" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { id: 'Environmental & Livelihood Agent', icon: <CloudRain className="w-4 h-4" />, color: 'text-cyan-600', bg: 'bg-cyan-50' },
          { id: 'Portfolio & Market Trend Agent', icon: <TrendingUp className="w-4 h-4" />, color: 'text-purple-600', bg: 'bg-purple-50' }
        ].map((agent) => (
          <div 
            key={agent.id}
            className={`flex flex-col items-center p-3 rounded-xl border transition-all duration-300 ${
              activeAgent === agent.id 
                ? 'border-indigo-500 shadow-md scale-105 bg-white ring-2 ring-indigo-100' 
                : 'border-slate-100 bg-slate-50 opacity-60 grayscale'
            }`}
          >
            <div className={`p-2 rounded-lg ${agent.bg} ${agent.color} mb-2`}>
              {agent.icon}
            </div>
            <span className="text-[10px] font-bold text-slate-600 text-center leading-tight">{agent.id.replace(' Agent', '')}</span>
            {activeAgent === agent.id && (
              <span className="text-[9px] text-indigo-600 font-medium mt-1 animate-pulse">Processing...</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg shadow-indigo-200">
              <Bot className="w-5 h-5" />
            </div>
            <div className="leading-tight">
              <span className="text-lg font-bold tracking-tight text-slate-900 block">RiskLens <span className="text-indigo-600">AI</span></span>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Multi-Agent Swarm</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {data && (
               <button 
                onClick={handleExport}
                className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 text-white rounded-md text-xs font-medium hover:bg-slate-800 transition-colors shadow-sm active:scale-95"
               >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Report</span>
               </button>
            )}
            
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className={`transition-all duration-500 ease-in-out ${data ? 'mb-8' : 'mb-12 text-center max-w-3xl mx-auto'}`}>
          {!data && !loading && (
            <>
              <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Micro-Lending Intelligence
              </h1>
              <p className="text-slate-600 text-lg mb-8">
                Deploy a swarm of specialized AI agents to analyze regulatory, environmental, and credit risks in Tamil Nadu down to the <strong>Block/Taluk level</strong>.
              </p>
            </>
          )}
          
          <form onSubmit={handleAnalyze} className={`relative ${data ? 'max-w-xl' : 'max-w-lg mx-auto'}`}>
            <div className="relative group">
              {!data && <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full blur opacity-20 group-hover:opacity-60 transition duration-200"></div>}
              <div className={`relative flex items-center bg-white ${data ? 'rounded-xl border border-slate-200 shadow-sm' : 'rounded-full shadow-xl'} overflow-hidden`}>
                <MapPin className={`ml-4 ${data ? 'text-indigo-500' : 'text-slate-400'} w-5 h-5`} />
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Enter District (e.g., Thanjavur, Madurai)"
                  className="w-full py-3.5 px-4 text-slate-700 focus:outline-none font-medium placeholder:font-normal bg-transparent"
                />
                <button 
                  type="submit" 
                  disabled={loading}
                  className={`mr-1.5 py-2 px-5 ${data ? 'bg-indigo-600 text-white rounded-lg' : 'bg-indigo-600 text-white rounded-full'} font-medium hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:opacity-70`}
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  {data ? 'Analyze' : 'Analyze'}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-2xl mx-auto mb-8 p-4 bg-rose-50 text-rose-700 border border-rose-200 rounded-lg flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <ShieldAlert className="w-5 h-5 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {/* Loading State with Multi-Agent View */}
        {loading && <AgentLoadingView />}

        {/* Dashboard */}
        {data && !loading && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* Section 1: Vital Signs Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard 
                label="Banking Penetration" 
                value={data["Market Demographics"].bankingPenetration} 
                icon={<Building2 className="w-5 h-5" />}
                color="indigo"
              />
               <MetricCard 
                label="Est. NPA Rate" 
                value={data["Bank Intelligence"].predictedDefaultRate} 
                subtext="Next 12mo projection"
                icon={<AlertTriangle className="w-5 h-5" />}
                color="rose"
              />
              <MetricCard 
                label="Primary Income" 
                value={data["Market Demographics"].primaryIncomeSource} 
                icon={<Wallet className="w-5 h-5" />}
                color="emerald"
              />
              <MetricCard 
                label="Pop. Density" 
                value={data["Market Demographics"].populationDensity} 
                icon={<Users className="w-5 h-5" />}
                color="slate"
              />
            </div>

            {/* Section 2: Main Risk Profile */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left: Overall Assessment (4 cols) */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 overflow-hidden relative">
                  <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                  
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h2 className="text-3xl font-bold text-slate-900">{data.District}</h2>
                      <p className="text-slate-500 font-medium">Overall Risk Profile</p>
                    </div>
                    <RiskBadge level={data["Overall Risk Level"]} size="lg" />
                  </div>

                  <div className="flex items-end gap-2 mb-2">
                    <span className="text-5xl font-black text-slate-900 tracking-tighter">{data["Overall Risk Score"]}</span>
                    <span className="text-lg font-medium text-slate-400 mb-1.5">/100</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-6">Composite Risk Score (Weighted Agent Average)</p>

                  {/* Executive Summary */}
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                    <h4 className="text-xs font-bold text-slate-500 uppercase mb-2 flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5" /> Root Agent Summary
                    </h4>
                    <p className="text-sm text-slate-700 leading-relaxed">
                      {data.Summary}
                    </p>
                  </div>
                </div>

                {/* Radar Chart Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4">
                   <h4 className="text-xs font-bold text-slate-500 uppercase mb-4 text-center">Multi-Dimensional Vulnerability Map</h4>
                   <RiskRadarChart dimensions={data["Dimension Insights"]} />
                </div>
              </div>

              {/* Right: Dimensions & HEATMAP (8 cols) */}
              <div className="lg:col-span-8 flex flex-col gap-6">
                 
                 {/* Map / Heatmap Toggle Section */}
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-1">
                   <div className="flex gap-1 mb-0 p-1 bg-slate-100/50 rounded-xl w-fit">
                      <button 
                        onClick={() => setViewMode('geomap')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'geomap' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <MapIcon className="w-4 h-4" /> Geo-Map
                      </button>
                      <button 
                        onClick={() => setViewMode('heatmap')}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${viewMode === 'heatmap' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                      >
                        <LayoutDashboard className="w-4 h-4" /> Grid View
                      </button>
                   </div>
                   
                   <div className="p-1">
                     {data["SubRegion Analysis"] && (
                       viewMode === 'geomap' ? (
                          <GeoMap subRegions={data["SubRegion Analysis"]} districtName={data.District} />
                       ) : (
                          <BlockHeatmap subRegions={data["SubRegion Analysis"]} districtName={data.District} />
                       )
                     )}
                   </div>
                 </div>

                 {/* Dimensions Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
                    <DimensionCard 
                      title="Financial Behaviour" 
                      data={data["Dimension Insights"]["Credit & Financial Behaviour"]} 
                      icon={<TrendingUp className="w-4 h-4" />} 
                    />
                    <DimensionCard 
                      title="Income Stability" 
                      data={data["Dimension Insights"]["Income Stability"]} 
                      icon={<Activity className="w-4 h-4" />} 
                    />
                    <DimensionCard 
                      title="Climate Risk" 
                      data={data["Dimension Insights"]["Climate & Agricultural Risk"]} 
                      icon={<CloudRain className="w-4 h-4" />} 
                    />
                    <DimensionCard 
                      title="Socio-Economic" 
                      data={data["Dimension Insights"]["Socio-Economic Vulnerability"]} 
                      icon={<Users className="w-4 h-4" />} 
                    />
                    <DimensionCard 
                      title="Infrastructure" 
                      data={data["Dimension Insights"]["Infrastructure & Access"]} 
                      icon={<Wifi className="w-4 h-4" />} 
                    />
                    <DimensionCard 
                      title="Shock History" 
                      data={data["Dimension Insights"]["Shock & Event History"]} 
                      icon={<History className="w-4 h-4" />} 
                    />
                 </div>
              </div>
            </div>

            {/* Section 3: Banker's Toolkit */}
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2 mt-8">
              <Scale className="w-5 h-5 text-indigo-600" />
              Underwriting & Policy Guidelines
            </h3>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Policy Card */}
              <div className="bg-slate-900 rounded-2xl shadow-lg p-6 text-slate-50 lg:col-span-1">
                <h4 className="text-indigo-300 font-semibold uppercase tracking-wider text-xs mb-6">Recommended Policy Parameters</h4>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Max Exposure</span>
                      <span className="font-bold text-white">{data["Bank Intelligence"].maxExposurePerBorrower}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full"><div className="bg-indigo-500 h-1.5 rounded-full w-3/4"></div></div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Interest Spread</span>
                      <span className="font-bold text-white">{data["Bank Intelligence"].recommendedInterestSpread}</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full"><div className="bg-emerald-500 h-1.5 rounded-full w-1/2"></div></div>
                  </div>

                  <div>
                     <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Collection Difficulty</span>
                      <span className="font-bold text-rose-400">{data["Bank Intelligence"].collectionDifficultyScore}/10</span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full">
                      <div 
                        className={`h-1.5 rounded-full ${data["Bank Intelligence"].collectionDifficultyScore > 7 ? 'bg-rose-500' : 'bg-amber-500'}`} 
                        style={{ width: `${data["Bank Intelligence"].collectionDifficultyScore * 10}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-800">
                  <h5 className="text-xs font-semibold text-slate-400 mb-2">Key Risk Drivers</h5>
                  <div className="flex flex-wrap gap-2">
                    {data["Key Risk Drivers"].map((driver, i) => (
                      <span key={i} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-300 border border-slate-700">
                        {driver}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Strategy & Segments */}
              <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                 
                 {/* Strategy Text */}
                 <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h4 className="font-bold text-slate-900 mb-4">Operational Strategy</h4>
                    <ul className="space-y-4">
                      <li className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600 font-bold text-xs">1</div>
                        <div>
                          <h5 className="text-xs font-bold uppercase text-slate-500 mb-0.5">Product Design</h5>
                          <p className="text-sm text-slate-700">{data["Lending Strategy Suggestions"]["Product Design Notes"]}</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600 font-bold text-xs">2</div>
                        <div>
                          <h5 className="text-xs font-bold uppercase text-slate-500 mb-0.5">Collections</h5>
                          <p className="text-sm text-slate-700">{data["Lending Strategy Suggestions"]["Collection & Operations Notes"]}</p>
                        </div>
                      </li>
                      <li className="flex gap-3">
                         <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center flex-shrink-0 text-indigo-600 font-bold text-xs">3</div>
                        <div>
                          <h5 className="text-xs font-bold uppercase text-slate-500 mb-0.5">Ticket Size</h5>
                          <p className="text-sm text-slate-700">{data["Lending Strategy Suggestions"]["Ticket Size Guidance"]}</p>
                        </div>
                      </li>
                    </ul>
                 </div>

                 {/* Segments */}
                 <div className="space-y-4">
                    <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 h-[48%]">
                      <h4 className="text-emerald-800 font-bold text-sm mb-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" /> Ideal Borrower Profile
                      </h4>
                      <p className="text-sm text-emerald-900/80 leading-relaxed">
                        {data["Safer Borrower Segments"]}
                      </p>
                    </div>
                    <div className="bg-rose-50 rounded-xl p-5 border border-rose-100 h-[48%]">
                      <h4 className="text-rose-800 font-bold text-sm mb-2 flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> Segments to Avoid
                      </h4>
                      <p className="text-sm text-rose-900/80 leading-relaxed">
                        {data["High-Risk Segments"]}
                      </p>
                    </div>
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
