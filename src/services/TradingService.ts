// Servicios de trading
import {
  Transaction
} from "../models/types";
import { storage } from "../utils/storage";
import { BuyTrade } from "./TradingStrategies/BuyTrade";
import { SellTrade } from "./TradingStrategies/sellTrade";
import { TradeTemplate } from "./TradingStrategies/TradeTemplate";

export class TradingService {
  private buyTrade: TradeTemplate;
  private sellTrade: TradeTemplate;

  constructor(buyTrade?: TradeTemplate, sellTrade?: TradeTemplate) {
    // si no se pasan estrategias de trading se usan las por defecto
    this.buyTrade = buyTrade ||new BuyTrade();
    this.sellTrade = sellTrade || new SellTrade();
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
