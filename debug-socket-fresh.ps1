#!/usr/bin/env powershell

# Debug Socket Service - Fresh Compilation Script
# This script ensures a completely fresh compilation before debugging

Write-Host "🧹 Clearing all caches and stopping processes..." -ForegroundColor Yellow

# Stop any running Node processes
Stop-Process -Name node -Force -ErrorAction SilentlyContinue

# Remove all cache directories
Remove-Item -Path '.ts-node' -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path 'node_modules/.cache' -Recurse -Force -ErrorAction SilentlyContinue
Remove-Item -Path 'dist' -Recurse -Force -ErrorAction SilentlyContinue

Write-Host "✅ Caches cleared" -ForegroundColor Green

Write-Host "🔄 Starting fresh compilation with debugger..." -ForegroundColor Yellow

# Set environment variables for fresh compilation
$env:NODE_ENV = "development"
$env:TS_NODE_CACHE = "0"
$env:TS_NODE_TRANSPILE_ONLY = "true"
$env:TS_NODE_COMPILER_OPTIONS = '{"module": "commonjs"}'
$env:TS_NODE_SKIP_PROJECT = "true"

# Run with debugger
node -r ts-node/register --inspect-brk=9229 src/containers/socket-server.service.ts
