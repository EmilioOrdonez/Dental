#!/bin/bash

echo "========================================"
echo "   VIANDENT Backend - Instalacion"
echo "========================================"
echo

echo "[1/4] Verificando Node.js..."
if ! command -v node &> /dev/null; then
    echo "❌ ERROR: Node.js no esta instalado."
    echo "Descarga Node.js desde: https://nodejs.org"
    exit 1
fi
echo "✅ Node.js encontrado"

echo
echo "[2/4] Instalando dependencias..."
if ! npm install; then
    echo "❌ ERROR: Fallo al instalar dependencias"
    exit 1
fi
echo "✅ Dependencias instaladas"

echo
echo "[3/4] Verificando configuracion..."
if [ ! -f ".env" ]; then
    echo "❌ ERROR: Archivo .env no encontrado"
    echo "Crea el archivo .env con tu GEMINI_API_KEY"
    exit 1
fi
echo "✅ Archivo .env encontrado"

echo
echo "[4/4] Iniciando servidor..."
echo
echo "========================================"
echo "   🚀 Servidor listo!"
echo "========================================"
echo "📱 Frontend: http://localhost:3000"
echo "🔗 API Health: http://localhost:3000/api/health"
echo "💬 API Chat: http://localhost:3000/api/chat"
echo "========================================"
echo
echo "Presiona Ctrl+C para detener el servidor"
echo

npm start