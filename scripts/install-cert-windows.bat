@echo off
echo Установка сертификата в хранилище доверенных корневых центров сертификации Windows

set SCRIPT_DIR=%~dp0
set CERT_PATH=%SCRIPT_DIR%..\certificates\cert.pem

echo Путь к сертификату: %CERT_PATH%

certutil -addstore -f "ROOT" %CERT_PATH%

echo.
echo Сертификат установлен. Пожалуйста, перезапустите браузер.
pause 