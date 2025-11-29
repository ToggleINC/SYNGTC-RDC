@echo off
REM Script de nettoyage pour Fly.io
REM Supprime les machines créées lors d'un mauvais déploiement

echo ========================================
echo Nettoyage Fly.io - Machines
echo ========================================
echo.

REM Vérifier que flyctl est installé
where flyctl >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERREUR] flyctl n'est pas installé.
    echo Installez-le depuis : https://fly.io/docs/hands-on/install-flyctl/
    pause
    exit /b 1
)

echo [1/4] Liste des applications Fly.io...
flyctl apps list
echo.

echo [2/4] Liste des machines de l'application syngtc-rdc...
flyctl machines list -a syngtc-rdc
echo.

echo [3/4] ATTENTION : Voulez-vous supprimer toutes les machines ?
echo Cela supprimera toutes les machines de l'application syngtc-rdc.
echo.
set /p confirm="Tapez 'OUI' pour confirmer : "

if /i not "%confirm%"=="OUI" (
    echo Nettoyage annulé.
    pause
    exit /b 0
)

echo.
echo [4/4] Suppression des machines...
for /f "tokens=1" %%i in ('flyctl machines list -a syngtc-rdc --json ^| findstr /i "id"') do (
    echo Suppression de la machine %%i...
    flyctl machines destroy %%i --force -a syngtc-rdc
)

echo.
echo ========================================
echo Nettoyage terminé !
echo ========================================
echo.
echo Vous pouvez maintenant redéployer avec :
echo   flyctl deploy --remote-only
echo.
pause

