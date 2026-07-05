@echo off
chcp 65001 >nul
title 墨韵诗境 - AI中国古诗词生成器

echo.
echo    =============================
echo     墨韵诗境 ◎ AI中国古诗词生成器
echo    =============================
echo.
echo   正在启动...

cd /d "%~dp0"
start "" http://localhost:3000
node server.js

pause
