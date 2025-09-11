// Controladores - Lógica de presentación con múltiples responsabilidades
import { Request, Response } from "express";
import { TradingService } from "../services/TradingService";
import { MarketAnalysisService } from "../services/MarketAnalysisService";
import { MarketSimulationService } from "../services/MarketSimulationService";
import { storage } from "../utils/storage";

// Instancias de servicios - Candidato para Dependency Injection
const tradingService = new TradingService();
const analysisService = new MarketAnalysisService();
const marketSimulation = new MarketSimulationService();

// Controlador de autenticación
export class AuthController {
  static async validateApiKey(req: Request, res: Response) {
    try {
      // Si llegamos aquí, el middleware ya validó la API key
      const user = req.user;

      res.json({
        valid: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
        },
        message: "API key válida",
      });
    } catch (error) {
      res.status(500).json({
        error: "Error interno del servidor",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}

// Controlador de usuarios
export class UserController {
  static async getProfile(req: Request, res: Response) {
    try {
      const user = req.user;

      res.json({
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          balance: user.balance,
          riskTolerance: user.riskTolerance,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener perfil",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const user = req.user;
      const { email, riskTolerance } = req.body;

      // Validaciones básicas
      if (email && typeof email !== "string") {
        return res.status(400).json({
          error: "Email inválido",
          message: "El email debe ser una cadena válida",
        });
      }

      if (riskTolerance && !["low", "medium", "high"].includes(riskTolerance)) {
        return res.status(400).json({
          error: "Tolerancia al riesgo inválida",
          message: "La tolerancia al riesgo debe ser: low, medium o high",
        });
      }

      // Actualizar campos
      if (email) user.email = email;
      if (riskTolerance) user.riskTolerance = riskTolerance;

      storage.updateUser(user);

      res.json({
        message: "Perfil actualizado exitosamente",
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          balance: user.balance,
          riskTolerance: user.riskTolerance,
        },
      });
    } catch (error) {
      res.status(500).json({
        error: "Error al actualizar perfil",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}

// Controlador de mercado
export class MarketController {
  static async getPrices(req: Request, res: Response) {
    try {
      const marketData = storage.getAllMarketData();

      res.json({
        prices: marketData.map((data) => ({
          symbol: data.symbol,
          price: data.price,
          change: data.change,
          changePercent: data.changePercent,
          volume: data.volume,
          timestamp: data.timestamp,
        })),
        timestamp: new Date(),
      });
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener precios",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  static async getPriceBySymbol(req: Request, res: Response) {
    try {
      const { symbol } = req.params;
      const marketData = storage.getMarketDataBySymbol(symbol.toUpperCase());

      if (!marketData) {
        return res.status(404).json({
          error: "Activo no encontrado",
          message: `No se encontraron datos para el símbolo ${symbol}`,
        });
      }

      res.json({
        symbol: marketData.symbol,
        price: marketData.price,
        change: marketData.change,
        changePercent: marketData.changePercent,
        volume: marketData.volume,
        timestamp: marketData.timestamp,
      });
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener precio",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}

// Controlador de trading - Métodos largos con múltiples responsabilidades
export class TradingController {
  static async buyAsset(req: Request, res: Response) {
    try {
      const user = req.user;
      const { symbol, quantity } = req.body;

      // Validaciones adicionales específicas de compra
      if (!symbol || typeof symbol !== "string") {
        return res.status(400).json({
          error: "Símbolo requerido",
          message: "El símbolo del activo es requerido",
        });
      }

      if (!quantity || typeof quantity !== "number" || quantity <= 0) {
        return res.status(400).json({
          error: "Cantidad inválida",
          message: "La cantidad debe ser un número mayor a 0",
        });
      }

      // Verificar que el activo existe
      const asset = storage.getAssetBySymbol(symbol.toUpperCase());
      if (!asset) {
        return res.status(404).json({
          error: "Activo no encontrado",
          message: `El activo ${symbol} no existe`,
        });
      }

      // Ejecutar orden de compra
      const transaction = await tradingService.executeBuyOrder(
        user.id,
        symbol.toUpperCase(),
        quantity
      );

      res.status(201).json({
        message: "Orden de compra ejecutada exitosamente",
        transaction: {
          id: transaction.id,
          type: transaction.type,
          symbol: transaction.symbol,
          quantity: transaction.quantity,
          price: transaction.price,
          fees: transaction.fees,
          timestamp: transaction.timestamp,
          status: transaction.status,
        },
      });
    } catch (error) {
      res.status(400).json({
        error: "Error en orden de compra",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  static async sellAsset(req: Request, res: Response) {
    try {
      const user = req.user;
      const { symbol, quantity } = req.body;

      // Validaciones similares a buyAsset (código duplicado)
      if (!symbol || typeof symbol !== "string") {
        return res.status(400).json({
          error: "Símbolo requerido",
          message: "El símbolo del activo es requerido",
        });
      }

      if (!quantity || typeof quantity !== "number" || quantity <= 0) {
        return res.status(400).json({
          error: "Cantidad inválida",
          message: "La cantidad debe ser un número mayor a 0",
        });
      }

      // Verificar que el activo existe
      const asset = storage.getAssetBySymbol(symbol.toUpperCase());
      if (!asset) {
        return res.status(404).json({
          error: "Activo no encontrado",
          message: `El activo ${symbol} no existe`,
        });
      }

      // Ejecutar orden de venta
      const transaction = await tradingService.executeSellOrder(
        user.id,
        symbol.toUpperCase(),
        quantity
      );

      res.status(201).json({
        message: "Orden de venta ejecutada exitosamente",
        transaction: {
          id: transaction.id,
          type: transaction.type,
          symbol: transaction.symbol,
          quantity: transaction.quantity,
          price: transaction.price,
          fees: transaction.fees,
          timestamp: transaction.timestamp,
          status: transaction.status,
        },
      });
    } catch (error) {
      res.status(400).json({
        error: "Error en orden de venta",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  static async getTransactionHistory(req: Request, res: Response) {
    try {
      const user = req.user;
      const transactions = tradingService.getTransactionHistory(user.id);

      res.json({
        transactions: transactions.map((transaction) => ({
          id: transaction.id,
          type: transaction.type,
          symbol: transaction.symbol,
          quantity: transaction.quantity,
          price: transaction.price,
          fees: transaction.fees,
          timestamp: transaction.timestamp,
          status: transaction.status,
        })),
      });
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener historial",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}

// Controlador de portafolio
export class PortfolioController {
  static async getPortfolio(req: Request, res: Response) {
    try {
      const user = req.user;
      const portfolio = storage.getPortfolioByUserId(user.id);

      if (!portfolio) {
        return res.status(404).json({
          error: "Portafolio no encontrado",
          message: "No se encontró el portafolio del usuario",
        });
      }

      res.json({
        portfolio: {
          holdings: portfolio.holdings,
          totalValue: portfolio.totalValue,
          totalInvested: portfolio.totalInvested,
          totalReturn: portfolio.totalReturn,
          percentageReturn: portfolio.percentageReturn,
          lastUpdated: portfolio.lastUpdated,
        },
      });
    } catch (error) {
      res.status(500).json({
        error: "Error al obtener portafolio",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  static async getPerformance(req: Request, res: Response) {
    try {
      const user = req.user;
      const portfolio = storage.getPortfolioByUserId(user.id);

      if (!portfolio) {
        return res.status(404).json({
          error: "Portafolio no encontrado",
          message: "No se encontró el portafolio del usuario",
        });
      }

      // Análisis básico de rendimiento
      const performance = {
        totalValue: portfolio.totalValue,
        totalInvested: portfolio.totalInvested,
        totalReturn: portfolio.totalReturn,
        percentageReturn: portfolio.percentageReturn,
        bestPerformer: null as any,
        worstPerformer: null as any,
        diversification: {
          holdingsCount: portfolio.holdings.length,
          sectors: [
            ...new Set(
              portfolio.holdings.map((h) => {
                const asset = storage.getAssetBySymbol(h.symbol);
                return asset ? asset.sector : "Unknown";
              })
            ),
          ],
        },
      };

      // Encontrar activos con mayor y menor rendimiento
      if (portfolio.holdings.length > 0) {
        const sortedByReturn = [...portfolio.holdings].sort(
          (a, b) => b.percentageReturn - a.percentageReturn
        );
        performance.bestPerformer = sortedByReturn[0];
        performance.worstPerformer = sortedByReturn[sortedByReturn.length - 1];
      }

      res.json({ performance });
    } catch (error) {
      res.status(500).json({
        error: "Error al analizar rendimiento",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}

// Controlador de análisis
export class AnalysisController {
  static async getRiskAnalysis(req: Request, res: Response) {
    try {
      const user = req.user;
      const riskAnalysis = analysisService.analyzePortfolioRisk(user.id);

      res.json({ riskAnalysis });
    } catch (error) {
      res.status(500).json({
        error: "Error en análisis de riesgo",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }

  static async getRecommendations(req: Request, res: Response) {
    try {
      const user = req.user;
      const recommendations = analysisService.generateInvestmentRecommendations(
        user.id
      );

      res.json({ recommendations });
    } catch (error) {
      res.status(500).json({
        error: "Error al generar recomendaciones",
        message: error instanceof Error ? error.message : "Error desconocido",
      });
    }
  }
}
