import {
  Transaction,
  User,
  Asset,
  Portfolio,
  TransactionType,
} from "../../models/types";
import { config } from "../../config/config";

import { storage } from "../../utils/storage";
import { get } from "http";

export abstract class TradeTemplate {
  // Método plantilla para ejecutar una transacción
  public async executeTrade(
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
    const fees = this.calculateFees(grossAmount, this.getTransactionType());
    const totalCost = grossAmount + fees;

    // Verificar fondos o activos suficientes
    this.validateHoldings(user, totalCost, quantity, symbol);

    // Crear transacción
    const transactionId = this.generateTransactionId();
    const transaction = new Transaction(
      transactionId,
      userId,
      this.getTransactionType(),
      symbol,
      quantity,
      executionPrice,
      fees
    );

    // Completar la transacción
    transaction.complete();

    // Actualizar balance del usuario
    this.updateUserBalance(user, totalCost);

    // Actualizar portafolio del usuario
    this.updatePortfolio(userId, symbol, quantity, executionPrice);

    //guardar transaccion
    storage.addTransaction(transaction);

    //simular volatilidad del mercado después de la operación
    this.simulateMarketImpact(symbol, quantity, transaction.type);

    return transaction;
  }

  // validar fondos suficientes
  protected abstract validateHoldings(
    user: User,
    totalCost?: number,
    quantity?: number,
    symbol?: string
  ): void;
  // Actualizar balance del usuario
  protected abstract updateUserBalance(user: User, totalCost: number): void;
  protected abstract getTransactionType(): TransactionType;

  // Actualizar portafolio del usuario
  protected abstract updatePortfolio(
    userID: string,
    symbol: string,
    quantity: number,
    executionPrice?: number
  ): void;

  // Generar ID único para transacciones
  protected generateTransactionId(): string {
    return "txn_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
  }
  // Calcular comisiones
  protected calculateFees(amount: number, type: TransactionType): number {
    const feePercentage =
      type === "buy"
        ? config.tradingFees.buyFeePercentage
        : config.tradingFees.sellFeePercentage;
    const calculatedFee = amount * feePercentage;
    return Math.max(calculatedFee, config.tradingFees.minimumFee);
  }
  // Simular impacto en el mercado después de la operación
  protected simulateMarketImpact(
    symbol: string,
    quantity: number,
    action: TransactionType
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
  // Recalcular valores del portafolio
  protected recalculatePortfolioValues(portfolio: Portfolio): void {
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
}
