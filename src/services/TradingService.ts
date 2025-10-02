// Servicios de trading
import {
  Transaction
} from "../models/types";
import { storage } from "../utils/storage";
import { BuyTrade } from "./TradingStrategies/BuyTrade";
import { sellTrade } from "./TradingStrategies/sellTrade";

export class TradingService {
  private buyTrade: BuyTrade;
  private sellTrade: sellTrade;

  constructor() {
    this.buyTrade = new BuyTrade();
    this.sellTrade = new sellTrade();
  }
  // Ejecutar orden de compra al precio de mercado
  async executeBuyOrder(
    userId: string,
    symbol: string,
    quantity: number
  ): Promise<Transaction> {
    return await this.buyTrade.executeTrade(userId, symbol, quantity);
  }

  // Ejecutar orden de venta al precio de mercado
  async executeSellOrder(
    userId: string,
    symbol: string,
    quantity: number
  ): Promise<Transaction> {
    return await this.sellTrade.executeTrade(userId, symbol, quantity);
  }

  
  // Obtener historial de transacciones
  getTransactionHistory(userId: string): Transaction[] {
    return storage.getTransactionsByUserId(userId);
  }
}
