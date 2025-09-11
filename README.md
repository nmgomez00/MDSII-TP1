# API de Broker Financiero - Metodología de Sistemas II

## Descripción

Esta API simula un broker financiero que permite realizar operaciones de trading, gestión de portafolios y análisis de mercado.

## Características principales

- Gestión de usuarios y autenticación básica
- Operaciones de trading (compra/venta de activos)
- Gestión de portafolios
- Consulta de precios de mercado
- Historial de transacciones
- Análisis básico de riesgo

## Endpoints disponibles

### Autenticación

- `GET /api/auth/validate` - Validar API key

### Usuarios

- `GET /api/users/profile` - Obtener perfil del usuario
- `PUT /api/users/profile` - Actualizar perfil del usuario

### Mercado

- `GET /api/market/prices` - Obtener precios actuales
- `GET /api/market/prices/:symbol` - Obtener precio de un activo específico

### Trading

- `POST /api/trading/buy` - Comprar activos
- `POST /api/trading/sell` - Vender activos
- `GET /api/trading/history` - Historial de transacciones

### Portafolio

- `GET /api/portfolio` - Ver portafolio actual
- `GET /api/portfolio/performance` - Análisis de rendimiento

### Análisis

- `GET /api/analysis/risk` - Análisis de riesgo del portafolio
- `GET /api/analysis/recommendations` - Recomendaciones de inversión

## Instalación y ejecución

### Prerrequisitos

- Node.js versión 18 o superior
- npm (incluido con Node.js)
- Un cliente HTTP como curl, Postman, o Insomnia

### Instalación

1. **Clonar o descargar el proyecto**

   ```bash
   git clone <repository-url>
   cd tp-tup-tt-utn-patrones
   ```

2. **Instalar dependencias**

   ```bash
   npm install
   ```

3. **Compilar el proyecto (opcional)**
   ```bash
   npm run build
   ```

### Ejecución

**Modo desarrollo con recarga automática (recomendado):**

```bash
# Opción 1: Usando nodemon (recarga automática)
npm run watch

# Opción 2: Usando script personalizado
npm run dev:full
# o directamente
./dev.sh

# Opción 3: Modo desarrollo simple (sin recarga)
npm run dev
```

**Modo producción:**

```bash
npm run build
npm start
```

**Otros comandos útiles:**

- `npm run watch:build` - Compila TypeScript en modo watch
- `npm run start:watch` - Ejecuta el build compilado con recarga automática

La API estará disponible en `http://localhost:3000`

### Verificación de funcionamiento

Una vez levantado el servidor, deberías ver:

```
🚀 Servidor ejecutándose en http://localhost:3000
📚 Documentación disponible en http://localhost:3000/api-docs
💡 API Keys para testing:
   - demo-key-123 (demo_user)
   - admin-key-456 (admin_user)
   - trader-key-789 (trader_user)
📈 Simulación de mercado iniciada
```

## Documentación Swagger

Una vez levantada la aplicación, la documentación interactiva estará disponible en:
`http://localhost:3000/api-docs`

## Autenticación

La API utiliza un sistema simple de API keys. Incluye el header `x-api-key` en tus requests:

```
x-api-key: demo-key-123
```

**API Keys válidas para testing:**

- `demo-key-123` (usuario: demo_user)
- `admin-key-456` (usuario: admin_user)
- `trader-key-789` (usuario: trader_user)

## Ejemplos de uso

### Obtener precios de mercado

```bash
curl -X GET "http://localhost:3000/api/market/prices" \
  -H "x-api-key: demo-key-123"
```

### Comprar activos

```bash
curl -X POST "http://localhost:3000/api/trading/buy" \
  -H "Content-Type: application/json" \
  -H "x-api-key: demo-key-123" \
  -d '{
    "symbol": "AAPL",
    "quantity": 10,
    "price": 150.50
  }'
```

### Ver portafolio

```bash
curl -X GET "http://localhost:3000/api/portfolio" \
  -H "x-api-key: demo-key-123"
```

## Opciones de prueba

### 1. Documentación interactiva (Swagger)

Abre tu navegador en: http://localhost:3000/api-docs

### 2. Script de pruebas automatizado

```bash
./test-api.sh
```

### 3. Colección de Postman

Importa el archivo: `postman/Financial-Broker-API.postman_collection.json`

Para más detalles, consulta la [documentación de Postman](./postman/README.md) donde encontrarás una colección completa con todos los endpoints.

### 4. Comandos curl adicionales

**Validar API key:**

```bash
curl -X GET "http://localhost:3000/api/auth/validate" \
  -H "x-api-key: demo-key-123"
```

**Comprar con orden límite:**

```bash
curl -X POST "http://localhost:3000/api/trading/buy" \
  -H "Content-Type: application/json" \
  -H "x-api-key: demo-key-123" \
  -d '{
    "symbol": "AAPL",
    "quantity": 10,
    "orderType": "limit",
    "limitPrice": 145.00
  }'
```

## Estructura del proyecto

```
tp-tup-tt-utn-patrones/
├── src/
│   ├── config/           # Configuración
│   ├── controllers/      # Controladores HTTP
│   ├── middleware/       # Middlewares
│   ├── models/          # Tipos y modelos
│   ├── routes/          # Definición de rutas
│   ├── services/        # Lógica de negocio
│   ├── utils/           # Utilidades
│   └── index.ts         # Punto de entrada
├── postman/             # Colección de Postman
├── dist/                # Código compilado
├── README.md            # Documentación principal
└── test-api.sh          # Script de pruebas
```

## Solución de problemas

### Error: "Cannot find module"

```bash
rm -rf node_modules package-lock.json
npm install
```

### Error: Puerto ocupado

Cambia el puerto usando una variable de entorno:

```bash
PORT=3001 npm run dev
```

### Error: API key inválida

Asegúrate de usar una de las API keys válidas:

- `demo-key-123`
- `admin-key-456`
- `trader-key-789`

### El servidor no responde

Verifica que el servidor esté ejecutándose y escuchando en el puerto correcto.

## Objetivos pedagógicos

Este proyecto está diseñado para que los estudiantes:

1. **Identifiquen problemas de diseño** en el código existente
2. **Trabajen en equipo** desarrollando nuevas funcionalidades
3. **Mantengan la funcionalidad** existente mientras desarrollan
4. **Documenten su trabajo** y decisiones de implementación

## Próximos pasos

1. Explorar el código fuente y analizar su estructura actual
2. Identificar áreas para desarrollar nuevas funcionalidades
3. Implementar mejoras que agreguen valor al sistema
4. Verificar que la funcionalidad se mantiene intacta después de los cambios

## Notas importantes

⚠️ **Solo para uso educativo**: Esta API simula operaciones financieras y no debe usarse en producción.
⚠️ **Sin base de datos**: Todos los datos se almacenan en memoria y se pierden al reiniciar.
⚠️ **Autenticación simplificada**: El sistema de autenticación es básico y no debe usarse en producción.

---

**¡Buena suerte con la refactorización!** 🚀

_Proyecto educativo - UTN - Metodología de Sistemas II_
