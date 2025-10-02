// utils/assetVolatility.ts - Función para obtener la volatilidad de un activo
import { storage } from "./storage";

export function getAssetVolatility(symbol: string): number {
    // Simulación básica de volatilidad por sector
    const asset = storage.getAssetBySymbol(symbol);
    if (!asset) return 50; // Volatilidad por defecto

    const volatilityBySector: { [key: string]: number } = {
      Technology: 65,
      Healthcare: 45,
      Financial: 55,
      Automotive: 70,
      "E-commerce": 60,
    };
    return volatilityBySector[asset.sector] || 50;
  }