#!/bin/bash
# Simple runner script - no activation needed

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Check if venv exists
if [ ! -d "venv" ]; then
    echo "❌ Virtual environment not found. Running setup..."
    ./setup.sh
fi

# Run using venv python directly
echo "🎵 Starting YouTube Music API Server..."
venv/bin/python server.py
