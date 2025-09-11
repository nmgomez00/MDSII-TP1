// Middleware de autenticación
import { Request, Response, NextFunction } from "express";
import { storage } from "../utils/storage";
import { config } from "../config/config";

// Extender Request para incluir user
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Middleware de autenticación por API key
export const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKey = req.headers["x-api-key"] as string;

  if (!apiKey) {
    return res.status(401).json({
      error: "API key requerida",
      message: "Incluye el header x-api-key en tu request",
    });
  }

  // Validar API key hardcodeada
  const username = config.apiKeys[apiKey as keyof typeof config.apiKeys];
  if (!username) {
    return res.status(401).json({
      error: "API key inválida",
      message: "La API key proporcionada no es válida",
    });
  }

  // Buscar usuario en storage
  const user = storage.getUserByApiKey(apiKey);
  if (!user) {
    return res.status(401).json({
      error: "Usuario no encontrado",
      message: "No se encontró un usuario asociado a esta API key",
    });
  }

  // Agregar usuario al request
  req.user = user;
  next();
};

// Middleware de logging de requests
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const url = req.url;
  const userAgent = req.headers["user-agent"] || "Unknown";

  console.log(`[${timestamp}] ${method} ${url} - User-Agent: ${userAgent}`);

  // Log adicional si hay usuario autenticado
  if (req.user) {
    console.log(`[${timestamp}] Authenticated user: ${req.user.username}`);
  }

  next();
};

// Middleware de validación de datos de trading
export const validateTradeData = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { symbol, quantity, price } = req.body;

  // Validaciones básicas
  if (!symbol || typeof symbol !== "string") {
    return res.status(400).json({
      error: "Símbolo requerido",
      message: "El símbolo del activo es requerido y debe ser una cadena",
    });
  }

  if (!quantity || typeof quantity !== "number" || quantity <= 0) {
    return res.status(400).json({
      error: "Cantidad inválida",
      message: "La cantidad debe ser un número mayor a 0",
    });
  }

  if (price && (typeof price !== "number" || price <= 0)) {
    return res.status(400).json({
      error: "Precio inválido",
      message: "El precio debe ser un número mayor a 0",
    });
  }

  // Validar límites de configuración
  if (quantity > config.limits.maxOrderSize) {
    return res.status(400).json({
      error: "Cantidad excede el límite",
      message: `La cantidad máxima por orden es ${config.limits.maxOrderSize}`,
    });
  }

  if (quantity < config.limits.minOrderSize) {
    return res.status(400).json({
      error: "Cantidad por debajo del mínimo",
      message: `La cantidad mínima por orden es ${config.limits.minOrderSize}`,
    });
  }

  next();
};
