<<<<<<< HEAD
@echo off
echo ========================================
echo    VIANDENT Backend - Prueba Rapida
echo ========================================
echo.

echo [1/3] Verificando servidor...
curl -s http://localhost:3000/api/health >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Servidor no responde
    echo Asegúrate de que el servidor esté ejecutándose con: npm start
    pause
    exit /b 1
)
echo ✅ Servidor responde

echo.
echo [2/3] Probando API de chat...
curl -s -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d "{\"message\":\"Hola\"}" >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: API de chat no responde
    pause
    exit /b 1
)
echo ✅ API de chat funciona

echo.
echo [3/3] Verificando configuracion...
if not exist ".env" (
    echo ⚠️  ADVERTENCIA: Archivo .env no encontrado
    echo Crea el archivo .env con tu GEMINI_API_KEY real
) else (
    echo ✅ Archivo .env encontrado
)

echo.
echo ========================================
echo    ✅ Pruebas completadas!
echo ========================================
echo.
echo Si todo está OK, abre: http://localhost:3000
echo.
=======
@echo off
echo ========================================
echo    VIANDENT Backend - Prueba Rapida
echo ========================================
echo.

echo [1/3] Verificando servidor...
curl -s http://localhost:3000/api/health >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: Servidor no responde
    echo Asegúrate de que el servidor esté ejecutándose con: npm start
    pause
    exit /b 1
)
echo ✅ Servidor responde

echo.
echo [2/3] Probando API de chat...
curl -s -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d "{\"message\":\"Hola\"}" >nul 2>&1
if errorlevel 1 (
    echo ❌ ERROR: API de chat no responde
    pause
    exit /b 1
)
echo ✅ API de chat funciona

echo.
echo [3/3] Verificando configuracion...
if not exist ".env" (
    echo ⚠️  ADVERTENCIA: Archivo .env no encontrado
    echo Crea el archivo .env con tu GEMINI_API_KEY real
) else (
    echo ✅ Archivo .env encontrado
)

echo.
echo ========================================
echo    ✅ Pruebas completadas!
echo ========================================
echo.
echo Si todo está OK, abre: http://localhost:3000
echo.
>>>>>>> e76122fb1f5d22d725def40b340c9f5e3044d848
pause