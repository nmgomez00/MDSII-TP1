// Servicio de análisis de mercado
import { MarketData, Asset, Portfolio, RiskAnalysis } from "../models/types";
import { storage } from "../utils/storage";
import { getAssetVolatility } from "../utils/assetVolatility";
import { IPortfolioRiskAnalysisStrategy } from "./marketAnaysisStrategies/RiskStrategies/IPortfolioRiskAnalysisStrategy";
import { RiskLevel } from "../models/types"; 
import { IInvestmentRecommendationStrategy } from "./marketAnaysisStrategies/RecommendationStrategies/IInvestmentRecommendationStrategy";
import { IStrategyFactory } from "./marketAnaysisStrategies/factory/IStrategyFactory";
import { BasicStrategyFactory } from "./marketAnaysisStrategies/factory/BasicStrategyFactory";
import { ITechnicalAnalysisStrategy } from "./marketAnaysisStrategies/TechnicalAnalysisStrategies/ITechnicalAnalysisStrategy";

export class MarketAnalysisService {
  // Estrategia de análisis de riesgo
  private riskStrategy: IPortfolioRiskAnalysisStrategy;
  // Estrategia de recomendación de inversión
  private recommendationStrategy: IInvestmentRecommendationStrategy;
  // Estrategia de análisis técnico
  private technicalAnalysisStrategy: ITechnicalAnalysisStrategy;
  // factory de estrategias
  private strategyFactory: IStrategyFactory;

  constructor(strategyFactory?: IStrategyFactory) {
    // Usar la fábrica proporcionada o la básica por defecto
    this.strategyFactory = strategyFactory || new BasicStrategyFactory();
    // Crear estrategias usando la fábrica
    this.riskStrategy = this.strategyFactory.createPortfolioRiskAnalysisStrategy();
    this.recommendationStrategy = this.strategyFactory.createInvestmentRecommendationStrategy();
    this.technicalAnalysisStrategy = this.strategyFactory.createTechnicalAnalysisStrategy();
  }
  //cambiar la factory de strategies en runtime
  setStrategyFactory(factory: IStrategyFactory) {
    this.strategyFactory = factory;
    this.riskStrategy = this.strategyFactory.createPortfolioRiskAnalysisStrategy();
    this.recommendationStrategy = this.strategyFactory.createInvestmentRecommendationStrategy();
    this.technicalAnalysisStrategy = this.strategyFactory.createTechnicalAnalysisStrategy();
  }

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
    let portfolioRisk: RiskLevel = this.riskStrategy.analyzeRisk(
      diversificationScore,
      volatilityScore
    );
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
      const assetVolatility = getAssetVolatility(holding.symbol);
      weightedVolatility += weight * assetVolatility;
    });

    return Math.min(weightedVolatility, 100);
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
    return this.technicalAnalysisStrategy.analyze(symbol);
  }

  // Generar recomendaciones de inversión - Lógica básica
  generateInvestmentRecommendations(userId: string): any[] {
    const user = storage.getUserById(userId);
    const portfolio = storage.getPortfolioByUserId(userId);

    if (!user || !portfolio) {
      throw new Error("Usuario o portafolio no encontrado");
    }

    const allAssets = storage.getAllAssets();

    // Usar la estrategia de recomendación configurada
    return this.recommendationStrategy.generateRecommendations(
      user,
      portfolio,
      allAssets
    );
  }
}
