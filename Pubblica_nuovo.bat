@echo off
setlocal

cd /d "c:\Sviluppo\Progetti\GiocoLoCa"

echo.
echo ========================================
echo        PUBBLICAZIONE GIOCOLOCA
echo ========================================
echo.

echo [1/4] Aggiorno la versione dei file CSS e JS...

for /f %%V in ('powershell -NoProfile -Command "Get-Date -Format yyyyMMddHHmmss"') do set "VERSION=%%V"

powershell -NoProfile -ExecutionPolicy Bypass -Command ^
"$p='index.html'; $s=Get-Content -Raw -Encoding UTF8 $p; $v=$env:VERSION; $s=[regex]::Replace($s,'((?:src|href)=\x22[^\x22]+\.(?:js|css))(?:\?v=[^\x22]*)?(\x22)',('$1?v='+$v+'$2')); Set-Content -Encoding UTF8 $p $s"

echo Versione: %VERSION%

echo.
echo [2/4] Aggiungo le modifiche...
git add .

echo.
echo [3/4] Creo il commit...
git commit -m "Aggiornamento GiocoLoCa %VERSION%"

echo.
echo [4/4] Invio a GitHub...
git push origin main

echo.
echo ========================================
echo        PUBBLICAZIONE COMPLETATA
echo ========================================
echo.
echo I file CSS e JS hanno ora una nuova versione.
echo Gli utenti non dovrebbero piu' dover usare CTRL+F5.
echo.
pause
endlocal
