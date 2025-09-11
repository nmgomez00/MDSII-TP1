// Almacenamiento en memoria
import {
  User,
  Asset,
  Transaction,
  Order,
  Portfolio,
  MarketData,
} from "../models/types";
import { config } from "../config/config";

// Base de datos simulada en memoria (se pierde al reiniciar)
class InMemoryStorage {
  private users: Map<string, User> = new Map();
  private assets: Map<string, Asset> = new Map();
  private transactions: Transaction[] = [];
  private orders: Order[] = [];
  private portfolios: Map<string, Portfolio> = new Map();
  private marketData: Map<string, MarketData> = new Map();

  constructor() {
    this.initializeDefaultData();
  }

  // Inicializar datos por defecto
  private initializeDefaultData() {
    // Usuarios por defecto
    const defaultUsers: User[] = [
      new User(
        "demo_user",
        "demo_user",
        "demo@example.com",
        "demo-key-123",
        10000.0,
        "medium"
      ),
      new User(
        "admin_user",
        "admin_user",
        "admin@example.com",
        "admin-key-456",
        50000.0,
        "high"
      ),
      new User(
        "trader_user",
        "trader_user",
        "trader@example.com",
        "trader-key-789",
        25000.0,
        "low"
      ),
    ];

    defaultUsers.forEach((user) => this.users.set(user.id, user));

    // Activos por defecto
    config.market.baseAssets.forEach((baseAsset) => {
      const asset = new Asset(
        baseAsset.symbol,
        baseAsset.name,
        baseAsset.basePrice,
        baseAsset.sector
      );
      this.assets.set(baseAsset.symbol, asset);

      // Datos de mercado iniciales
      const marketData = new MarketData(baseAsset.symbol, baseAsset.basePrice);
      this.marketData.set(baseAsset.symbol, marketData);
    });

    // Portafolios iniciales vacíos
    defaultUsers.forEach((user) => {
      const portfolio = new Portfolio(user.id);
      this.portfolios.set(user.id, portfolio);
    });
  }

  // Métodos para usuarios
  getUserByApiKey(apiKey: string): User | undefined {
    return Array.from(this.users.values()).find(
      (user) => user.apiKey === apiKey
    );
  }

  getUserById(id: string): User | undefined {
    return this.users.get(id);
  }

  updateUser(user: User): void {
    this.users.set(user.id, user);
  }

  // Métodos para activos
  getAllAssets(): Asset[] {
    return Array.from(this.assets.values());
  }

  getAssetBySymbol(symbol: string): Asset | undefined {
    return this.assets.get(symbol);
  }

  updateAsset(asset: Asset): void {
    this.assets.set(asset.symbol, asset);
  }

  // Métodos para transacciones
  addTransaction(transaction: Transaction): void {
    this.transactions.push(transaction);
  }

  getTransactionsByUserId(userId: string): Transaction[] {
    return this.transactions.filter((t) => t.userId === userId);
  }

  getAllTransactions(): Transaction[] {
    return [...this.transactions];
  }

  // Métodos para órdenes
  addOrder(order: Order): void {
    this.orders.push(order);
  }

  getOrdersByUserId(userId: string): Order[] {
    return this.orders.filter((o) => o.userId === userId);
  }

  updateOrder(order: Order): void {
    const index = this.orders.findIndex((o) => o.id === order.id);
    if (index !== -1) {
      this.orders[index] = order;
    }
  }

  // Métodos para portafolios
  getPortfolioByUserId(userId: string): Portfolio | undefined {
    return this.portfolios.get(userId);
  }

  updatePortfolio(portfolio: Portfolio): void {
    this.portfolios.set(portfolio.userId, portfolio);
  }

  // Métodos para datos de mercado
  getAllMarketData(): MarketData[] {
    return Array.from(this.marketData.values());
  }

  getMarketDataBySymbol(symbol: string): MarketData | undefined {
    return this.marketData.get(symbol);
  }

  updateMarketData(data: MarketData): void {
    this.marketData.set(data.symbol, data);
  }
}

// Instancia global de almacenamiento
export const storage = new InMemoryStorage();
