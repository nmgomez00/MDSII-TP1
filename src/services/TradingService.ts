// Servicios de trading
import {
  Transaction,
  Order,
  Asset,
  User,
  Portfolio,
  PortfolioHolding,
} from "../models/types";
import { storage } from "../utils/storage";
import { config } from "../config/config";

export class TradingService {
  // Ejecutar orden de compra al precio de mercado
  async executeBuyOrder(
    userId: string,
    symbol: string,
    quantity: number
  ): Promise<Transaction> {
    // Obtener usuario
    const user = storage.getUserById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Obtener activo
    const asset = storage.getAssetBySymbol(symbol);
    if (!asset) {
      throw new Error("Activo no encontrado");
    }

    // El precio de ejecución es siempre el precio actual de mercado
    const executionPrice = asset.currentPrice;

    // Calcular costo total incluyendo comisiones
    const grossAmount = quantity * executionPrice;
    const fees = this.calculateFees(grossAmount, "buy");
    const totalCost = grossAmount + fees;

    // Verificar fondos suficientes
    if (!user.canAfford(totalCost)) {
      throw new Error("Fondos insuficientes");
    }

    // Crear transacción
    const transactionId = this.generateTransactionId();
    const transaction = new Transaction(
      transactionId,
      userId,
      "buy",
      symbol,
      quantity,
      executionPrice,
      fees
    );

    // Completar la transacción
    transaction.complete();

    // Actualizar balance del usuario
    user.deductBalance(totalCost);
    storage.updateUser(user);

    // Actualizar portafolio
    this.updatePortfolioAfterBuy(userId, symbol, quantity, executionPrice);

    // Guardar transacción
    storage.addTransaction(transaction);

    // Simular volatilidad del mercado después de la operación
    this.simulateMarketImpact(symbol, quantity, "buy");

    return transaction;
  }

  // Ejecutar orden de venta al precio de mercado
  async executeSellOrder(
    userId: string,
    symbol: string,
    quantity: number
  ): Promise<Transaction> {
    // Obtener usuario
    const user = storage.getUserById(userId);
    if (!user) {
      throw new Error("Usuario no encontrado");
    }

    // Obtener activo
    const asset = storage.getAssetBySymbol(symbol);
    if (!asset) {
      throw new Error("Activo no encontrado");
    }

    // Verificar holdings suficientes
    const portfolio = storage.getPortfolioByUserId(userId);
    if (!portfolio) {
      throw new Error("Portafolio no encontrado");
    }

    const holding = portfolio.holdings.find((h) => h.symbol === symbol);
    if (!holding || holding.quantity < quantity) {
      throw new Error("No tienes suficientes activos para vender");
    }

    // El precio de ejecución es siempre el precio actual de mercado
    const executionPrice = asset.currentPrice;

    // Calcular beneficio bruto y comisiones
    const grossAmount = quantity * executionPrice;
    const fees = this.calculateFees(grossAmount, "sell");
    const netAmount = grossAmount - fees;

    // Crear transacción
    const transactionId = this.generateTransactionId();
    const transaction = new Transaction(
      transactionId,
      userId,
      "sell",
      symbol,
      quantity,
      executionPrice,
      fees
    );

    // Completar la transacción
    transaction.complete();

    // Actualizar balance del usuario
    user.addBalance(netAmount);
    storage.updateUser(user);

    // Actualizar portafolio
    this.updatePortfolioAfterSell(userId, symbol, quantity, executionPrice);

    // Guardar transacción
    storage.addTransaction(transaction);

    // Simular volatilidad del mercado después de la operación
    this.simulateMarketImpact(symbol, quantity, "sell");

    return transaction;
  }

  // Cálculo de comisiones
  private calculateFees(amount: number, type: "buy" | "sell"): number {
    const feePercentage =
      type === "buy"
        ? config.tradingFees.buyFeePercentage
        : config.tradingFees.sellFeePercentage;
    const calculatedFee = amount * feePercentage;
    return Math.max(calculatedFee, config.tradingFees.minimumFee);
  }

  // Actualizar portafolio después de compra
  private updatePortfolioAfterBuy(
    userId: string,
    symbol: string,
    quantity: number,
    price: number
  ): void {
    const portfolio = storage.getPortfolioByUserId(userId);
    if (!portfolio) return;

    // Agregar las acciones al portafolio
    portfolio.addHolding(symbol, quantity, price);

    // Recalcular valores actuales
    this.recalculatePortfolioValues(portfolio);

    storage.updatePortfolio(portfolio);
  }

  // Actualizar portafolio después de venta
  private updatePortfolioAfterSell(
    userId: string,
    symbol: string,
    quantity: number,
    price: number
  ): void {
    const portfolio = storage.getPortfolioByUserId(userId);
    if (!portfolio) return;

    // Remover las acciones del portafolio
    portfolio.removeHolding(symbol, quantity);

    // Recalcular valores actuales
    this.recalculatePortfolioValues(portfolio);

    storage.updatePortfolio(portfolio);
  }

  // Recalcular valores del portafolio
  private recalculatePortfolioValues(portfolio: Portfolio): void {
    // Actualizar el valor actual de cada holding
    portfolio.holdings.forEach((holding) => {
      const asset = storage.getAssetBySymbol(holding.symbol);
      if (asset) {
        holding.updateCurrentValue(asset.currentPrice);
      }
    });

    // Calcular totales del portafolio
    portfolio.calculateTotals();
  }

  // Simulación de impacto en el mercado después de una operación
  private simulateMarketImpact(
    symbol: string,
    quantity: number,
    action: "buy" | "sell"
  ): void {
    const marketData = storage.getMarketDataBySymbol(symbol);
    if (!marketData) return;

    // Calcular impacto basado en volumen
    const impactFactor = quantity / 1000000; // Factor arbitrario
    const priceImpact = marketData.price * impactFactor * 0.001;

    const newPrice =
      action === "buy"
        ? marketData.price + priceImpact
        : marketData.price - priceImpact;

    const change = newPrice - marketData.price;
    const changePercent = (change / marketData.price) * 100;

    marketData.price = newPrice;
    marketData.change = change;
    marketData.changePercent = changePercent;
    marketData.timestamp = new Date();

    // Actualizar asset también
    const asset = storage.getAssetBySymbol(symbol);
    if (asset) {
      asset.currentPrice = newPrice;
      asset.lastUpdated = new Date();
      storage.updateAsset(asset);
    }

    storage.updateMarketData(marketData);
  }

  // Generar ID único para transacciones
  private generateTransactionId(): string {
    return "txn_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }

  // Obtener historial de transacciones
  getTransactionHistory(userId: string): Transaction[] {
    return storage.getTransactionsByUserId(userId);
  }
}
