@echo off
cd /d C:\GMMF\gmmf_donut_nextjs
if exist .next rmdir /S /Q .next
npm run dev
pause
