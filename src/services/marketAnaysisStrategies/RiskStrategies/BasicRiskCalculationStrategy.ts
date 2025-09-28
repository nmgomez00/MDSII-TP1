import {
    IPortfolioRiskAnalysisStrategy, PortfolioRiskLevel
} from './IPortfolioRiskAnalysisStrategy';

export class BasicRiskCalculationStrategy implements IPortfolioRiskAnalysisStrategy {
    analyzeRisk(diversificationScore: number, volatilityScore: number): PortfolioRiskLevel {
    let portfolioRisk: PortfolioRiskLevel;
    if (volatilityScore < 30 && diversificationScore > 70) {
      portfolioRisk = "low";
    } else if (volatilityScore < 60 && diversificationScore > 40) {
      portfolioRisk = "medium";
    } else {
      portfolioRisk = "high";
    }
    return portfolioRisk;
    }
}