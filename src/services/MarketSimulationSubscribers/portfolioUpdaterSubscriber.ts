import { storage } from "../../utils/storage";
import { IMarketSimulationSubscriber } from "./IMarketSimulationSubscriber";

export class PortfolioUpdaterSubscriber implements IMarketSimulationSubscriber {
    update(): void {
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
}