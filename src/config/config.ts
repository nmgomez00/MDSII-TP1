// Configuración de la aplicación
export const config = {
  port: process.env.PORT || 3000,
  environment: process.env.NODE_ENV || "development",

  // Configuración de API keys hardcodeadas (no usar en producción)
  apiKeys: {
    "demo-key-123": "demo_user",
    "admin-key-456": "admin_user",
    "trader-key-789": "trader_user",
  },

  // Configuración de fees
  tradingFees: {
    buyFeePercentage: 0.001, // 0.1%
    sellFeePercentage: 0.001,
    minimumFee: 1.0,
  },

  // Configuración de límites
  limits: {
    maxOrderSize: 10000,
    minOrderSize: 1,
    dailyTradeLimit: 100,
  },

  // Configuración de simulación de mercado
  market: {
    updateIntervalMs: 5000,
    volatilityFactor: 0.02,
    baseAssets: [
      {
        symbol: "AAPL",
        name: "Apple Inc.",
        basePrice: 150.0,
        sector: "Technology",
      },
      {
        symbol: "GOOGL",
        name: "Alphabet Inc.",
        basePrice: 2500.0,
        sector: "Technology",
      },
      {
        symbol: "MSFT",
        name: "Microsoft Corporation",
        basePrice: 300.0,
        sector: "Technology",
      },
      {
        symbol: "TSLA",
        name: "Tesla Inc.",
        basePrice: 800.0,
        sector: "Automotive",
      },
      {
        symbol: "AMZN",
        name: "Amazon.com Inc.",
        basePrice: 3200.0,
        sector: "E-commerce",
      },
      {
        symbol: "JPM",
        name: "JPMorgan Chase & Co.",
        basePrice: 140.0,
        sector: "Financial",
      },
      {
        symbol: "JNJ",
        name: "Johnson & Johnson",
        basePrice: 160.0,
        sector: "Healthcare",
      },
      { symbol: "V", name: "Visa Inc.", basePrice: 220.0, sector: "Financial" },
    ],
  },
};
