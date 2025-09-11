// Servicio de análisis de mercado
import { MarketData, Asset, Portfolio, RiskAnalysis } from "../models/types";
import { storage } from "../utils/storage";

export class MarketAnalysisService {
  // Análisis de riesgo del portafolio
  analyzePortfolioRisk(userId: string): RiskAnalysis {
    const portfolio = storage.getPortfolioByUserId(userId);
    if (!portfolio) {
      throw new Error("Portafolio no encontrado");
    }

    // Cálculo básico de diversificación
    const diversificationScore = this.calculateDiversificationScore(portfolio);

    // Cálculo básico de volatilidad
    const volatilityScore = this.calculateVolatilityScore(portfolio);

    // Determinar nivel de riesgo general
    let portfolioRisk: "low" | "medium" | "high";
    if (volatilityScore < 30 && diversificationScore > 70) {
      portfolioRisk = "low";
    } else if (volatilityScore < 60 && diversificationScore > 40) {
      portfolioRisk = "medium";
    } else {
      portfolioRisk = "high";
    }

    // Generar recomendaciones básicas
    const recommendations = this.generateRiskRecommendations(
      diversificationScore,
      volatilityScore,
      portfolioRisk
    );

    const riskAnalysis = new RiskAnalysis(userId);
    riskAnalysis.updateRisk(
      portfolioRisk,
      diversificationScore,
      recommendations
    );

    return riskAnalysis;
  }

  // Calcular score de diversificación - Algoritmo simplificado
  private calculateDiversificationScore(portfolio: Portfolio): number {
    if (portfolio.holdings.length === 0) return 0;

    // Contar sectores únicos
    const sectors = new Set<string>();
    portfolio.holdings.forEach((holding) => {
      const asset = storage.getAssetBySymbol(holding.symbol);
      if (asset) {
        sectors.add(asset.sector);
      }
    });

    // Score basado en número de sectores y distribución
    const sectorCount = sectors.size;
    const maxSectors = 5; // Número máximo de sectores considerados
    const sectorScore = Math.min(sectorCount / maxSectors, 1) * 50;

    // Score basado en distribución de pesos
    const totalValue = portfolio.totalValue;
    let concentrationPenalty = 0;

    portfolio.holdings.forEach((holding) => {
      const weight = holding.currentValue / totalValue;
      if (weight > 0.3) {
        // Penalizar concentraciones > 30%
        concentrationPenalty += (weight - 0.3) * 100;
      }
    });

    const distributionScore = Math.max(50 - concentrationPenalty, 0);

    return Math.min(sectorScore + distributionScore, 100);
  }

  // Calcular score de volatilidad - Algoritmo básico
  private calculateVolatilityScore(portfolio: Portfolio): number {
    if (portfolio.holdings.length === 0) return 0;

    let weightedVolatility = 0;
    const totalValue = portfolio.totalValue;

    portfolio.holdings.forEach((holding) => {
      const weight = holding.currentValue / totalValue;
      const assetVolatility = this.getAssetVolatility(holding.symbol);
      weightedVolatility += weight * assetVolatility;
    });

    return Math.min(weightedVolatility, 100);
  }

  // Obtener volatilidad de un activo - Datos simulados
  private getAssetVolatility(symbol: string): number {
    // Simulación básica de volatilidad por sector
    const asset = storage.getAssetBySymbol(symbol);
    if (!asset) return 50; // Volatilidad por defecto

    const volatilityBySector: { [key: string]: number } = {
      Technology: 65,
      Healthcare: 45,
      Financial: 55,
      Automotive: 70,
      "E-commerce": 60,
    };

    return volatilityBySector[asset.sector] || 50;
  }

