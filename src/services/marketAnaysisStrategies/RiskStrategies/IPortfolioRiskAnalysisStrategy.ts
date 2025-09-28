import { RiskLevel } from "../../../models/types"; 
export interface IPortfolioRiskAnalysisStrategy {
    analyzeRisk(diversificationScore: number, volatilityScore: number): RiskLevel;
}