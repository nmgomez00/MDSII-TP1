import { IStrategyFactory } from "./IStrategyFactory";
import { IInvestmentRecommendationStrategy } from "../RecommendationStrategies/IInvestmentRecommendationStrategy";
import { BasicInvestmentRecommendationStrategy } from "../RecommendationStrategies/BasicInvestmentRecommendationStrategy";
import { IPortfolioRiskAnalysisStrategy } from "../RiskStrategies/IPortfolioRiskAnalysisStrategy";
import { BasicRiskCalculationStrategy } from "../RiskStrategies/BasicRiskCalculationStrategy";
import { ITechnicalAnalysisStrategy } from "../TechnicalAnalysisStrategies/ITechnicalAnalysisStrategy";
import { BasicTechnicalAnalysisStrategy } from "../TechnicalAnalysisStrategies/BasicTechnicalAnalysisStrategy";

export class BasicStrategyFactory implements IStrategyFactory {
  createInvestmentRecommendationStrategy(): IInvestmentRecommendationStrategy {
    return new BasicInvestmentRecommendationStrategy();
  }
  createPortfolioRiskAnalysisStrategy(): IPortfolioRiskAnalysisStrategy {
    return new BasicRiskCalculationStrategy();
  }
  createTechnicalAnalysisStrategy(): ITechnicalAnalysisStrategy {
    return new BasicTechnicalAnalysisStrategy();
  }
}