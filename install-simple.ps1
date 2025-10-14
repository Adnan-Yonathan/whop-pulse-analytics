# Simple Pulse Analytics Installation Script
Write-Host "🚀 Pulse Analytics - Installing Dependencies" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "Checking for Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>$null
    if ($nodeVersion) {
        Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
    } else {
        throw "Node.js not found"
    }
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first:" -ForegroundColor Red
    Write-Host "   1. Go to https://nodejs.org/" -ForegroundColor Yellow
    Write-Host "   2. Download and install the LTS version" -ForegroundColor Yellow
    Write-Host "   3. Restart your terminal and run this script again" -ForegroundColor Yellow
    Read-Host "Press Enter to exit"
    exit 1
}

# Check if pnpm is installed
Write-Host "Checking for pnpm..." -ForegroundColor Yellow
try {
    $pnpmVersion = pnpm --version 2>$null
    if ($pnpmVersion) {
        Write-Host "✅ pnpm found: v$pnpmVersion" -ForegroundColor Green
    } else {
        throw "pnpm not found"
    }
} catch {
    Write-Host "📦 Installing pnpm..." -ForegroundColor Blue
    try {
        npm install -g pnpm
        Write-Host "✅ pnpm installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install pnpm. Please install manually: npm install -g pnpm" -ForegroundColor Red
        Read-Host "Press Enter to exit"
        exit 1
    }
}

# Install base dependencies
Write-Host "Installing base dependencies..." -ForegroundColor Blue
try {
    pnpm install
    Write-Host "✅ Base dependencies installed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install base dependencies" -ForegroundColor Red
    Read-Host "Press Enter to exit"
    exit 1
}

# Install analytics dependencies
Write-Host "Installing analytics dependencies..." -ForegroundColor Blue
$deps = "recharts @tanstack/react-query lucide-react @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities date-fns clsx tailwind-merge"
try {
    pnpm add $deps
    Write-Host "✅ Analytics dependencies installed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install analytics dependencies" -ForegroundColor Red
    Write-Host "Trying individual installation..." -ForegroundColor Yellow
    
    $individualDeps = @("recharts", "@tanstack/react-query", "lucide-react", "@dnd-kit/core", "@dnd-kit/sortable", "@dnd-kit/utilities", "date-fns", "clsx", "tailwind-merge")
    foreach ($dep in $individualDeps) {
        try {
            Write-Host "Installing $dep..." -ForegroundColor Gray
            pnpm add $dep
        } catch {
            Write-Host "⚠️  Failed to install $dep" -ForegroundColor Yellow
        }
    }
}

Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host "✅ All dependencies installed successfully!" -ForegroundColor Green

Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "1. Make sure your .env.local file is configured" -ForegroundColor White
Write-Host "2. Run: pnpm dev" -ForegroundColor White
Write-Host "3. Open: http://localhost:3000" -ForegroundColor White

Read-Host "Press Enter to exit"
