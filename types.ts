
export type RiskLevel = "Low" | "Medium" | "High";

export type TrendDirection = "Improving" | "Stable" | "Worsening";

export interface DimensionDetail {
  level: RiskLevel;
  score: number; // 0-100, where 100 is highest risk
  trend: TrendDirection;
  insight: string; // A short 1-sentence specific insight
}

export interface DimensionRiskLevels {
  "Credit & Financial Behaviour": DimensionDetail;
  "Income Stability": DimensionDetail;
  "Climate & Agricultural Risk": DimensionDetail;
  "Socio-Economic Vulnerability": DimensionDetail;
  "Infrastructure & Access": DimensionDetail;
  "Shock & Event History": DimensionDetail;
}

export interface LendingStrategy {
  "Ticket Size Guidance": string;
  "Product Design Notes": string;
  "Collection & Operations Notes": string;
}

export interface BankIntelligence {
  predictedDefaultRate: string; // e.g. "2.4%"
  recommendedInterestSpread: string; // e.g. "+2.5%"
  maxExposurePerBorrower: string; // e.g. "₹45,000"
  collectionDifficultyScore: number; // 1-10
}

export interface MarketDemographics {
  populationDensity: string;
  primaryIncomeSource: string;
  bankingPenetration: string;
}

export interface SubRegion {
  name: string; // Name of the Block/Taluk
  type: "Urban" | "Rural" | "Coastal" | "Semi-Urban";
  riskScore: number; // 0-100
  riskLevel: RiskLevel;
  mainRiskFactor: string; // e.g. "Flood Prone" or "High Over-leverage"
}

export interface RiskAssessment {
  District: string;
  "Overall Risk Score": number; // 0-100
  "Overall Risk Level": RiskLevel;
  "Dimension Insights": DimensionRiskLevels;
  "Key Risk Drivers": string[];
  "Safer Borrower Segments": string;
  "High-Risk Segments": string;
  "Bank Intelligence": BankIntelligence;
  "Market Demographics": MarketDemographics;
  "Lending Strategy Suggestions": LendingStrategy;
  "SubRegion Analysis": SubRegion[]; // New field for Heatmap
  Summary: string;
}

export interface AgentState {
  isLoading: boolean;
  data: RiskAssessment | null;
  error: string | null;
}
