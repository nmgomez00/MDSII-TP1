# Documentación de Postman - Financial Broker API

## Introducción

Esta carpeta contiene una colección completa de Postman para probar todos los endpoints de la API de broker financiero. La colección incluye ejemplos de todas las operaciones disponibles con datos de prueba realistas.

## Instalación de la colección

### Opción 1: Importar desde archivo JSON

1. Abre Postman
2. Haz clic en "Import" en la parte superior izquierda
3. Selecciona el archivo `Financial-Broker-API.postman_collection.json`
4. La colección aparecerá en tu sidebar

### Opción 2: Importar desde enlace

1. Abre Postman
2. Haz clic en "Import"
3. Selecciona "Link"
4. Pega la URL de la colección (si está disponible en un repositorio)

## Configuración del entorno

### Variables de entorno necesarias

Crea un nuevo entorno en Postman con las siguientes variables:

- `baseUrl`: `http://localhost:3000`
- `apiKey`: `demo-key-123` (o cualquiera de las API keys válidas)

### API Keys disponibles

- `demo-key-123` - Usuario: demo_user (Balance: $10,000)
- `admin-key-456` - Usuario: admin_user (Balance: $50,000)
- `trader-key-789` - Usuario: trader_user (Balance: $25,000)

## Estructura de la colección

### 1. Authentication

- **Validate API Key**: Verifica que tu API key sea válida

### 2. User Management

- **Get Profile**: Obtiene el perfil del usuario autenticado
- **Update Profile**: Actualiza el email y tolerancia al riesgo

### 3. Market Data

- **Get All Prices**: Obtiene precios de todos los activos
- **Get Price by Symbol**: Obtiene precio de un activo específico

### 4. Trading Operations

- **Buy Asset (Market Order)**: Compra al precio de mercado
- **Buy Asset (Limit Order)**: Compra con precio límite
- **Sell Asset (Market Order)**: Venta al precio de mercado
- **Sell Asset (Limit Order)**: Venta con precio límite
- **Get Transaction History**: Historial de transacciones

### 5. Portfolio Management

- **Get Portfolio**: Ver portafolio actual
- **Get Performance**: Análisis de rendimiento del portafolio

### 6. Analysis & Reports

- **Risk Analysis**: Análisis de riesgo del portafolio
- **Investment Recommendations**: Recomendaciones personalizadas

## Flujo de pruebas recomendado

### Paso 1: Autenticación

1. Ejecuta "Validate API Key" para confirmar que tu configuración es correcta

### Paso 2: Explorar datos iniciales

1. Ejecuta "Get Profile" para ver tu balance inicial
2. Ejecuta "Get All Prices" para ver precios de activos disponibles
3. Ejecuta "Get Portfolio" para ver tu portafolio (inicialmente vacío)

### Paso 3: Realizar operaciones de trading

1. Ejecuta "Buy Asset (Market Order)" para comprar algunos activos
2. Ejecuta "Get Portfolio" para verificar la compra
3. Ejecuta "Buy Asset (Limit Order)" para probar órdenes límite
4. Ejecuta "Get Transaction History" para ver el historial

### Paso 4: Análisis y reportes

1. Ejecuta "Risk Analysis" para analizar el riesgo de tu portafolio
2. Ejecuta "Get Performance" para ver métricas de rendimiento
3. Ejecuta "Investment Recommendations" para obtener sugerencias

### Paso 5: Operaciones de venta

1. Ejecuta "Sell Asset (Market Order)" para vender algunos activos
2. Verifica los cambios en el portafolio y balance

## Ejemplos de datos de prueba

### Activos disponibles para trading

- `AAPL` - Apple Inc. (~$150)
- `GOOGL` - Alphabet Inc. (~$2,500)
- `MSFT` - Microsoft Corp. (~$300)
- `TSLA` - Tesla Inc. (~$800)
- `AMZN` - Amazon.com (~$3,200)
- `JPM` - JPMorgan Chase (~$140)
- `JNJ` - Johnson & Johnson (~$160)
- `V` - Visa Inc. (~$220)

### Datos de ejemplo para compras

```json
{
  "symbol": "AAPL",
  "quantity": 10,
  "orderType": "market"
}
```

```json
{
  "symbol": "GOOGL",
  "quantity": 2,
  "orderType": "limit",
  "limitPrice": 2400.0
}
```

## Notas importantes

### Headers requeridos

Todas las requests (excepto documentación y health check) requieren:

```
x-api-key: demo-key-123
Content-Type: application/json
```

### Códigos de respuesta esperados

- `200`: Operación exitosa
- `201`: Recurso creado (transacciones)
- `400`: Error en los datos enviados
- `401`: API key inválida o faltante
- `404`: Recurso no encontrado
- `500`: Error interno del servidor

### Limitaciones del sistema

- Cantidad máxima por orden: 10,000 unidades
- Cantidad mínima por orden: 1 unidad
- Precios simulados que cambian cada 5 segundos
- Balance limitado según el usuario

## Troubleshooting

### Error 401: API key inválida

- Verifica que el header `x-api-key` esté presente
- Confirma que estás usando una de las API keys válidas
- Asegúrate de que no hay espacios extra en la API key

### Error 400: Fondos insuficientes

- Verifica tu balance con "Get Profile"
- Reduce la cantidad o elige un activo más barato
- Recuerda que se cobran fees por cada transacción

### Error 404: Activo no encontrado

- Verifica que el símbolo esté en mayúsculas
- Consulta la lista de activos disponibles con "Get All Prices"

### Precios que cambian constantemente

- Es normal, la simulación actualiza precios cada 5 segundos
- Los precios son simulados y no reflejan valores reales del mercado

## Contacto y soporte

Para reportar problemas o sugerir mejoras en la colección de Postman:

- Crea un issue en el repositorio del proyecto
- Contacta al equipo de desarrollo de la materia

---

**⚠️ Disclaimer**: Esta API es solo para fines educativos. No utilizar con datos financieros reales.
