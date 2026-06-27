#!/bin/bash

echo "Starting Attack Surface Dashboard..."

# Start backend
(cd backend && python3 -m uvicorn main:app --reload) &

# Wait a moment
sleep 2

# Start frontend
(cd frontend && npm run dev) &

echo "Dashboard is running!"
