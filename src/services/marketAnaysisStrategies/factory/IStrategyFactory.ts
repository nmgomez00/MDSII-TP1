import { IInvestmentRecommendationStrategy } from "../RecommendationStrategies/IInvestmentRecommendationStrategy";
import { IPortfolioRiskAnalysisStrategy } from "../RiskStrategies/IPortfolioRiskAnalysisStrategy";
export interface IStrategyFactory{
    createInvestmentRecommendationStrategy(): IInvestmentRecommendationStrategy;
    createPortfolioRiskAnalysisStrategy(): IPortfolioRiskAnalysisStrategy;
}