// Configuración específica para desarrollo
export const devConfig = {
  // Intervalo más rápido para testing en desarrollo (3 segundos)
  marketUpdateInterval: 3000,

  // Mayor volatilidad para testing más dinámico
  volatilityFactor: 0.15,

  // Logs más detallados
  enableDetailedLogs: true,

  // Simulación más agresiva
  enableAggressiveSimulation: true,
};

// Configuración para producción
export const prodConfig = {
  // Intervalo normal (5 segundos)
  marketUpdateInterval: 5000,

  // Volatilidad normal
  volatilityFactor: 0.05,

  // Logs mínimos
  enableDetailedLogs: false,

  // Simulación normal
  enableAggressiveSimulation: false,
};

// Exportar configuración según entorno
export const environmentConfig =
  process.env.NODE_ENV === "development" ? devConfig : prodConfig;
