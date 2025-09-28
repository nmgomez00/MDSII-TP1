// Punto de entrada de la aplicación
import express from "express";
import cors from "cors";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import apiRoutes from "./routes/api";
import { requestLogger } from "./middleware/auth";
import { MarketSimulationService } from "./services/MarketSimulationService";
import { environmentConfig } from "./config/environment";

// Crear aplicación Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware básico
app.use(helmet()); // Seguridad básica
app.use(cors()); // CORS habilitado para todos los orígenes (no recomendado en producción)
app.use(express.json()); // Parser de JSON
app.use(requestLogger); // Logger básico

// Documentación Swagger
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: ".swagger-ui .topbar { display: none }",
    customSiteTitle: "Financial Broker API - Docs",
  })
);

// Rutas de la API
app.use("/api", apiRoutes);

// Ruta de health check
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development",
  });
});

// Ruta raíz con información básica
app.get("/", (req, res) => {
  res.json({
    name: "Financial Broker API",
    version: "1.0.0",
    description: "API de broker financiero - Metodología de Sistemas II",
    documentation: "/api-docs",
    health: "/health",
    endpoints: {
      auth: "/api/auth/validate",
      market: "/api/market/prices",
      trading: "/api/trading/buy | /api/trading/sell",
      portfolio: "/api/portfolio",
      analysis: "/api/analysis/risk",
    },
    apiKeys: {
      demo: "demo-key-123",
      admin: "admin-key-456",
      trader: "trader-key-789",
    },
  });
});

// Manejo de rutas no encontradas
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Ruta no encontrada",
    message: `La ruta ${req.originalUrl} no existe`,
    availableRoutes: {
      documentation: "/api-docs",
      api: "/api",
      health: "/health",
    },
  });
});

// Manejo global de errores
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Error global:", error);

    res.status(error.status || 500).json({
      error: "Error interno del servidor",
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Algo salió mal",
      timestamp: new Date().toISOString(),
    });
  }
);

// Inicializar simulación de mercado
const marketSimulation = MarketSimulationService.getInstance();

// Función para iniciar el servidor
function startServer() {
  const isDev = process.env.NODE_ENV === "development";

  const server = app.listen(PORT, () => {
    console.clear(); // Limpiar consola en modo desarrollo
    console.log(`\n🚀 Servidor ejecutándose en http://localhost:${PORT}`);
    console.log(
      `📚 Documentación disponible en http://localhost:${PORT}/api-docs`
    );

    if (isDev) {
      console.log(`\n🔥 Modo DESARROLLO - Recarga automática activada`);
      console.log(`⚙️  Configuración de desarrollo cargada`);
      console.log(
        `🔄 Intervalo de mercado: ${environmentConfig.marketUpdateInterval}ms`
      );
    }

    console.log(`\n💡 API Keys para testing:`);
    console.log(`   - demo-key-123 (demo_user)`);
    console.log(`   - admin-key-456 (admin_user)`);
    console.log(`   - trader-key-789 (trader_user)`);

    // Iniciar simulación de mercado
    setTimeout(() => {
      marketSimulation.startMarketSimulation();
      console.log(`\n📈 Simulación de mercado iniciada`);

      if (isDev) {
        console.log(
          `\n⚡ Realizando cambios en archivos para ver recarga automática...`
        );
        console.log(`📁 Monitoreando carpeta: src/`);
      }
    }, 2000);
  });

  // Manejo graceful shutdown
  process.on("SIGTERM", () => {
    console.log("💀 Recibida señal SIGTERM, cerrando servidor...");
    marketSimulation.stopMarketSimulation();
    server.close(() => {
      console.log("✅ Servidor cerrado correctamente");
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    console.log("💀 Recibida señal SIGINT, cerrando servidor...");
    marketSimulation.stopMarketSimulation();
    server.close(() => {
      console.log("✅ Servidor cerrado correctamente");
      process.exit(0);
    });
  });

  return server;
}

// Iniciar servidor si es el archivo principal
if (require.main === module) {
  startServer();
}

export { app, startServer };
