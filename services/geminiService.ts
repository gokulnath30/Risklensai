
import { GoogleGenAI } from "@google/genai";
import { RiskAssessment } from "../types";

// The Synthesis Agent's System Instruction
const ROOT_AGENT_INSTRUCTION = `
You are the "Root Risk Synthesis Agent" for a multi-agent AI system analyzing micro-lending risk in Tamil Nadu.
You have received four detailed reports from specialist agents (Regulatory, Socio-Economic, Environmental, Market).

Your task is to SYNTHESIZE these reports into a single, cohesive, strictly formatted JSON object.
Do not output Markdown. Only output the JSON.

Data Mapping Rules:
- Map "Environmental Agent" insights to the "Climate & Agricultural Risk" dimension.
- Map "Socio-Economic Agent" insights to "Socio-Economic Vulnerability" and "Income Stability".
- Map "Regulatory" and "Market" agents to "Credit & Financial Behaviour", "Bank Intelligence", and "Lending Strategy".
- "Overall Risk Score" must be a weighted average derived from the severity of the agent reports.
- **CRITICAL**: Break down the district into **EXACTLY 6** specific Blocks, Taluks, or Neighborhoods to create a "Hyper-Local Heatmap". 
- Assign varied risk scores to these 6 sub-regions based on reality (e.g., coastal areas might have higher climate risk, urban areas might have higher income stability).

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
  "SubRegion Analysis": [
    {
      "name": "string", // Name of a specific Block/Taluk inside the district
      "type": "Urban" | "Rural" | "Coastal" | "Semi-Urban",
      "riskScore": number, // 0-100
      "riskLevel": "Low" | "Medium" | "High",
      "mainRiskFactor": "string" // e.g. "Flood Prone"
    }
    // ... provide EXACTLY 6 sub-regions
  ],
  "Summary": "string"
}
`;

interface AgentDef {
  name: string;
  focus: string;
  tools: string[];
}

const AGENTS: AgentDef[] = [
  {
    name: "Regulatory Compliance Agent",
    focus: "Tamil Nadu Prohibition of Charging Exorbitant Interest Act, recent state loan waivers, political interference in collections, and district-level administrative strictness.",
    tools: ["Legal Database", "Govt Gazette"]
  },
  {
    name: "Socio-Economic Risk Agent",
    focus: "District-level poverty indices, caste-based economic disparities, household debt-to-income ratios, literacy rates, and migration patterns.",
    tools: ["Census Data", "Household Survey"]
  },
  {
    name: "Environmental & Livelihood Agent",
    focus: "Climate shocks (floods, cyclones like Gaja/Michaung, droughts), rainfall dependency, crop insurance coverage, and agricultural cycle stability.",
    tools: ["Weather API", "Satellite Maps"]
  },
  {
    name: "Portfolio & Market Trend Agent",
    focus: "Gross Loan Portfolio (GLP) growth, NPA trends in the region, MFI saturation levels, and repayment ethics/credit culture.",
    tools: ["CRIF High Mark (Sim)", "MFI Reports"]
  }
];

export const analyzeDistrictRisk = async (
  districtName: string, 
  onProgress?: (status: string, activeAgent?: string) => void
): Promise<RiskAssessment> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  // --- Step 1: Parallel Agent Execution ---
  onProgress?.("Initializing Multi-Agent Swarm...", "Root");

  const agentPromises = AGENTS.map(async (agent) => {
    // Simulate a small delay for UI effect so the user sees the "Parallel" action
    await new Promise(r => setTimeout(r, Math.random() * 800)); 
    
    onProgress?.(`Querying ${agent.tools.join(" & ")}...`, agent.name);
    
    const prompt = `
      You are the ${agent.name}.
      Analyze the micro-lending risk for the district: "${districtName}" in Tamil Nadu, India.
      
      Focus strictly on: ${agent.focus}
      
      Output Requirements:
      1. A professional risk assessment summary (3-4 sentences).
      2. Three specific, quantitative, or event-based data points relevant to this district.
      3. A generic 'Risk Level' estimation (Low/Medium/High) for your specific domain.
      4. **Important**: Identify specific Blocks or Taluks within ${districtName} that are particularly risky or safe according to your domain.
      
      Be realistic. Use specific names of places, crops, or recent events in ${districtName} if possible.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return {
      name: agent.name,
      output: response.text
    };
  });

  // Wait for all specialist agents to finish
  const agentResults = await Promise.all(agentPromises);
  
  onProgress?.("Agents Data Received. Synthesizing Hyper-Local Heatmap...", "Root");

  // --- Step 2: Synthesis (Root Agent) ---
  
  const synthesisContext = agentResults.map(r => `### REPORT FROM ${r.name.toUpperCase()}:\n${r.output}`).join("\n\n");

  const finalPrompt = `
    Input: Specialist Agent Reports for ${districtName}.
    
    ${synthesisContext}
    
    Task: As the Root Agent, synthesize these conflicting or complementary insights into the final JSON format.
    Ensure you generate the "SubRegion Analysis" to create a heatmap of specific blocks/taluks within ${districtName}.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
      config: {
        systemInstruction: ROOT_AGENT_INSTRUCTION,
        responseMimeType: "application/json",
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");

    const jsonStr = text.replace(/```json\n?|```/g, "").trim();
    return JSON.parse(jsonStr) as RiskAssessment;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
