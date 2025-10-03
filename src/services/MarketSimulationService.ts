// Servicio de simulación de mercado
import { MarketData, Asset, MarketEventType } from "../models/types";
import { storage } from "../utils/storage";
import { config } from "../config/config";
import { IMarketSimulationSubscriber } from "./MarketSimulationSubscribers/IMarketSimulationSubscriber";

export class MarketSimulationService {
  // Instancia singleton
  private static instance: MarketSimulationService;
  //subscriptores
  private subscribers: IMarketSimulationSubscriber[] = [];
  // Estado de la simulación
  private isRunning: boolean = false;
  private intervalId: NodeJS.Timeout | null = null;

  private constructor() {}

  // aplicamos el patrón singleton
  public static getInstance(): MarketSimulationService {
    if (!MarketSimulationService.instance) {
      MarketSimulationService.instance = new MarketSimulationService();
    }
    return MarketSimulationService.instance;
  }
  // Suscribir un nuevo subscriber
  subscribe(subscriber: IMarketSimulationSubscriber): void {
    this.subscribers.push(subscriber);
  }

  // Desuscribir un subscriber
  unsubscribe(subscriber: IMarketSimulationSubscriber): void {
    this.subscribers = this.subscribers.filter((sub) => sub !== subscriber);
  }
  // Notificar a todos los subscribers
  notifySubscribers(): void {
    this.subscribers.forEach((subscriber) => subscriber.update());
  }
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
      this.updateAssetPrice(marketData);
    });
    this.notifySubscribers();
  }

  // Simular evento de mercado específico
  simulateMarketEvent(eventType: MarketEventType): void {
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
      this.updateAssetPrice(marketData);
    });
    this.notifySubscribers();
  }

  private updateAssetPrice(marketData: MarketData): void {
    // Actualizar asset correspondiente
      const asset = storage.getAssetBySymbol(marketData.symbol);
      if (asset) {
        asset.currentPrice = marketData.price || asset.currentPrice;
        asset.lastUpdated = new Date();
        storage.updateAsset(asset);
      }
  }
  // Obtener estado de simulación
  getSimulationStatus(): { isRunning: boolean; lastUpdate: Date | null } {
    return {
      isRunning: this.isRunning,
      lastUpdate: this.isRunning ? new Date() : null,
    };
  }
}
