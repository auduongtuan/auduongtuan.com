#!/bin/bash
# Simple setup script - no activation needed

echo "🎵 Setting up YouTube Music API Server..."

# Create virtual environment
echo "📦 Creating virtual environment..."
python3 -m venv venv

# Install dependencies using venv pip directly
echo "📥 Installing dependencies..."
venv/bin/pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the server:"
echo "  cd python-server"
echo "  ./run.sh"
echo ""
echo "That's it! No activation needed."
