#!/bin/bash

echo "🚀 WebCraft Studio Deployment Script"
echo "======================================"

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ Error: .env.local file not found!"
    echo "Please copy .env.local.example to .env.local and configure your environment variables."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the application
echo "🔨 Building application..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
else
    echo "❌ Build failed!"
    exit 1
fi

echo ""
echo "🎉 Application is ready for deployment!"
echo ""
echo "Next steps:"
echo "1. Push your code to GitHub"
echo "2. Connect your repository to Vercel"
echo "3. Add environment variables in Vercel dashboard"
echo "4. Deploy!"
echo ""
echo "Environment variables to add in Vercel:"
echo "- V0_API_KEY"
echo "- MASTER_PAYOUT_ADDRESS"
echo "- JWT_SECRET"
echo "- NEXTAUTH_SECRET"
echo "- ETHEREUM_RPC_URL (optional, defaults to https://eth.llamarpc.com)"
echo ""
echo "For local development, run: npm run dev"
