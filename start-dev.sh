#!/bin/bash

echo "🚀 Starting SmartJobFit Development Environment..."

# Function to cleanup background processes on exit
cleanup() {
    echo "🛑 Stopping development servers..."
    kill $FRONTEND_PID $API_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start Mock API Server
echo "📡 Starting Mock API Server on port 3001..."
npx tsx server/mock-api.ts &
API_PID=$!

# Wait a moment for API to start
sleep 2

# Start Frontend Development Server
echo "🎨 Starting Frontend Development Server on port 3000..."
cd client && npx vite --port 3000 --host &
FRONTEND_PID=$!

# Wait for both servers to start
sleep 3

echo ""
echo "✅ SmartJobFit Development Environment is Ready!"
echo ""
echo "🌐 Frontend: http://localhost:3000"
echo "📊 Dashboard: http://localhost:3000/dashboard"
echo "📡 Mock API: http://localhost:3001"
echo "🔍 Health Check: http://localhost:3001/api/health"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for user to stop
wait 