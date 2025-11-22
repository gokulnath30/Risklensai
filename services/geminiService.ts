import { GoogleGenAI } from "@google/genai";
import { RiskAssessment } from "../types";

const SYSTEM_INSTRUCTION = `
You are a senior credit risk strategist for micro-lending in Tamil Nadu, India. 
Your goal is to simulate a multi-agent system that analyzes a district across six dimensions: 
Financial Risk, Income Stability, Climate Risk, Socio-Economic Vulnerability, Infrastructure, and Shock History.

You must return a strictly formatted JSON object. Do not return Markdown. 

The output format must match this structure exactly:
{
  "District": "string",
  "Overall Risk Level": "Low" | "Medium" | "High",
  "Dimension Risk Levels": {
    "Credit & Financial Behaviour": "Low" | "Medium" | "High",
    "Income Stability": "Low" | "Medium" | "High",
    "Climate & Agricultural Risk": "Low" | "Medium" | "High",
    "Socio-Economic Vulnerability": "Low" | "Medium" | "High",
    "Infrastructure & Access": "Low" | "Medium" | "High",
    "Shock & Event History": "Low" | "Medium" | "High"
  },
  "Key Risk Drivers": ["string", "string", "string"],
  "Safer Borrower Segments": "string",
  "High-Risk Segments": "string",
  "Lending Strategy Suggestions": {
    "Ticket Size Guidance": "string",
    "Product Design Notes": "string",
    "Collection & Operations Notes": "string"
  },
  "Summary": "string"
}

Analyze based on real-world knowledge of the district provided. If exact data is missing, use best available proxies.
`;

export const analyzeDistrictRisk = async (districtName: string): Promise<RiskAssessment> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  const prompt = `Provide a comprehensive micro-lending risk assessment for the district of ${districtName} in Tamil Nadu, India.
  
  Simulate the findings of the following specialist agents:
  1. Financial Risk Agent (NPA trends, over-leveraging)
  2. Income Stability Agent (Crop seasonality, industrial presence)
  3. Climate Risk Agent (Drought/Flood history, rainfall)
  4. Socio-Economic Agent (Literacy, migration)
  5. Infrastructure Agent (Connectivity, bank access)
  6. Shock History Agent (Past disasters, major disruptions)

  Synthesize these into the final JSON format requested in the system instructions. Ensure the "Overall Risk Level" reflects a weighted consideration of all factors.`;

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

    // Clean potential markdown code blocks if the model ignores mimeType (rare but possible)
    const jsonStr = text.replace(/```json\n?|```/g, "").trim();
    
    return JSON.parse(jsonStr) as RiskAssessment;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};