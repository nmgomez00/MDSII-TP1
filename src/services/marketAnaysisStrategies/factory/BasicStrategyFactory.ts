import { IStrategyFactory } from "./IStrategyFactory";
import { IInvestmentRecommendationStrategy } from "../RecommendationStrategies/IInvestmentRecommendationStrategy";
import { BasicInvestmentRecommendationStrategy } from "../RecommendationStrategies/BasicInvestmentRecommendationStrategy";
import { IPortfolioRiskAnalysisStrategy } from "../RiskStrategies/IPortfolioRiskAnalysisStrategy";
import { BasicRiskCalculationStrategy } from "../RiskStrategies/BasicRiskCalculationStrategy";

export class BasicStrategyFactory implements IStrategyFactory {
  createInvestmentRecommendationStrategy(): IInvestmentRecommendationStrategy {
    return new BasicInvestmentRecommendationStrategy();
  }
  createPortfolioRiskAnalysisStrategy(): IPortfolioRiskAnalysisStrategy {
    return new BasicRiskCalculationStrategy();
  }
}