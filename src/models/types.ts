// Modelos principales del sistema

export class User {
  id: string;
  username: string;
  email: string;
  apiKey: string;
  balance: number;
  riskTolerance: "low" | "medium" | "high";
  createdAt: Date;

  constructor(
    id: string,
    username: string,
    email: string,
    apiKey: string,
    balance: number,
    riskTolerance: "low" | "medium" | "high"
  ) {
    this.id = id;
    this.username = username;
    this.email = email;
    this.apiKey = apiKey;
    this.balance = balance;
    this.riskTolerance = riskTolerance;
    this.createdAt = new Date();
  }

  canAfford(amount: number): boolean {
    return this.balance >= amount;
  }

  deductBalance(amount: number): void {
    this.balance -= amount;
  }

  addBalance(amount: number): void {
    this.balance += amount;
  }
}

export class Asset {
  symbol: string;
  name: string;
  currentPrice: number;
  sector: string;
  lastUpdated: Date;

  constructor(
    symbol: string,
    name: string,
    currentPrice: number,
    sector: string
  ) {
    this.symbol = symbol;
    this.name = name;
    this.currentPrice = currentPrice;
    this.sector = sector;
    this.lastUpdated = new Date();
  }

  updatePrice(newPrice: number): void {
    this.currentPrice = newPrice;
    this.lastUpdated = new Date();
  }
}

export class Transaction {
  id: string;
  userId: string;
  type: "buy" | "sell";
  symbol: string;
  quantity: number;
  price: number;
  timestamp: Date;
  fees: number;
  status: "pending" | "completed" | "failed";

  constructor(
    id: string,
    userId: string,
    type: "buy" | "sell",
    symbol: string,
    quantity: number,
    price: number,
    fees: number
  ) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.symbol = symbol;
    this.quantity = quantity;
    this.price = price;
    this.fees = fees;
    this.timestamp = new Date();
    this.status = "pending";
  }

  complete(): void {
    this.status = "completed";
  }

  fail(): void {
    this.status = "failed";
  }

  getTotalAmount(): number {
    return this.quantity * this.price;
  }
}

export class PortfolioHolding {
  symbol: string;
  quantity: number;
  averagePrice: number;
  currentValue: number;
  totalReturn: number;
  percentageReturn: number;

  constructor(symbol: string, quantity: number, averagePrice: number) {
    this.symbol = symbol;
    this.quantity = quantity;
    this.averagePrice = averagePrice;
    this.currentValue = 0;
    this.totalReturn = 0;
    this.percentageReturn = 0;
  }

  updateCurrentValue(currentPrice: number): void {
    this.currentValue = this.quantity * currentPrice;
    const invested = this.quantity * this.averagePrice;
    this.totalReturn = this.currentValue - invested;
    this.percentageReturn =
      invested > 0 ? (this.totalReturn / invested) * 100 : 0;
  }

  addShares(quantity: number, price: number): void {
    const totalQuantity = this.quantity + quantity;
    const totalCost = this.quantity * this.averagePrice + quantity * price;
    this.quantity = totalQuantity;
    this.averagePrice = totalCost / totalQuantity;
  }

  removeShares(quantity: number): void {
    this.quantity -= quantity;
  }
}

export class Portfolio {
  userId: string;
  holdings: PortfolioHolding[];
  totalValue: number;
  totalInvested: number;
  totalReturn: number;
  percentageReturn: number;
  lastUpdated: Date;

  constructor(userId: string) {
    this.userId = userId;
    this.holdings = [];
    this.totalValue = 0;
    this.totalInvested = 0;
    this.totalReturn = 0;
    this.percentageReturn = 0;
    this.lastUpdated = new Date();
  }

  addHolding(symbol: string, quantity: number, price: number): void {
    const existingHolding = this.holdings.find((h) => h.symbol === symbol);

    if (existingHolding) {
      existingHolding.addShares(quantity, price);
    } else {
      const newHolding = new PortfolioHolding(symbol, quantity, price);
      this.holdings.push(newHolding);
    }

    this.lastUpdated = new Date();
  }

  removeHolding(symbol: string, quantity: number): boolean {
    const holding = this.holdings.find((h) => h.symbol === symbol);

    if (!holding || holding.quantity < quantity) {
      return false;
    }

    holding.removeShares(quantity);

    if (holding.quantity === 0) {
      this.holdings = this.holdings.filter((h) => h.symbol !== symbol);
    }

    this.lastUpdated = new Date();
    return true;
  }

  calculateTotals(): void {
    let totalValue = 0;
    let totalInvested = 0;

    this.holdings.forEach((holding) => {
      const invested = holding.quantity * holding.averagePrice;
      totalValue += holding.currentValue;
      totalInvested += invested;
    });

    this.totalValue = totalValue;
    this.totalInvested = totalInvested;
    this.totalReturn = totalValue - totalInvested;
    this.percentageReturn =
      totalInvested > 0 ? (this.totalReturn / totalInvested) * 100 : 0;
    this.lastUpdated = new Date();
  }
}

export class Order {
  id: string;
  userId: string;
  type: "market";
  action: "buy" | "sell";
  symbol: string;
  quantity: number;
  price?: number;
  status: "pending" | "executed" | "cancelled";
  createdAt: Date;
  executedAt?: Date;

  constructor(
    id: string,
    userId: string,
    type: "market",
    action: "buy" | "sell",
    symbol: string,
    quantity: number,
    price?: number
  ) {
    this.id = id;
    this.userId = userId;
    this.type = type;
    this.action = action;
    this.symbol = symbol;
    this.quantity = quantity;
    this.price = price;
    this.status = "pending";
    this.createdAt = new Date();
  }

  execute(): void {
    this.status = "executed";
    this.executedAt = new Date();
  }

  cancel(): void {
    this.status = "cancelled";
  }
}

export class RiskAnalysis {
  userId: string;
  portfolioRisk: "low" | "medium" | "high";
  diversificationScore: number;
  recommendations: string[];
  calculatedAt: Date;

  constructor(userId: string) {
    this.userId = userId;
    this.portfolioRisk = "medium";
    this.diversificationScore = 0;
    this.recommendations = [];
    this.calculatedAt = new Date();
  }

  updateRisk(
    risk: "low" | "medium" | "high",
    diversificationScore: number,
    recommendations: string[]
  ): void {
    this.portfolioRisk = risk;
    this.diversificationScore = diversificationScore;
    this.recommendations = recommendations;
    this.calculatedAt = new Date();
  }
}

export class MarketData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  timestamp: Date;

  constructor(symbol: string, price: number) {
    this.symbol = symbol;
    this.price = price;
    this.change = 0;
    this.changePercent = 0;
    this.volume = Math.floor(Math.random() * 1000000);
    this.timestamp = new Date();
  }

  updatePrice(newPrice: number): void {
    this.change = newPrice - this.price;
    this.changePercent = this.price > 0 ? (this.change / this.price) * 100 : 0;
    this.price = newPrice;
    this.volume += Math.floor(Math.random() * 10000);
    this.timestamp = new Date();
  }
}
