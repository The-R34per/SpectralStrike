@echo off
echo Starting Attack Surface Dashboard...

REM Start backend
start cmd /k "cd backend && python -m uvicorn main:app --reload"

REM Wait a moment for backend to boot
timeout /t 2 >nul

REM Start frontend
start cmd /k "cd frontend && npm run dev"

echo Dashboard is running!
