import { User, Portfolio, Asset } from "../../../models/types";
import { getAssetVolatility } from "../../../utils/assetVolatility";
import { IInvestmentRecommendationStrategy } from "./IInvestmentRecommendationStrategy";
export class BasicInvestmentRecommendationStrategy implements IInvestmentRecommendationStrategy {
    generateRecommendations(user: User, portfolio: Portfolio, assets: Asset[]): any[] {
        const recommendations: any[] = [];
        const ownedSymbols = new Set(portfolio.holdings.map(h => h.symbol));

        assets.forEach(asset => {
            if (!ownedSymbols.has(asset.symbol)) {
                let recommendation = "Considera este activo para diversificar tu portafolio";
                let priority = 3; // Prioridad baja por defecto

                // Ajustar recomendación según perfil de riesgo del usuario
                if (user.riskTolerance === "low" && getAssetVolatility(asset.symbol) < 50) {
                    recommendation = "Activo de bajo riesgo recomendado para tu perfil conservador";
                    priority = 1;
                } else if (user.riskTolerance === "high" && getAssetVolatility(asset.symbol) > 60) {
                    recommendation = "Activo de alto crecimiento potencial para tu perfil agresivo";
                    priority = 1;
                } else if (user.riskTolerance === "medium") {
                    recommendation = "Activo balanceado adecuado para tu perfil moderado";
                    priority = 2;
                }

                recommendations.push({
                    symbol: asset.symbol,
                    name: asset.name,
                    currentPrice: asset.currentPrice,
                    recommendation: recommendation,
                    priority: priority,
                    riskLevel: getAssetVolatility(asset.symbol) > 60 ? "high" : "medium",
                });
            }
        });

        return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 5);
    }  
}     