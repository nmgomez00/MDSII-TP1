import { User, Portfolio, Asset } from "../../../models/types";
export interface IInvestmentRecommendationStrategy {
    generateRecommendations(user: User, portfolio: Portfolio, assets: Asset[]): any[];}