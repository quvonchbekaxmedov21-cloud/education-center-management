#!/bin/bash

# Education Center Management System - Quick Deploy Script
# This script helps you deploy to Vercel or Netlify

echo "🎓 Education Center Management System - Deploy Helper"
echo "======================================================"
echo ""

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo "✅ Dependencies installed!"
    echo ""
fi

# Ask user which platform to deploy to
echo "Where do you want to deploy?"
echo "1) Vercel (Recommended)"
echo "2) Netlify"
echo "3) Build locally only"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo ""
        echo "🚀 Deploying to Vercel..."
        echo ""
        echo "Make sure you have Vercel CLI installed:"
        echo "  npm i -g vercel"
        echo ""
        echo "Then run:"
        echo "  vercel"
        echo ""
        echo "Or deploy via GitHub:"
        echo "1. Push this repo to GitHub"
        echo "2. Go to vercel.com"
        echo "3. Import your repository"
        echo "4. Click Deploy!"
        ;;
    2)
        echo ""
        echo "🚀 Building for Netlify..."
        npm run build
        echo ""
        echo "✅ Build complete!"
        echo ""
        echo "Next steps:"
        echo "1. Go to netlify.com"
        echo "2. Drag and drop the 'dist' folder"
        echo "3. Your site will be live!"
        ;;
    3)
        echo ""
        echo "🔨 Building locally..."
        npm run build
        echo ""
        echo "✅ Build complete! Check the 'dist' folder"
        echo ""
        echo "To preview locally, run:"
        echo "  npx vite preview"
        ;;
    *)
        echo "❌ Invalid choice. Please run the script again."
        exit 1
        ;;
esac

echo ""
echo "📚 Documentation:"
echo "  - QUICKSTART.md - Quick deployment guide"
echo "  - DEPLOYMENT.md - Detailed deployment guide"
echo "  - DEPLOYMENT_CHECKLIST.md - Pre/post deployment checklist"
echo ""
echo "🎭 Demo Accounts:"
echo "  Admin:   admin@school.com / admin123"
echo "  Teacher: teacher1@school.com / teacher123"
echo "  Student: student1@school.com / student123"
echo "  Parent:  parent1@school.com / parent123"
echo ""
echo "🎉 Good luck with your deployment!"
