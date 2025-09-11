// Servicio de simulación de mercado
import { MarketData, Asset } from "../models/types";
import { storage } from "../utils/storage";
import { config } from "../config/config";

export class MarketSimulationService {
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  // Iniciar simulación de mercado
  startMarketSimulation(): void {
    if (this.isRunning) {
      console.log("La simulación de mercado ya está ejecutándose");
      return;
    }

    this.isRunning = true;
    console.log("Iniciando simulación de mercado...");

    this.intervalId = setInterval(() => {
      this.updateMarketPrices();
    }, config.market.updateIntervalMs);
  }

  // Detener simulación de mercado
  stopMarketSimulation(): void {
    if (!this.isRunning) {
      console.log("La simulación de mercado no está ejecutándose");
      return;
    }

    this.isRunning = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    console.log("Simulación de mercado detenida");
  }

  // Actualizar precios de mercado
  private updateMarketPrices(): void {
    const allMarketData = storage.getAllMarketData();

    allMarketData.forEach((marketData) => {
      // Generar cambio aleatorio de precio
      const randomChange = (Math.random() - 0.5) * 2; // -1 a +1
      const volatilityFactor = config.market.volatilityFactor;
      const priceChange = marketData.price * randomChange * volatilityFactor;

      const newPrice = Math.max(marketData.price + priceChange, 0.01); // Evitar precios negativos
      const change = newPrice - marketData.price;
      const changePercent = (change / marketData.price) * 100;

      // Actualizar datos de mercado
      marketData.price = newPrice;
      marketData.change = change;
      marketData.changePercent = changePercent;
      marketData.volume += Math.floor(Math.random() * 10000); // Simular volumen
      marketData.timestamp = new Date();

      storage.updateMarketData(marketData);

      // Actualizar asset correspondiente
      const asset = storage.getAssetBySymbol(marketData.symbol);
      if (asset) {
        asset.currentPrice = newPrice;
        asset.lastUpdated = new Date();
        storage.updateAsset(asset);
      }
    });

    // Actualizar valores de portafolios
    this.updateAllPortfolioValues();
  }

  // Actualizar todos los portafolios
  private updateAllPortfolioValues(): void {
    // Obtener todos los usuarios y actualizar sus portafolios
    const allUsers = [
      storage.getUserById("demo_user"),
      storage.getUserById("admin_user"),
      storage.getUserById("trader_user"),
    ].filter((user) => user !== undefined);

    allUsers.forEach((user) => {
      if (user) {
        const portfolio = storage.getPortfolioByUserId(user.id);
        if (portfolio && portfolio.holdings.length > 0) {
          this.recalculatePortfolioValues(portfolio);
          storage.updatePortfolio(portfolio);
        }
      }
    });
  }

  // Recalcular valores del portafolio
  private recalculatePortfolioValues(portfolio: any): void {
    let totalValue = 0;
    let totalInvested = 0;

    portfolio.holdings.forEach((holding: any) => {
      const asset = storage.getAssetBySymbol(holding.symbol);
      if (asset) {
        holding.currentValue = holding.quantity * asset.currentPrice;
        const invested = holding.quantity * holding.averagePrice;
        holding.totalReturn = holding.currentValue - invested;
        holding.percentageReturn =
          invested > 0 ? (holding.totalReturn / invested) * 100 : 0;

        totalValue += holding.currentValue;
        totalInvested += invested;
      }
    });

    portfolio.totalValue = totalValue;
    portfolio.totalInvested = totalInvested;
    portfolio.totalReturn = totalValue - totalInvested;
    portfolio.percentageReturn =
      totalInvested > 0 ? (portfolio.totalReturn / totalInvested) * 100 : 0;
    portfolio.lastUpdated = new Date();
  }

  // Simular evento de mercado específico
  simulateMarketEvent(eventType: "bull" | "bear" | "crash" | "recovery"): void {
    console.log(`Simulando evento de mercado: ${eventType}`);

    const allMarketData = storage.getAllMarketData();

    allMarketData.forEach((marketData) => {
      let impactFactor = 0;

      switch (eventType) {
        case "bull":
          impactFactor = 0.05 + Math.random() * 0.1; // +5% a +15%
          break;
        case "bear":
          impactFactor = -(0.05 + Math.random() * 0.1); // -5% a -15%
          break;
        case "crash":
          impactFactor = -(0.15 + Math.random() * 0.2); // -15% a -35%
          break;
        case "recovery":
          impactFactor = 0.1 + Math.random() * 0.15; // +10% a +25%
          break;
      }

      const priceChange = marketData.price * impactFactor;
      const newPrice = Math.max(marketData.price + priceChange, 0.01);
      const change = newPrice - marketData.price;
      const changePercent = (change / marketData.price) * 100;

      marketData.price = newPrice;
      marketData.change = change;
      marketData.changePercent = changePercent;
      marketData.timestamp = new Date();

      storage.updateMarketData(marketData);

      // Actualizar asset
      const asset = storage.getAssetBySymbol(marketData.symbol);
      if (asset) {
        asset.currentPrice = newPrice;
        asset.lastUpdated = new Date();
        storage.updateAsset(asset);
      }
    });

    // Actualizar portafolios
    this.updateAllPortfolioValues();
  }

  // Obtener estado de simulación
  getSimulationStatus(): { isRunning: boolean; lastUpdate: Date | null } {
    return {
      isRunning: this.isRunning,
      lastUpdate: this.isRunning ? new Date() : null,
    };
  }
}
