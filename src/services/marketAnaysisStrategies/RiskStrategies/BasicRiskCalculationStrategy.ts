import {
    IPortfolioRiskAnalysisStrategy
} from './IPortfolioRiskAnalysisStrategy';

import { RiskLevel } from '../../../models/types';
export class BasicRiskCalculationStrategy implements IPortfolioRiskAnalysisStrategy {
    analyzeRisk(diversificationScore: number, volatilityScore: number): RiskLevel {
    let portfolioRisk: RiskLevel;
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