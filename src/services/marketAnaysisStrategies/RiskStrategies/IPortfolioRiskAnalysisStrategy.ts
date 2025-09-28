export  type PortfolioRiskLevel = "low" | "medium" | "high";    
export interface IPortfolioRiskAnalysisStrategy {
    analyzeRisk(diversificationScore: number, volatilityScore: number): PortfolioRiskLevel;
}