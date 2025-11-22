export type RiskLevel = "Low" | "Medium" | "High";

export interface DimensionRiskLevels {
  "Credit & Financial Behaviour": RiskLevel;
  "Income Stability": RiskLevel;
  "Climate & Agricultural Risk": RiskLevel;
  "Socio-Economic Vulnerability": RiskLevel;
  "Infrastructure & Access": RiskLevel;
  "Shock & Event History": RiskLevel;
}

export interface LendingStrategy {
  "Ticket Size Guidance": string;
  "Product Design Notes": string;
  "Collection & Operations Notes": string;
}

export interface RiskAssessment {
  District: string;
  "Overall Risk Level": RiskLevel;
  "Dimension Risk Levels": DimensionRiskLevels;
  "Key Risk Drivers": string[];
  "Safer Borrower Segments": string;
  "High-Risk Segments": string;
  "Lending Strategy Suggestions": LendingStrategy;
  Summary: string;
}

export interface AgentState {
  isLoading: boolean;
  data: RiskAssessment | null;
  error: string | null;
}