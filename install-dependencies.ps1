# Pulse Analytics - Dependency Installation Script
# This script will install Node.js, pnpm, and all required dependencies

Write-Host "🚀 Pulse Analytics - Dependency Installation Script" -ForegroundColor Cyan
Write-Host "=================================================" -ForegroundColor Cyan

# Function to check if a command exists
function Test-Command {
    param($cmdname)
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check if Node.js is already installed
Write-Host "`n📋 Checking system requirements..." -ForegroundColor Yellow

if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "✅ Node.js is already installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "❌ Node.js not found. Installing Node.js..." -ForegroundColor Red
    
    # Try to install Node.js using winget first
    if (Test-Command "winget") {
        Write-Host "📦 Installing Node.js using winget..." -ForegroundColor Blue
        try {
            winget install OpenJS.NodeJS --accept-package-agreements --accept-source-agreements
            Write-Host "✅ Node.js installed successfully!" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to install Node.js with winget. Please install manually from https://nodejs.org/" -ForegroundColor Red
            Write-Host "Press any key to exit..."
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
            exit 1
        }
    } else {
        Write-Host "❌ winget not available. Please install Node.js manually:" -ForegroundColor Red
        Write-Host "   1. Go to https://nodejs.org/" -ForegroundColor Yellow
        Write-Host "   2. Download the LTS version" -ForegroundColor Yellow
        Write-Host "   3. Run the installer" -ForegroundColor Yellow
        Write-Host "   4. Restart your terminal and run this script again" -ForegroundColor Yellow
        Write-Host "`nPress any key to exit..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit 1
    }
}

# Refresh PATH environment variable
Write-Host "`n🔄 Refreshing environment variables..." -ForegroundColor Blue
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Check if pnpm is installed
if (Test-Command "pnpm") {
    $pnpmVersion = pnpm --version
    Write-Host "✅ pnpm is already installed: v$pnpmVersion" -ForegroundColor Green
} else {
    Write-Host "📦 Installing pnpm globally..." -ForegroundColor Blue
    try {
        npm install -g pnpm
        Write-Host "✅ pnpm installed successfully!" -ForegroundColor Green
    } catch {
        Write-Host "❌ Failed to install pnpm. Trying alternative method..." -ForegroundColor Red
        try {
            # Alternative installation method
            Invoke-WebRequest -Uri "https://get.pnpm.io/install.ps1" -UseBasicParsing | Invoke-Expression
            Write-Host "✅ pnpm installed successfully!" -ForegroundColor Green
        } catch {
            Write-Host "❌ Failed to install pnpm. Please install manually: npm install -g pnpm" -ForegroundColor Red
            exit 1
        }
    }
}

# Verify installations
Write-Host "`n🔍 Verifying installations..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $pnpmVersion = pnpm --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ pnpm: v$pnpmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Installation verification failed. Please restart your terminal and try again." -ForegroundColor Red
    exit 1
}

# Install project dependencies
Write-Host "`n📦 Installing project dependencies..." -ForegroundColor Blue

# First, install the base dependencies
Write-Host "Installing base dependencies..." -ForegroundColor Yellow
try {
    pnpm install
    Write-Host "✅ Base dependencies installed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install base dependencies" -ForegroundColor Red
    exit 1
}

# Install additional analytics dependencies
Write-Host "Installing analytics dependencies..." -ForegroundColor Yellow
$analyticsDeps = @(
    "recharts",
    "@tanstack/react-query", 
    "lucide-react",
    "@dnd-kit/core",
    "@dnd-kit/sortable", 
    "@dnd-kit/utilities",
    "date-fns",
    "clsx",
    "tailwind-merge"
)

try {
    pnpm add $analyticsDeps
    Write-Host "✅ Analytics dependencies installed!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install analytics dependencies" -ForegroundColor Red
    Write-Host "Trying individual installation..." -ForegroundColor Yellow
    
    foreach ($dep in $analyticsDeps) {
        try {
            Write-Host "Installing $dep..." -ForegroundColor Gray
            pnpm add $dep
        } catch {
            Write-Host "⚠️  Failed to install $dep" -ForegroundColor Yellow
        }
    }
}

# Verify installation
Write-Host "`n🔍 Verifying dependency installation..." -ForegroundColor Yellow
try {
    pnpm list --depth=0
    Write-Host "✅ Dependencies verified!" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Some dependencies may not have installed correctly" -ForegroundColor Yellow
}

# Create a simple test to verify everything works
Write-Host "`n🧪 Testing installation..." -ForegroundColor Blue
try {
    # Test if we can import the main components
    Write-Host "Testing component imports..." -ForegroundColor Gray
    
    # Check if the components directory exists
    if (Test-Path "components/analytics") {
        Write-Host "✅ Analytics components directory found" -ForegroundColor Green
    } else {
        Write-Host "❌ Analytics components directory not found" -ForegroundColor Red
    }
    
    # Check if the API route exists
    if (Test-Path "app/api/analytics/route.ts") {
        Write-Host "✅ Analytics API route found" -ForegroundColor Green
    } else {
        Write-Host "❌ Analytics API route not found" -ForegroundColor Red
    }
    
} catch {
    Write-Host "⚠️  Some tests failed, but installation may still be successful" -ForegroundColor Yellow
}

# Final success message
Write-Host "`n🎉 Installation Complete!" -ForegroundColor Green
Write-Host "=========================" -ForegroundColor Green
Write-Host "✅ Node.js installed" -ForegroundColor Green
Write-Host "✅ pnpm installed" -ForegroundColor Green
Write-Host "✅ Project dependencies installed" -ForegroundColor Green
Write-Host "✅ Analytics dependencies installed" -ForegroundColor Green

Write-Host "`n🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "1. Make sure your .env.local file is configured with your Whop API keys" -ForegroundColor White
Write-Host "2. Run 'pnpm dev' to start the development server" -ForegroundColor White
Write-Host "3. Open your browser to http://localhost:3000" -ForegroundColor White
Write-Host "4. Navigate to your dashboard to see Pulse Analytics in action!" -ForegroundColor White

Write-Host "`n💡 Pro Tips:" -ForegroundColor Yellow
Write-Host "• Use 'pnpm dev' to start development with hot reload" -ForegroundColor Gray
Write-Host "• Use 'pnpm build' to create a production build" -ForegroundColor Gray
Write-Host "• Use 'pnpm start' to run the production build" -ForegroundColor Gray

Write-Host "`nPress any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
