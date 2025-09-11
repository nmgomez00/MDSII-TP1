#!/bin/bash

# Script de desarrollo con hot reload
echo "🔥 Iniciando servidor en modo desarrollo..."
echo "📁 Monitoreando cambios en src/"
echo "⚡ El servidor se reiniciará automáticamente cuando hagas cambios"
echo ""
echo "Para detener el servidor, presiona Ctrl+C"
echo ""

# Exportar variable de entorno
export NODE_ENV=development

# Ejecutar nodemon
npm run watch
