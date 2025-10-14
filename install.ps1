Write-Host "Pulse Analytics - Installing Dependencies" -ForegroundColor Cyan

Write-Host "Checking for Node.js..." -ForegroundColor Yellow
try {
    node --version
    Write-Host "Node.js found!" -ForegroundColor Green
} catch {
    Write-Host "Node.js not found. Please install from https://nodejs.org/" -ForegroundColor Red
    pause
    exit 1
}

Write-Host "Checking for pnpm..." -ForegroundColor Yellow
try {
    pnpm --version
    Write-Host "pnpm found!" -ForegroundColor Green
} catch {
    Write-Host "Installing pnpm..." -ForegroundColor Blue
    npm install -g pnpm
}

Write-Host "Installing base dependencies..." -ForegroundColor Blue
pnpm install

Write-Host "Installing analytics dependencies..." -ForegroundColor Blue
pnpm add recharts @tanstack/react-query lucide-react @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities date-fns clsx tailwind-merge

Write-Host "Installation Complete!" -ForegroundColor Green
Write-Host "Run: pnpm dev" -ForegroundColor Cyan
pause
