// Rutas de la API
import { Router } from "express";
import {
  AuthController,
  UserController,
  MarketController,
  TradingController,
  PortfolioController,
  AnalysisController,
} from "../controllers";
import { authenticateApiKey, validateTradeData } from "../middleware/auth";

const router = Router();

// Rutas de autenticación
router.get("/auth/validate", authenticateApiKey, AuthController.validateApiKey);

// Rutas de usuarios (requieren autenticación)
router.get("/users/profile", authenticateApiKey, UserController.getProfile);
router.put("/users/profile", authenticateApiKey, UserController.updateProfile);

// Rutas de mercado (requieren autenticación)
router.get("/market/prices", authenticateApiKey, MarketController.getPrices);
router.get(
  "/market/prices/:symbol",
  authenticateApiKey,
  MarketController.getPriceBySymbol
);

// Rutas de trading (requieren autenticación y validación de datos)
router.post(
  "/trading/buy",
  authenticateApiKey,
  validateTradeData,
  TradingController.buyAsset
);
router.post(
  "/trading/sell",
  authenticateApiKey,
  validateTradeData,
  TradingController.sellAsset
);
router.get(
  "/trading/history",
  authenticateApiKey,
  TradingController.getTransactionHistory
);

// Rutas de portafolio (requieren autenticación)
router.get("/portfolio", authenticateApiKey, PortfolioController.getPortfolio);
router.get(
  "/portfolio/performance",
  authenticateApiKey,
  PortfolioController.getPerformance
);

// Rutas de análisis (requieren autenticación)
router.get(
  "/analysis/risk",
  authenticateApiKey,
  AnalysisController.getRiskAnalysis
);
router.get(
  "/analysis/recommendations",
  authenticateApiKey,
  AnalysisController.getRecommendations
);

export default router;
