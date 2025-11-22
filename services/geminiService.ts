import { GoogleGenAI } from "@google/genai";
import { RiskAssessment } from "../types";

const SYSTEM_INSTRUCTION = `
You are a senior credit risk strategist and data scientist for micro-lending in Tamil Nadu, India. 
Your goal is to simulate a multi-agent system that analyzes a district across six dimensions.
You must provide granular, quantitative analytics helpful for a bank's underwriting team.

You must return a strictly formatted JSON object. Do not return Markdown.

The output format must match this structure exactly:
{
  "District": "string",
  "Overall Risk Score": number, // 0-100 (0 = Safe, 100 = Critical Risk)
  "Overall Risk Level": "Low" | "Medium" | "High",
  "Dimension Insights": {
    "Credit & Financial Behaviour": { "level": "Low"|"Medium"|"High", "score": number, "trend": "Improving"|"Stable"|"Worsening", "insight": "string" },
    "Income Stability": { "level": "Low"|"Medium"|"High", "score": number, "trend": "Improving"|"Stable"|"Worsening", "insight": "string" },
    "Climate & Agricultural Risk": { "level": "Low"|"Medium"|"High", "score": number, "trend": "Improving"|"Stable"|"Worsening", "insight": "string" },
    "Socio-Economic Vulnerability": { "level": "Low"|"Medium"|"High", "score": number, "trend": "Improving"|"Stable"|"Worsening", "insight": "string" },
    "Infrastructure & Access": { "level": "Low"|"Medium"|"High", "score": number, "trend": "Improving"|"Stable"|"Worsening", "insight": "string" },
    "Shock & Event History": { "level": "Low"|"Medium"|"High", "score": number, "trend": "Improving"|"Stable"|"Worsening", "insight": "string" }
  },
  "Key Risk Drivers": ["string", "string", "string"],
  "Safer Borrower Segments": "string",
  "High-Risk Segments": "string",
  "Bank Intelligence": {
    "predictedDefaultRate": "string", // e.g. "3.2% (Est.)"
    "recommendedInterestSpread": "string", // e.g. "+1.5% over base"
    "maxExposurePerBorrower": "string", // e.g. "INR 35,000"
    "collectionDifficultyScore": number // 1-10 where 10 is hardest
  },
  "Market Demographics": {
    "populationDensity": "string",
    "primaryIncomeSource": "string",
    "bankingPenetration": "string"
  },
  "Lending Strategy Suggestions": {
    "Ticket Size Guidance": "string",
    "Product Design Notes": "string",
    "Collection & Operations Notes": "string"
  },
  "Summary": "string"
}

Analyze based on real-world knowledge. 
- "Score" should be 0-100, where 0 is safest and 100 is highest risk.
- "Trend" indicates the 12-month outlook.
- Be precise with "Bank Intelligence" metrics, acting like an underwriter setting policy.
`;

export const analyzeDistrictRisk = async (districtName: string): Promise<RiskAssessment> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Provide a deep-dive banking risk analytics report for the district of ${districtName} in Tamil Nadu, India.
  
  Simulate these data points:
  1. Quantitative Risk Scores (0-100) for all dimensions.
  2. Forecasted trends (Improving/Stable/Worsening).
  3. Operational metrics: Predicted NPA rates, collection difficulty, and ideal exposure limits.
  
  Use realistic economic proxies for ${districtName} (e.g. if it's a delta district, emphasize climate risk scores; if industrial, emphasize income stability).`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    // Clean potential markdown code blocks
    const jsonStr = text.replace(/```json\n?|```/g, "").trim();
    
    return JSON.parse(jsonStr) as RiskAssessment;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};