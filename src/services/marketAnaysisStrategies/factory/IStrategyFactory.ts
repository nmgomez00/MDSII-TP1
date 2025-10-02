import { IInvestmentRecommendationStrategy } from "../RecommendationStrategies/IInvestmentRecommendationStrategy";
import { IPortfolioRiskAnalysisStrategy } from "../RiskStrategies/IPortfolioRiskAnalysisStrategy";
import { ITechnicalAnalysisStrategy } from "../TechnicalAnalysisStrategies/ITechnicalAnalysisStrategy";
export interface IStrategyFactory{
    createInvestmentRecommendationStrategy(): IInvestmentRecommendationStrategy;
    createPortfolioRiskAnalysisStrategy(): IPortfolioRiskAnalysisStrategy;
    createTechnicalAnalysisStrategy(): ITechnicalAnalysisStrategy;
}