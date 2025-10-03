import { storage } from "../../../utils/storage";
import { ITechnicalAnalysisStrategy } from "./ITechnicalAnalysisStrategy";

export class BasicTechnicalAnalysisStrategy implements ITechnicalAnalysisStrategy {
    analyze(symbol: string): any {
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
    symbol: string
    , period: number
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
}