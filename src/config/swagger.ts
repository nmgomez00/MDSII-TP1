// Configuración de Swagger para documentación de la API
import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Financial Broker API",
      version: "1.0.0",
      description: "API de broker financiero - Metodología de Sistemas II",
      contact: {
        name: "UTN - Metodología de Sistemas II",
      },
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Servidor de desarrollo",
      },
    ],
    components: {
      securitySchemes: {
        ApiKeyAuth: {
          type: "apiKey",
          in: "header",
          name: "x-api-key",
          description:
            "API key para autenticación. Valores válidos: demo-key-123, admin-key-456, trader-key-789",
        },
      },
      schemas: {
        User: {
          type: "object",
          properties: {
            id: { type: "string" },
            username: { type: "string" },
            email: { type: "string" },
            balance: { type: "number" },
            riskTolerance: { type: "string", enum: ["low", "medium", "high"] },
            createdAt: { type: "string", format: "date-time" },
          },
        },
        Asset: {
          type: "object",
          properties: {
            symbol: { type: "string" },
            name: { type: "string" },
            currentPrice: { type: "number" },
            sector: { type: "string" },
            lastUpdated: { type: "string", format: "date-time" },
          },
        },
        MarketData: {
          type: "object",
          properties: {
            symbol: { type: "string" },
            price: { type: "number" },
            change: { type: "number" },
            changePercent: { type: "number" },
            volume: { type: "number" },
            timestamp: { type: "string", format: "date-time" },
          },
        },
        Transaction: {
          type: "object",
          properties: {
            id: { type: "string" },
            type: { type: "string", enum: ["buy", "sell"] },
            symbol: { type: "string" },
            quantity: { type: "number" },
            price: { type: "number" },
            fees: { type: "number" },
            timestamp: { type: "string", format: "date-time" },
            status: {
              type: "string",
              enum: ["pending", "completed", "failed"],
            },
          },
        },
        Portfolio: {
          type: "object",
          properties: {
            holdings: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  symbol: { type: "string" },
                  quantity: { type: "number" },
                  averagePrice: { type: "number" },
                  currentValue: { type: "number" },
                  totalReturn: { type: "number" },
                  percentageReturn: { type: "number" },
                },
              },
            },
            totalValue: { type: "number" },
            totalInvested: { type: "number" },
            totalReturn: { type: "number" },
            percentageReturn: { type: "number" },
            lastUpdated: { type: "string", format: "date-time" },
          },
        },
        TradeRequest: {
          type: "object",
          required: ["symbol", "quantity"],
          properties: {
            symbol: {
              type: "string",
              description: "Símbolo del activo (ej: AAPL)",
            },
            quantity: {
              type: "number",
              description: "Cantidad de activos a comprar/vender",
            },
          },
        },
        RiskAnalysis: {
          type: "object",
          properties: {
            userId: { type: "string" },
            portfolioRisk: { type: "string", enum: ["low", "medium", "high"] },
            diversificationScore: { type: "number" },
            recommendations: {
              type: "array",
              items: { type: "string" }
            },
            calculatedAt: { type: "string", format: "date-time" },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string" },
            message: { type: "string" },
          },
        },
      },
    },
    security: [
      {
        ApiKeyAuth: [],
      },
    ],
    paths: {
      "/health": {
        get: {
          summary: "Health Check",
          description: "Verificar el estado del servidor",
          tags: ["System"],
          responses: {
            200: {
              description: "Servidor funcionando correctamente",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      status: { type: "string" },
                      timestamp: { type: "string" },
                      environment: { type: "string" }
                    }
                  }
                }
              }
            }
          }
        }
      },

      "/api/market/assets": {
        get: {
          summary: "Obtener todos los activos",
          description: "Lista todos los activos disponibles en el mercado",
          tags: ["Market"],
          responses: {
            200: {
              description: "Lista de activos",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Asset" }
                  }
                }
              }
            }
          }
        }
      },
      "/api/market/data/{symbol}": {
        get: {
          summary: "Obtener datos de mercado",
          description: "Obtiene los datos de mercado para un activo específico",
          tags: ["Market"],
          parameters: [
            {
              name: "symbol",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Símbolo del activo (ej: AAPL)"
            }
          ],
          responses: {
            200: {
              description: "Datos de mercado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MarketData" }
                }
              }
            },
            404: {
              description: "Activo no encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/api/trading/buy": {
        post: {
          summary: "Comprar activo",
          description: "Ejecuta una orden de compra de activos",
          tags: ["Trading"],
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TradeRequest" }
              }
            }
          },
          responses: {
            201: {
              description: "Orden ejecutada exitosamente",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      transaction: { $ref: "#/components/schemas/Transaction" }
                    }
                  }
                }
              }
            },
            400: {
              description: "Datos inválidos",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            },
            401: {
              description: "No autorizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/api/trading/sell": {
        post: {
          summary: "Vender activo",
          description: "Ejecuta una orden de venta de activos",
          tags: ["Trading"],
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/TradeRequest" }
              }
            }
          },
          responses: {
            201: {
              description: "Orden ejecutada exitosamente",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      transaction: { $ref: "#/components/schemas/Transaction" }
                    }
                  }
                }
              }
            },
            400: {
              description: "Datos inválidos o fondos insuficientes",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            },
            401: {
              description: "No autorizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/api/portfolio": {
        get: {
          summary: "Obtener portafolio",
          description: "Obtiene el portafolio del usuario autenticado",
          tags: ["Portfolio"],
          security: [{ ApiKeyAuth: [] }],
          responses: {
            200: {
              description: "Portafolio del usuario",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Portfolio" }
                }
              }
            },
            401: {
              description: "No autorizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/api/auth/validate": {
        get: {
          summary: "Validar API Key",
          description: "Valida si el API Key proporcionado es válido",
          tags: ["Authentication"],
          security: [{ ApiKeyAuth: [] }],
          responses: {
            200: {
              description: "API Key válido",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      message: { type: "string" },
                      user: { $ref: "#/components/schemas/User" }
                    }
                  }
                }
              }
            },
            401: {
              description: "API Key inválido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/api/users/profile": {
        get: {
          summary: "Obtener perfil del usuario",
          description: "Obtiene el perfil del usuario autenticado",
          tags: ["Users"],
          security: [{ ApiKeyAuth: [] }],
          responses: {
            200: {
              description: "Perfil del usuario",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" }
                }
              }
            },
            401: {
              description: "No autorizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        },
        put: {
          summary: "Actualizar perfil del usuario",
          description: "Actualiza el perfil del usuario autenticado",
          tags: ["Users"],
          security: [{ ApiKeyAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    riskTolerance: { type: "string", enum: ["low", "medium", "high"] }
                  }
                }
              }
            }
          },
          responses: {
            200: {
              description: "Perfil actualizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/User" }
                }
              }
            },
            401: {
              description: "No autorizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/api/market/prices": {
        get: {
          summary: "Obtener precios de mercado",
          description: "Obtiene los precios actuales de todos los activos",
          tags: ["Market"],
          security: [{ ApiKeyAuth: [] }],
          responses: {
            200: {
              description: "Precios de mercado",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/MarketData" }
                  }
                }
              }
            },
            401: {
              description: "No autorizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/api/market/prices/{symbol}": {
        get: {
          summary: "Obtener precio de un activo",
          description: "Obtiene el precio actual de un activo específico",
          tags: ["Market"],
          security: [{ ApiKeyAuth: [] }],
          parameters: [
            {
              name: "symbol",
              in: "path",
              required: true,
              schema: { type: "string" },
              description: "Símbolo del activo (ej: AAPL)"
            }
          ],
          responses: {
            200: {
              description: "Precio del activo",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/MarketData" }
                }
              }
            },
            404: {
              description: "Activo no encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            },
            401: {
              description: "No autorizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/api/trading/history": {
        get: {
          summary: "Historial de transacciones",
          description: "Obtiene el historial de transacciones del usuario",
          tags: ["Trading"],
          security: [{ ApiKeyAuth: [] }],
          responses: {
            200: {
              description: "Historial de transacciones",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/Transaction" }
                  }
                }
              }
            },
            401: {
              description: "No autorizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/api/portfolio/performance": {
        get: {
          summary: "Rendimiento del portafolio",
          description: "Obtiene métricas de rendimiento del portafolio",
          tags: ["Portfolio"],
          security: [{ ApiKeyAuth: [] }],
          responses: {
            200: {
              description: "Métricas de rendimiento",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      totalReturn: { type: "number" },
                      percentageReturn: { type: "number" },
                      bestPerformer: { type: "string" },
                      worstPerformer: { type: "string" },
                      dailyChange: { type: "number" }
                    }
                  }
                }
              }
            },
            401: {
              description: "No autorizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/api/analysis/risk": {
        get: {
          summary: "Análisis de riesgo del portafolio",
          description: "Obtiene un análisis de riesgo del portafolio del usuario",
          tags: ["Analysis"],
          security: [{ ApiKeyAuth: [] }],
          responses: {
            200: {
              description: "Análisis de riesgo",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/RiskAnalysis" }
                }
              }
            },
            401: {
              description: "No autorizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      },
      "/api/analysis/recommendations": {
        get: {
          summary: "Recomendaciones de inversión",
          description: "Obtiene recomendaciones de inversión personalizadas",
          tags: ["Analysis"],
          security: [{ ApiKeyAuth: [] }],
          responses: {
            200: {
              description: "Recomendaciones de inversión",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      recommendations: {
                        type: "array",
                        items: { type: "string" }
                      },
                      generatedAt: { type: "string", format: "date-time" }
                    }
                  }
                }
              }
            },
            401: {
              description: "No autorizado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ["./src/routes/*.ts"], // Archivos donde están las definiciones de rutas
};

export const swaggerSpec = swaggerJsdoc(options);
