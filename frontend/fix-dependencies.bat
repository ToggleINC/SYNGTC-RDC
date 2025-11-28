@echo off
echo ========================================
echo Correction des dependances Frontend
echo ========================================
echo.

echo Suppression de node_modules...
if exist node_modules (
    rmdir /s /q node_modules
    echo node_modules supprime.
) else (
    echo node_modules n'existe pas.
)

echo.
echo Suppression de package-lock.json...
if exist package-lock.json (
    del package-lock.json
    echo package-lock.json supprime.
) else (
    echo package-lock.json n'existe pas.
)

echo.
echo Nettoyage du cache npm...
call npm cache clean --force

echo.
echo Installation des dependances avec --legacy-peer-deps...
call npm install --legacy-peer-deps

echo.
echo ========================================
echo Installation terminee !
echo ========================================
echo.
echo Vous pouvez maintenant executer: npm start
pause

