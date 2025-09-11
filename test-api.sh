#!/bin/bash

# Script de pruebas para la Financial Broker API
# Ejecutar después de levantar el servidor con: npm run dev

BASE_URL="http://localhost:3000"
API_KEY="demo-key-123"

echo "🚀 Iniciando pruebas de la Financial Broker API"
echo "================================================"

# 1. Health Check
echo -e "\n📊 1. Health Check"
echo "-------------------"
curl -s -X GET "$BASE_URL/health" | python3 -m json.tool

# 2. Validar API Key
echo -e "\n🔐 2. Validando API Key"
echo "------------------------"
curl -s -X GET "$BASE_URL/api/auth/validate" \
  -H "x-api-key: $API_KEY" | python3 -m json.tool

# 3. Obtener perfil de usuario
echo -e "\n👤 3. Perfil de usuario"
echo "------------------------"
curl -s -X GET "$BASE_URL/api/users/profile" \
  -H "x-api-key: $API_KEY" | python3 -m json.tool

# 4. Obtener precios de mercado
echo -e "\n💹 4. Precios de mercado"
echo "-------------------------"
curl -s -X GET "$BASE_URL/api/market/prices" \
  -H "x-api-key: $API_KEY" | python3 -m json.tool

# 5. Obtener precio específico
echo -e "\n📈 5. Precio de AAPL"
echo "---------------------"
curl -s -X GET "$BASE_URL/api/market/prices/AAPL" \
  -H "x-api-key: $API_KEY" | python3 -m json.tool

# 6. Ver portafolio inicial (debería estar vacío)
echo -e "\n📁 6. Portafolio inicial"
echo "-------------------------"
curl -s -X GET "$BASE_URL/api/portfolio" \
  -H "x-api-key: $API_KEY" | python3 -m json.tool

# 7. Comprar activos (orden de mercado)
echo -e "\n💰 7. Comprando 10 acciones de AAPL"
echo "-------------------------------------"
curl -s -X POST "$BASE_URL/api/trading/buy" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "symbol": "AAPL",
    "quantity": 10,
    "orderType": "market"
  }' | python3 -m json.tool

# 8. Ver portafolio después de la compra
echo -e "\n📁 8. Portafolio después de compra"
echo "-----------------------------------"
curl -s -X GET "$BASE_URL/api/portfolio" \
  -H "x-api-key: $API_KEY" | python3 -m json.tool

# 9. Comprar con orden límite
echo -e "\n💰 9. Comprando 2 acciones de GOOGL (orden límite)"
echo "----------------------------------------------------"
curl -s -X POST "$BASE_URL/api/trading/buy" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "symbol": "GOOGL",
    "quantity": 2,
    "orderType": "limit",
    "limitPrice": 2600.00
  }' | python3 -m json.tool

# 10. Ver historial de transacciones
echo -e "\n📋 10. Historial de transacciones"
echo "----------------------------------"
curl -s -X GET "$BASE_URL/api/trading/history" \
  -H "x-api-key: $API_KEY" | python3 -m json.tool

# 11. Análisis de riesgo
echo -e "\n⚠️ 11. Análisis de riesgo"
echo "--------------------------"
curl -s -X GET "$BASE_URL/api/analysis/risk" \
  -H "x-api-key: $API_KEY" | python3 -m json.tool

# 12. Recomendaciones de inversión
echo -e "\n🎯 12. Recomendaciones de inversión"
echo "------------------------------------"
curl -s -X GET "$BASE_URL/api/analysis/recommendations" \
  -H "x-api-key: $API_KEY" | python3 -m json.tool

# 13. Análisis de rendimiento
echo -e "\n📊 13. Análisis de rendimiento"
echo "-------------------------------"
curl -s -X GET "$BASE_URL/api/portfolio/performance" \
  -H "x-api-key: $API_KEY" | python3 -m json.tool

# 14. Vender algunos activos
echo -e "\n💸 14. Vendiendo 5 acciones de AAPL"
echo "-------------------------------------"
curl -s -X POST "$BASE_URL/api/trading/sell" \
  -H "Content-Type: application/json" \
  -H "x-api-key: $API_KEY" \
  -d '{
    "symbol": "AAPL",
    "quantity": 5,
    "orderType": "market"
  }' | python3 -m json.tool

# 15. Perfil final
echo -e "\n👤 15. Perfil final (balance actualizado)"
echo "------------------------------------------"
curl -s -X GET "$BASE_URL/api/users/profile" \
  -H "x-api-key: $API_KEY" | python3 -m json.tool

echo -e "\n✅ Pruebas completadas!"
echo "========================"
echo "🌐 Documentación Swagger: $BASE_URL/api-docs"
echo "📁 Colección de Postman: ./postman/Financial-Broker-API.postman_collection.json"
