import { Transaction, TransactionType, User } from "../../models/types";
import { storage } from "../../utils/storage";
import { TradeTemplate } from "./TradeTemplate";

export class BuyTrade extends TradeTemplate {
  protected updatePortfolio(
    userId: string,
    symbol: string,
    quantity: number,
    executionPrice: number
  ): void {
    const portfolio = storage.getPortfolioByUserId(userId);
    if (!portfolio) return;

    // Agregar las acciones al portafolio
    portfolio.addHolding(symbol, quantity, executionPrice);

    // Recalcular valores actuales
    this.recalculatePortfolioValues(portfolio);

    storage.updatePortfolio(portfolio);
  }
  protected validateHoldings(user: User, totalCost: number): void {
    // Verificar fondos suficientes
    if (!user.canAfford(totalCost)) {
      throw new Error("Fondos insuficientes");
    }
  }
  protected getTransactionType(): TransactionType {
    return "buy";
  }
  protected updateUserBalance(user: User, totalCost: number): void {
    // Actualizar balance del usuario
    user.deductBalance(totalCost);
    storage.updateUser(user);

  }
}