  // Generar recomendaciones
  private generateRiskRecommendations(
    diversificationScore: number,
    volatilityScore: number,
    riskLevel: string
  ): string[] {
    const recommendations: string[] = [];

    if (diversificationScore < 40) {
      recommendations.push(
        "Considera diversificar tu portafolio invirtiendo en diferentes sectores"
      );
    }

    if (volatilityScore > 70) {
      recommendations.push(
        "Tu portafolio tiene alta volatilidad, considera añadir activos más estables"
      );
    }

    if (riskLevel === "high") {
      recommendations.push(
        "Nivel de riesgo alto detectado, revisa tu estrategia de inversión"
      );
    }

    if (diversificationScore > 80 && volatilityScore < 30) {
      recommendations.push(
        "Excelente diversificación y bajo riesgo, mantén esta estrategia"
      );
    }

    // Recomendaciones genéricas si no hay específicas
    if (recommendations.length === 0) {
      recommendations.push(
        "Tu portafolio se ve balanceado, continúa monitoreando regularmente"
      );
    }

    return recommendations;
  }

  // Análisis técnico básico
  performTechnicalAnalysis(symbol: string): any {
    const marketData = storage.getMarketDataBySymbol(symbol);
    if (!marketData) {
      throw new Error("Datos de mercado no encontrados");
    }

    // Simulación de indicadores técnicos básicos
    const sma20 = this.calculateSimpleMovingAverage(symbol, 20);
    const sma50 = this.calculateSimpleMovingAverage(symbol, 50);
    const rsi = this.calculateRSI(symbol);

    let signal: "buy" | "sell" | "hold" = "hold";

    // Lógica simple de señales
    if (marketData.price > sma20 && sma20 > sma50 && rsi < 70) {
      signal = "buy";
    } else if (marketData.price < sma20 && sma20 < sma50 && rsi > 30) {
      signal = "sell";
    }

    return {
      symbol: symbol,
      currentPrice: marketData.price,
      sma20: sma20,
      sma50: sma50,
      rsi: rsi,
      signal: signal,
      timestamp: new Date(),
    };
  }

  // Calcular SMA - Simulación básica
  private calculateSimpleMovingAverage(
    symbol: string,
    periods: number
  ): number {
    const marketData = storage.getMarketDataBySymbol(symbol);
    if (!marketData) return 0;

    // Simulación: SMA = precio actual +/- variación aleatoria
    const randomVariation = (Math.random() - 0.5) * 0.1; // +/- 5%
    return marketData.price * (1 + randomVariation);
  }

  // Calcular RSI - Simulación básica
  private calculateRSI(symbol: string): number {
    // Simulación: RSI aleatorio entre 20 y 80
    return 20 + Math.random() * 60;
  }

  // Generar recomendaciones de inversión - Lógica básica
  generateInvestmentRecommendations(userId: string): any[] {
    const user = storage.getUserById(userId);
    const portfolio = storage.getPortfolioByUserId(userId);

    if (!user || !portfolio) {
      throw new Error("Usuario o portafolio no encontrado");
    }

    const recommendations: any[] = [];

    // Recomendaciones basadas en tolerancia al riesgo
    const allAssets = storage.getAllAssets();

    allAssets.forEach((asset) => {
      const hasHolding = portfolio.holdings.some(
        (h) => h.symbol === asset.symbol
      );

      if (!hasHolding) {
        let recommendation = "";
        let priority = 0;

        if (
          user.riskTolerance === "low" &&
          this.getAssetVolatility(asset.symbol) < 50
        ) {
          recommendation =
            "Activo de bajo riesgo recomendado para tu perfil conservador";
          priority = 1;
        } else if (
          user.riskTolerance === "high" &&
          this.getAssetVolatility(asset.symbol) > 60
        ) {
          recommendation =
            "Activo de alto crecimiento potencial para tu perfil agresivo";
          priority = 2;
        } else if (user.riskTolerance === "medium") {
          recommendation = "Activo balanceado adecuado para tu perfil moderado";
          priority = 1;
        }

        if (recommendation) {
          recommendations.push({
            symbol: asset.symbol,
            name: asset.name,
            currentPrice: asset.currentPrice,
            recommendation: recommendation,
            priority: priority,
            riskLevel:
              this.getAssetVolatility(asset.symbol) > 60 ? "high" : "medium",
          });
        }
      }
    });

    // Ordenar por prioridad
    return recommendations.sort((a, b) => b.priority - a.priority).slice(0, 5);
  }
}
