# Risklens AI

A React + TypeScript application for visualizing district-level risk data through a multi-agent AI synthesis system.

## 🚀 Live Demo

**Public Demo:** https://risklens-3001.web.app/  
*Hosted preview of the latest build. If changes aren't visible, rebuild and redeploy.*

## 📸 Demo Screenshots

| Home View | Graph Dashboard | Search Results |
|-----------|-----------------|----------------|
| ![Home](./img/hoem.png) | ![Graph](./img/graph.2.png) | ![Search Results](./img/searched_result1.png) |

## 🛠 Tech Stack

- **Frontend:** React + TypeScript
- **AI Integration:** Google Gemini API
- **Build Tools:** npm scripts (CRA/Vite-based)
- **Deployment:** Firebase Hosting

## 🏗 Project Structure

```
src/
├── components/          # React components
│   ├── BlockHeatmap.tsx
│   ├── DimensionCard.tsx
│   ├── GeoMap.tsx
│   ├── MetricCard.tsx
│   ├── RiskBadge.tsx
│   └── RiskRadarChart.tsx
├── services/
│   └── geminiService.ts # Gemini/LLM API wrapper
└── img/                # Screenshots & assets
```

## 🎯 Core Concept: Multi-Agent Risk Synthesis

Our system employs specialized AI agents that analyze district-level data in parallel, then synthesizes their findings into actionable lending risk assessments.

### Agent Architecture

```
┌─────────────────────────────────────────────────┐
│              Specialist Agents                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │  Financial  │ │   Income    │ │   Climate   │ │
│  │    Risk     │ │  Stability  │ │     Risk    │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ │
│  │ Socio-Econ  │ │ Infrastructure│ │ Shock History│ │
│  │ Vulnerability│ │   Access    │ │     Risk    │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ │
└─────────────────────────────────────────────────┘
         │
         │ Parallel Execution
         ▼
┌─────────────────────────────────────────────────┐
│              Aggregator Agent                   │
│   Synthesizes all inputs into unified risk view │
└─────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────────────────┐
│           Actionable Risk Assessment            │
│   • Overall Risk Level                          │
│   • Key Risk Drivers                            │
│   • Lending Strategy                            │
│   • Borrower Segment Analysis                   │
└─────────────────────────────────────────────────┘
```

### Sample Output

```json
{
  "District": "Thanjavur",
  "Overall Risk Level": "Medium",
  "Dimension Risk Levels": {
    "Credit & Financial Behaviour": "Medium",
    "Income Stability": "Medium",
    "Climate & Agricultural Risk": "High",
    "Socio-Economic Vulnerability": "Low",
    "Infrastructure & Access": "Low",
    "Shock & Event History": "Medium"
  },
  "Key Risk Drivers": [
    "High monsoon variability impacting paddy yields",
    "Rising microfinance penetration with flat repayment trends",
    "Good market access reduces operational collection risk"
  ],
  "Safer Borrower Segments": "Salaried workers in town and diversified farm households with irrigation.",
  "High-Risk Segments": "Small rainfed paddy farmers without irrigation and seasonal labourers.",
  "Lending Strategy Suggestions": {
    "Ticket Size Guidance": "Smaller tickets for rainfed farmers; larger for salaried urban borrowers.",
    "Product Design Notes": "Seasonal EMI schedules; crop-insurance linkage for paddy loans.",
    "Collection & Operations Notes": "Use digital collections for urban pockets; field visits for remote villages."
  }
}
```

## ⚡ Quick Start

### Prerequisites
- Node.js (v16 or higher)
- Google Gemini API key

### Installation & Setup

1. **Install dependencies**
   ```powershell
   npm install
   ```

2. **Set environment variables**
   ```powershell
   # Current session only
   $env:REACT_APP_GEMINI_API_KEY = "your_api_key_here"
   
   # Or persist across sessions
   setx REACT_APP_GEMINI_API_KEY "your_api_key_here"
   ```

3. **Run locally**
   ```powershell
   # For Vite projects
   npm run dev
   
   # For Create React App projects  
   npm start
   ```

4. **Build for production**
   ```powershell
   npm run build
   ```

### Deployment

```powershell
# Install Firebase CLI
npm install -g firebase-tools

# Login and initialize (first time only)
firebase login
firebase init hosting

# Deploy
firebase deploy --only hosting
```

### Testing
```powershell
npm test
```

## 🔬 Interactive Development

Explore the multi-agent system through our Jupyter notebook:

```powershell
# Install notebook dependencies
pip install -r requirements.txt
# or
pip install google-adk google-genai python-dotenv jupyterlab

# Launch Jupyter
jupyter lab
```

Open `notebooks/adk.ipynb` to:
- Experiment with agent instructions
- View intermediate outputs
- Refine risk assessment logic
- Maintain audit trails

## 🎮 Key Features

### Visual Components
- **Risk Radar Chart:** Multi-dimensional risk visualization
- **Geo Map:** Geographical risk distribution
- **Block Heatmap:** Temporal risk patterns
- **Dimension Cards:** Detailed risk factor breakdowns
- **Metric Cards:** Key performance indicators
- **Risk Badges:** Quick risk level identification

### AI-Powered Analysis
- **Parallel Processing:** Six specialist agents running concurrently
- **Structured Outputs:** Consistent JSON schema across all agents
- **Audit Trail:** Complete visibility into agent reasoning
- **Actionable Insights:** Lender-ready risk guidance

## 📈 Benefits

- **Modular:** Easily add/remove specialist agents
- **Auditable:** Transparent dimension-level evidence
- **Scalable:** Parallel agent execution
- **Actionable:** Direct lending strategy recommendations
- **Consistent:** Structured output format

## 🤝 Contributing

1. Create a feature branch
2. Add tests for new functionality
3. Submit a PR with clear description of changes
4. Ensure all tests pass

## 📝 License
