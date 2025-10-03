import { Transaction, TransactionType, User } from "../../models/types";
import { storage } from "../../utils/storage";
import { TradeTemplate } from "./TradeTemplate";

export class SellTrade extends TradeTemplate {
  protected updatePortfolio(
    userId: string,
    symbol: string,
    quantity: number
  ): void {
    const portfolio = storage.getPortfolioByUserId(userId);
    if (!portfolio) return;

    // Remover las acciones del portafolio
    portfolio.removeHolding(symbol, quantity);

    // Recalcular valores actuales
    this.recalculatePortfolioValues(portfolio);

    storage.updatePortfolio(portfolio);
  }
  protected validateHoldings(
    user: User,
    totalCost: number,
    quantity: number,
    symbol: string
  ): void {
    // Verificar holdings suficientes
    const portfolio = storage.getPortfolioByUserId(user.id);
    if (!portfolio) {
      throw new Error("Portafolio no encontrado");
    }

    const holding = portfolio.holdings.find((h) => h.symbol === symbol);
    if (!holding || holding.quantity < quantity) {
      throw new Error("No tienes suficientes activos para vender");
    }
  }
  protected getTransactionType(): TransactionType {
    return "sell";
  }
  protected updateUserBalance(user: User, totalCost: number): void {
    // Actualizar balance del usuario
    user.addBalance(totalCost);
    storage.updateUser(user);
  }
}
